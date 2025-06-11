const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors()); // Enable CORS for frontend integration
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with size limit
app.use(express.static('public')); // Serve static files from public directory

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  
  // Log response status after request completes
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode}`);
    originalSend.call(this, data);
  };
  
  next();
});

/**
 * Database helper functions
 */

/**
 * Read database from file
 * @returns {Promise<Object>} Database object
 */
async function readDatabase() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create empty database
      console.log('Database file not found, creating new one...');
      const emptyDb = {};
      await writeDatabase(emptyDb);
      return emptyDb;
    }
    throw new Error(`Failed to read database: ${error.message}`);
  }
}

/**
 * Write database to file
 * @param {Object} data - Database object to write
 */
async function writeDatabase(data) {
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new Error(`Failed to write database: ${error.message}`);
  }
}

/**
 * Get the next available ID for a collection
 * @param {Array} collection - Array of items
 * @returns {number} Next available ID
 */
function getNextId(collection) {
  if (!Array.isArray(collection) || collection.length === 0) {
    return 1;
  }
  
  const maxId = Math.max(...collection.map(item => 
    typeof item.id === 'number' ? item.id : 0
  ));
  
  return maxId + 1;
}

/**
 * Validate if an item has required structure
 * @param {*} item - Item to validate
 * @returns {boolean} True if valid
 */
function isValidItem(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Find item by ID in collection
 * @param {Array} collection - Collection to search
 * @param {string|number} id - ID to find
 * @returns {Object|null} Found item or null
 */
function findItemById(collection, id) {
  const numericId = parseInt(id);
  return collection.find(item => item.id === numericId) || null;
}

/**
 * Remove item by ID from collection
 * @param {Array} collection - Collection to modify
 * @param {string|number} id - ID to remove
 * @returns {boolean} True if item was removed
 */
function removeItemById(collection, id) {
  const numericId = parseInt(id);
  const index = collection.findIndex(item => item.id === numericId);
  if (index !== -1) {
    collection.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * API Routes
 */

// Get all available collections
app.get('/collections', async (req, res) => {
  try {
    const db = await readDatabase();
    const collections = Object.keys(db).map(key => ({
      name: key,
      count: Array.isArray(db[key]) ? db[key].length : 0
    }));
    
    res.json({
      collections,
      total: collections.length
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch collections'
    });
  }
});

// GET /collection - Get all items in a collection
app.get('/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const db = await readDatabase();
    
    // Create collection if it doesn't exist
    if (!db[collection]) {
      db[collection] = [];
      await writeDatabase(db);
    }
    
    res.json({
      collection,
      data: db[collection],
      count: db[collection].length
    });
  } catch (error) {
    console.error(`Error fetching collection ${req.params.collection}:`, error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch collection'
    });
  }
});

// GET /collection/:id - Get single item by ID
app.get('/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;
    const db = await readDatabase();
    
    if (!db[collection]) {
      return res.status(404).json({ 
        error: 'Collection not found',
        message: `Collection '${collection}' does not exist`
      });
    }
    
    const item = findItemById(db[collection], id);
    if (!item) {
      return res.status(404).json({ 
        error: 'Item not found',
        message: `Item with id ${id} not found in collection '${collection}'`
      });
    }
    
    res.json(item);
  } catch (error) {
    console.error(`Error fetching item ${req.params.id} from ${req.params.collection}:`, error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch item'
    });
  }
});

// POST /collection - Create new item
app.post('/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const newItem = req.body;
    
    if (!isValidItem(newItem)) {
      return res.status(400).json({ 
        error: 'Invalid request body',
        message: 'Request body must be a valid JSON object'
      });
    }
    
    const db = await readDatabase();
    
    // Create collection if it doesn't exist
    if (!db[collection]) {
      db[collection] = [];
    }
    
    // Assign unique ID if not provided
    if (!newItem.id) {
      newItem.id = getNextId(db[collection]);
    } else {
      // Validate that provided ID doesn't already exist
      const existingItem = findItemById(db[collection], newItem.id);
      if (existingItem) {
        return res.status(409).json({ 
          error: 'ID already exists',
          message: `Item with id ${newItem.id} already exists in collection '${collection}'`
        });
      }
    }
    
    // Add timestamps
    newItem.createdAt = new Date().toISOString();
    newItem.updatedAt = newItem.createdAt;
    
    db[collection].push(newItem);
    await writeDatabase(db);
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error(`Error creating item in ${req.params.collection}:`, error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create item'
    });
  }
});

// PUT /collection/:id - Update item by ID
app.put('/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;
    const updates = req.body;
    
    if (!isValidItem(updates)) {
      return res.status(400).json({ 
        error: 'Invalid request body',
        message: 'Request body must be a valid JSON object'
      });
    }
    
    const db = await readDatabase();
    
    if (!db[collection]) {
      return res.status(404).json({ 
        error: 'Collection not found',
        message: `Collection '${collection}' does not exist`
      });
    }
    
    const numericId = parseInt(id);
    const itemIndex = db[collection].findIndex(item => item.id === numericId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ 
        error: 'Item not found',
        message: `Item with id ${id} not found in collection '${collection}'`
      });
    }
    
    // Preserve original ID and timestamps
    const originalItem = db[collection][itemIndex];
    const updatedItem = {
      ...originalItem,
      ...updates,
      id: originalItem.id, // Ensure ID cannot be changed
      createdAt: originalItem.createdAt, // Preserve creation time
      updatedAt: new Date().toISOString()
    };
    
    db[collection][itemIndex] = updatedItem;
    await writeDatabase(db);
    
    res.json(updatedItem);
  } catch (error) {
    console.error(`Error updating item ${req.params.id} in ${req.params.collection}:`, error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update item'
    });
  }
});

// DELETE /collection/:id - Delete item by ID
app.delete('/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;
    const db = await readDatabase();
    
    if (!db[collection]) {
      return res.status(404).json({ 
        error: 'Collection not found',
        message: `Collection '${collection}' does not exist`
      });
    }
    
    const removed = removeItemById(db[collection], id);
    
    if (!removed) {
      return res.status(404).json({ 
        error: 'Item not found',
        message: `Item with id ${id} not found in collection '${collection}'`
      });
    }
    
    await writeDatabase(db);
    
    res.json({ 
      message: `Item with id ${id} deleted successfully from collection '${collection}'`,
      deletedId: parseInt(id)
    });
  } catch (error) {
    console.error(`Error deleting item ${req.params.id} from ${req.params.collection}:`, error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete item'
    });
  }
});

// API endpoint to update database structure from domain discovery
app.post('/api/update-database', async (req, res) => {
  try {
    const newStructure = req.body;
    
    if (!newStructure || typeof newStructure !== 'object') {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Expected a valid database structure object'
      });
    }
    
    // Read existing database
    const currentDb = await readDatabase();
    
    // Merge new structure with existing data
    const mergedDb = { ...currentDb };
    
    // Add new collections or update existing ones
    Object.keys(newStructure).forEach(collection => {
      if (!mergedDb[collection]) {
        // New collection - use the sample data
        mergedDb[collection] = newStructure[collection];
      }
      // If collection exists, we keep existing data but could add schema info later
    });
    
    // Write updated database
    await writeDatabase(mergedDb);
    
    res.json({
      message: 'Database structure updated successfully',
      addedCollections: Object.keys(newStructure).filter(key => !currentDb[key]),
      existingCollections: Object.keys(newStructure).filter(key => currentDb[key]),
      totalCollections: Object.keys(mergedDb).length
    });
    
  } catch (error) {
    console.error('Error updating database structure:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update database structure'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'PILLAR JSON Server is running',
    version: '1.0.0',
    endpoints: {
      collections: 'GET /collections',
      getAll: 'GET /:collection',
      getOne: 'GET /:collection/:id',
      create: 'POST /:collection',
      update: 'PUT /:collection/:id',
      delete: 'DELETE /:collection/:id',
      updateDatabase: 'POST /api/update-database'
    },
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Handle 404 for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /',
      'GET /collections',
      'GET /:collection',
      'GET /:collection/:id',
      'POST /:collection',
      'PUT /:collection/:id',
      'DELETE /:collection/:id'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 PILLAR JSON Server started successfully!');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`📁 Database file: ${DB_FILE}`);
  console.log(`⭐ Available endpoints:`);
  console.log(`   GET /                  - Server info and health check`);
  console.log(`   GET /collections       - List all collections`);
  console.log(`   GET /:collection       - Get all items in collection`);
  console.log(`   GET /:collection/:id   - Get single item by ID`);
  console.log(`   POST /:collection      - Create new item`);
  console.log(`   PUT /:collection/:id   - Update item by ID`);
  console.log(`   DELETE /:collection/:id - Delete item by ID`);
  console.log(`\n💡 Example: GET http://localhost:${PORT}/employees`);
  console.log('✅ Ready to handle requests!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down PILLAR JSON Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down PILLAR JSON Server...');
  process.exit(0);
}); 