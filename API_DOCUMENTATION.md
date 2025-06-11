# PILLAR JSON Server API Documentation

## 🚀 Base URL
```
http://localhost:3000
```

## 📋 Available Collections

The PILLAR JSON Server provides REST API endpoints for the following collections:

### Core Platform
- `tenants` - Platform tenants/organizations
- `users` - System users (admins, agents, HR, employees)
- `invitations` - User invitation management
- `organizations` - Organization details
- `organization_members` - Organization membership

### Configuration & Setup
- `task_types` - Available task types
- `tasks` - Task management and workflows
- `service_categories` - Service categorization
- `services` - Available services
- `packages` - Service packages offered
- `payment_configurations` - Payment settings
- `file_storage_connectors` - File storage configuration

### Core Relocation
- `employees` - Relocating employees data
- `employers` - Client companies/employers
- `family_members` - Employee family members
- `vendors` - Service provider partners
- `cases` - Individual relocation cases
- `companies` - Client company management
- `documents` - Document tracking
- `notifications` - System notifications
- `accommodations` - Housing options
- `schools` - Educational institutions
- `appointments` - Meeting scheduling

### Financial & Reporting
- `invoices` - Billing and payments
- `expenses` - Expense tracking
- `compliance_reports` - Compliance reporting
- `customer_feedback` - Client feedback and ratings

---

## 🔗 Standard REST Endpoints

All collections follow the same REST pattern:

### GET Operations

#### Get All Items
```http
GET /{collection}
```
**Example**: `GET /employees`

**Response**:
```json
[
  {
    "id": 1,
    "firstName": "Priya",
    "lastName": "Sharma",
    "email": "priya.sharma@acme-corp.com",
    "nationality": "Indian",
    "workPermitStatus": "pending",
    // ... other properties
  }
]
```

#### Get Single Item
```http
GET /{collection}/{id}
```
**Example**: `GET /employees/1`

**Response**:
```json
{
  "id": 1,
  "firstName": "Priya",
  "lastName": "Sharma",
  "email": "priya.sharma@acme-corp.com",
  "nationality": "Indian",
  "workPermitStatus": "pending",
  // ... other properties
}
```

#### Get All Collections List
```http
GET /collections
```
**Response**:
```json
[
  "tenants",
  "users", 
  "employees",
  "cases",
  "companies",
  // ... all available collections
]
```

### POST Operations (Create)

#### Create New Item
```http
POST /{collection}
Content-Type: application/json
```

**Example**: `POST /employees`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "nationality": "American",
  "workPermitStatus": "pending",
  "jobTitle": "Software Engineer"
}
```

**Response**:
```json
{
  "id": 4,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "nationality": "American",
  "workPermitStatus": "pending", 
  "jobTitle": "Software Engineer",
  "createdAt": "2024-06-11T10:30:00Z",
  "updatedAt": "2024-06-11T10:30:00Z"
}
```

### PUT Operations (Update)

#### Update Item
```http
PUT /{collection}/{id}
Content-Type: application/json
```

**Example**: `PUT /employees/1`

**Request Body**:
```json
{
  "workPermitStatus": "approved",
  "startDate": "2024-08-01"
}
```

**Response**:
```json
{
  "id": 1,
  "firstName": "Priya",
  "lastName": "Sharma",
  "workPermitStatus": "approved",
  "startDate": "2024-08-01",
  "updatedAt": "2024-06-11T10:30:00Z"
  // ... other existing properties
}
```

### DELETE Operations

#### Delete Item
```http
DELETE /{collection}/{id}
```

**Example**: `DELETE /employees/1`

**Response**: `200 OK` (empty body)

---

## 📊 Collection Schemas

### Employees
```json
{
  "id": "number",
  "tenantId": "number",
  "userId": "number",
  "employeeNumber": "string",
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "phone": "string",
  "nationality": "string",
  "dateOfBirth": "string",
  "passportNumber": "string",
  "passportExpiryDate": "string",
  "workPermitStatus": "string", 
  "visaType": "string",
  "maritalStatus": "string",
  "spouseFirstName": "string",
  "spouseLastName": "string",
  "numberOfChildren": "string",
  "emergencyContactName": "string",
  "emergencyContactPhone": "string",
  "emergencyContactEmail": "string",
  "currentAddress": "string",
  "destinationCountry": "string",
  "jobTitle": "string",
  "startDate": "string",
  "salaryRange": "string",
  "languageSkills": "string",
  "dietaryRestrictions": "string",
  "medicalConditions": "string",
  "petOwnership": "string"
}
```

### Cases
```json
{
  "id": "number",
  "tenantId": "number", 
  "caseNumber": "string",
  "employeeId": "number",
  "packageId": "number",
  "assignedAgentId": "number",
  "status": "string",
  "priority": "string",
  "startDate": "string",
  "expectedEndDate": "string",
  "actualEndDate": "string",
  "budget": "number",
  "actualCost": "number",
  "currency": "string",
  "currentStep": "string",
  "completionPercentage": "number"
}
```

### Family Members
```json
{
  "id": "number",
  "tenantId": "number",
  "employeeId": "number",
  "firstName": "string",
  "lastName": "string",
  "relationshipToEmployee": "string",
  "dateOfBirth": "string",
  "nationality": "string",
  "passportNumber": "string",
  "passportExpiryDate": "string",
  "visaRequired": "boolean",
  "visaStatus": "string",
  "schoolAge": "boolean",
  "educationLevel": "string",
  "specialNeeds": "string",
  "medicalConditions": "string",
  "languageSkills": "string",
  "dietaryRestrictions": "string"
}
```

### Employers
```json
{
  "id": "number",
  "tenantId": "number",
  "companyName": "string",
  "industry": "string",
  "contactPersonFirstName": "string",
  "contactPersonLastName": "string",
  "contactPersonEmail": "string",
  "contactPersonPhone": "string",
  "companyAddress": "string",
  "country": "string",
  "employeeCount": "number",
  "contractType": "string",
  "paymentTerms": "string",
  "preferredServices": "array",
  "budget": "number",
  "hrContactInfo": "string",
  "companyPolicy": "string",
  "relocationType": "string"
}
```

### Vendors
```json
{
  "id": "number",
  "tenantId": "number",
  "companyName": "string",
  "serviceType": "string",
  "contactPersonFirstName": "string",
  "contactPersonLastName": "string",
  "contactPersonEmail": "string",
  "phoneNumber": "string",
  "address": "string",
  "servingCountries": "array",
  "serviceCategories": "array",
  "rating": "number",
  "contractTerms": "string",
  "paymentTerms": "string",
  "availabilityHours": "string",
  "languages": "array",
  "certifications": "array",
  "insuranceInfo": "string",
  "pricingStructure": "string"
}
```

---

## 🔍 Query Parameters

### Filtering
```http
GET /employees?nationality=Indian
GET /cases?status=in_progress
GET /vendors?serviceType=accommodation
```

### Sorting
```http
GET /employees?_sort=lastName&_order=asc
GET /cases?_sort=startDate&_order=desc
```

### Pagination
```http
GET /employees?_page=1&_limit=10
```

### Search
```http
GET /employees?q=Priya
GET /companies?q=ACME
```

---

## 🚨 Error Responses

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 💻 Usage Examples

### JavaScript/Fetch
```javascript
// Get all employees
const employees = await fetch('http://localhost:3000/employees')
  .then(res => res.json());

// Create new employee
const newEmployee = await fetch('http://localhost:3000/employees', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    nationality: 'American'
  })
}).then(res => res.json());

// Update employee
const updatedEmployee = await fetch('http://localhost:3000/employees/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    workPermitStatus: 'approved'
  })
}).then(res => res.json());

// Delete employee
await fetch('http://localhost:3000/employees/1', {
  method: 'DELETE'
});
```

### React Example
```jsx
import { useState, useEffect } from 'react';

function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/employees')
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      });
  }, []);

  const createEmployee = async (employeeData) => {
    const response = await fetch('http://localhost:3000/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    });
    const newEmployee = await response.json();
    setEmployees([...employees, newEmployee]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {employees.map(employee => (
        <div key={employee.id}>
          {employee.firstName} {employee.lastName} - {employee.workPermitStatus}
        </div>
      ))}
    </div>
  );
}
```

### cURL Examples
```bash
# Get all employees
curl http://localhost:3000/employees

# Get specific employee
curl http://localhost:3000/employees/1

# Create new employee
curl -X POST http://localhost:3000/employees \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john.doe@company.com"}'

# Update employee
curl -X PUT http://localhost:3000/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"workPermitStatus":"approved"}'

# Delete employee
curl -X DELETE http://localhost:3000/employees/1
```

---

## 🛠️ Development Server

### Start Server
```bash
npm start
# or
node index.js
```

### Server Info
- **Port**: 3000
- **Database**: db.json
- **CORS**: Enabled for all origins
- **Auto-reload**: File changes auto-reload server

---

## 📝 Notes

1. **Auto-Collection Creation**: POSTing to non-existent collections creates them automatically
2. **ID Generation**: IDs are auto-generated as incrementing numbers
3. **Timestamps**: `createdAt` and `updatedAt` are automatically managed
4. **CORS**: All origins allowed for development
5. **File Persistence**: All changes persist to `db.json`
6. **Case Sensitive**: Collection names are case-sensitive

---

## 🎯 Integration Tips for Lovable

1. **Base URL Configuration**: Set up environment variable for API base URL
2. **Error Handling**: Implement proper error handling for all API calls
3. **Loading States**: Show loading indicators during API calls
4. **Optimistic Updates**: Update UI immediately, rollback on error
5. **Data Validation**: Validate data before sending to API
6. **Authentication**: Consider adding authentication layer for production

---

*For more information or issues, check the server logs or contact the development team.* 