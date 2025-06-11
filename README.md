# PILLAR JSON Server

A generic, file-backed JSON web server for the PILLAR relocation platform. This server provides a RESTful API interface for managing collections of data stored in a local JSON file.

## Features

- 🚀 **Generic REST API**: Automatically creates CRUD endpoints for any collection
- 📁 **File-based Storage**: Uses a local `db.json` file for data persistence
- 🔄 **Auto-ID Assignment**: Automatically assigns unique, incrementing IDs to new items
- 🌐 **CORS Support**: Enabled for frontend integration
- 📊 **Collection Management**: Create collections on-the-fly
- 🛡️ **Error Handling**: Comprehensive error responses with meaningful messages
- 📝 **Request Logging**: Logs all API requests with timestamps
- ⚡ **Lightweight**: Minimal dependencies, fast startup

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will start on `http://localhost:3000` and automatically create a `db.json` file if it doesn't exist.

### Sample Data

The server comes with sample data for a relocation platform including:
- **employees**: Employee records with relocation information
- **cases**: Relocation cases with status tracking
- **documents**: Document management for relocation processes
- **locations**: Location data with cost of living information

## API Endpoints

### Base URL: `http://localhost:3000`

### Collection Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Server health check and API documentation |
| `GET` | `/collections` | List all available collections with counts |

### CRUD Operations

For any collection (e.g., `employees`, `cases`, `documents`, `locations`):

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| `GET` | `/:collection` | Get all items in collection | `GET /employees` |
| `GET` | `/:collection/:id` | Get single item by ID | `GET /employees/1` |
| `POST` | `/:collection` | Create new item | `POST /employees` |
| `PUT` | `/:collection/:id` | Update item by ID | `PUT /employees/1` |
| `DELETE` | `/:collection/:id` | Delete item by ID | `DELETE /employees/1` |

## Usage Examples

### 1. Get All Collections

```bash
curl http://localhost:3000/collections
```

**Response:**
```json
{
  "collections": [
    {"name": "employees", "count": 2},
    {"name": "cases", "count": 2},
    {"name": "documents", "count": 2},
    {"name": "locations", "count": 2}
  ],
  "total": 4
}
```

### 2. Get All Employees

```bash
curl http://localhost:3000/employees
```

**Response:**
```json
{
  "collection": "employees",
  "data": [
    {
      "id": 1,
      "name": "John Smith",
      "email": "john.smith@company.com",
      "department": "Engineering",
      "relocationType": "domestic",
      "status": "active"
    }
  ],
  "count": 1
}
```

### 3. Get Single Employee

```bash
curl http://localhost:3000/employees/1
```

### 4. Create New Employee

```bash
curl -X POST http://localhost:3000/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice.johnson@company.com",
    "department": "Marketing",
    "relocationType": "international",
    "status": "pending"
  }'
```

**Response:**
```json
{
  "id": 3,
  "name": "Alice Johnson",
  "email": "alice.johnson@company.com",
  "department": "Marketing",
  "relocationType": "international",
  "status": "pending",
  "createdAt": "2024-01-22T10:30:00.000Z",
  "updatedAt": "2024-01-22T10:30:00.000Z"
}
```

### 5. Update Employee

```bash
curl -X PUT http://localhost:3000/employees/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### 6. Delete Employee

```bash
curl -X DELETE http://localhost:3000/employees/1
```

**Response:**
```json
{
  "message": "Item with id 1 deleted successfully from collection 'employees'",
  "deletedId": 1
}
```

## Dynamic Collections

The server automatically creates new collections when you make requests to them:

```bash
# This will create a new 'vendors' collection
curl -X POST http://localhost:3000/vendors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Moving Company ABC",
    "type": "moving",
    "rating": 4.5
  }'
```

## Data Persistence

- All data is stored in `db.json` in the project root
- Changes are automatically written to the file after each modification
- The file is created automatically if it doesn't exist
- Data persists between server restarts

## Error Handling

The server provides comprehensive error handling:

- **400 Bad Request**: Invalid JSON or request body
- **404 Not Found**: Collection or item doesn't exist
- **409 Conflict**: ID already exists when creating with specific ID
- **500 Internal Server Error**: Server-side errors

Example error response:
```json
{
  "error": "Item not found",
  "message": "Item with id 999 not found in collection 'employees'"
}
```

## Automatic Features

### ID Management
- New items automatically get unique, incrementing IDs
- IDs cannot be modified after creation
- IDs are preserved during updates

### Timestamps
- `createdAt`: Set when item is created
- `updatedAt`: Updated when item is modified
- Timestamps are in ISO 8601 format

### Logging
All requests are logged with timestamps:
```
[2024-01-22T10:30:00.000Z] GET /employees - 200
[2024-01-22T10:30:15.000Z] POST /employees - 201
```

## Development

### File Structure
```
JsonServer/
├── index.js          # Main server file
├── db.json          # Database file (auto-created)
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

### Available Scripts
- `npm start` - Start the server
- `npm run dev` - Start in development mode

### Customization
The server is highly customizable. You can modify:
- Port number (default: 3000)
- Database file location
- Logging format
- Error messages
- Add custom middleware

## CORS Support

CORS is enabled by default, allowing requests from any origin. This makes it easy to integrate with frontend applications during development.

## Production Considerations

For production use, consider:
- Adding authentication/authorization
- Rate limiting
- Input validation
- Database backup strategies
- Using a proper database instead of JSON file
- Configuring CORS for specific origins only

## License

ISC License - See package.json for details.

---

🚀 **Happy coding with PILLAR JSON Server!** 