# Express.js Products API - Week 2 Assignment

## Overview
A RESTful API for managing products built with Express.js that implements:
- Full CRUD operations for products
- API key authentication
- Request logging middleware
- Comprehensive error handling
- Advanced features like filtering, pagination, search, and statistics

## Installation
```bash
git clone https://github.com/PLP-MERN-Stack-Development/week-2-express-js-assignment-OneWilly
cd week-2-express-js-assignment-OneWilly
npm install
```

## Running the Server
```bash
node server.js
```

The server will start on port 3000 (http://localhost:3000)

## API Endpoints

### Authentication
All write operations (POST, PUT, DELETE) require authentication. Include the following header:
```
X-API-Key: SECRET_API_KEY
```

### Products Collection
| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/products` | GET | List all products | No |
| `/api/products` | POST | Create new product | Yes |
| `/api/products/:id` | GET | Get single product | No |
| `/api/products/:id` | PUT | Update product | Yes |
| `/api/products/:id` | DELETE | Delete product | Yes |
| `/api/products/search` | GET | Search products | No |
| `/api/products/stats` | GET | Get product statistics | No |

## Detailed Endpoint Documentation

### 1. List Products (GET /api/products)
**Query Parameters:**
- `category`: Filter by category (e.g., `electronics`)
- `page`: Page number for pagination (default: 1)
- `limit`: Items per page (default: 10)

**Example Request:**
```bash
curl "http://localhost:3000/api/products?category=electronics&page=2&limit=3"
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "4",
      "name": "Tablet",
      "description": "10-inch display tablet",
      "price": 299.99,
      "category": "electronics",
      "inStock": true
    }
  ],
  "pagination": {
    "currentPage": 2,
    "itemsPerPage": 3,
    "totalItems": 7,
    "totalPages": 3
  }
}
```

### 2. Create Product (POST /api/products)
**Request Body:**
```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse",
  "price": 29.99,
  "category": "electronics",
  "inStock": true
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: SECRET_API_KEY" \
  -d '{
    "name": "Wireless Mouse",
    "price": 29.99,
    "category": "electronics"
  }'
```

**Example Response (201 Created):**
```json
{
  "id": "a1b2c3d4",
  "name": "Wireless Mouse",
  "description": "",
  "price": 29.99,
  "category": "electronics",
  "inStock": true
}
```

### 3. Get Single Product (GET /api/products/:id)
**Example Request:**
```bash
curl http://localhost:3000/api/products/1
```

**Example Response:**
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

### 4. Update Product (PUT /api/products/:id)
**Request Body:**
```json
{
  "price": 1299.99,
  "description": "Updated description"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: SECRET_API_KEY" \
  -d '{"price": 1299.99}'
```

**Example Response:**
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1299.99,
  "category": "electronics",
  "inStock": true
}
```

### 5. Delete Product (DELETE /api/products/:id)
**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/products/3 \
  -H "X-API-Key: SECRET_API_KEY"
```

**Response:**  
204 No Content

### 6. Search Products (GET /api/products/search)
**Query Parameters:**
- `q`: Search term (required)

**Example Request:**
```bash
curl "http://localhost:3000/api/products/search?q=laptop"
```

**Example Response:**
```json
[
  {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  }
]
```

### 7. Product Statistics (GET /api/products/stats)
**Example Request:**
```bash
curl http://localhost:3000/api/products/stats
```

**Example Response:**
```json
{
  "totalProducts": 12,
  "inStockCount": 9,
  "outOfStockCount": 3,
  "categories": {
    "electronics": 7,
    "kitchen": 3,
    "office": 2
  },
  "averagePrice": 189.99
}
```

## Error Handling
The API returns structured error responses with appropriate HTTP status codes:

### Error Response Format
```json
{
  "error": "ErrorType",
  "message": "Human-readable error message",
  "details": ["Additional error details"] // Optional
}
```

### Common Error Statuses
| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | ValidationError | Invalid request data |
| 401 | AuthenticationError | Missing or invalid API key |
| 404 | NotFoundError | Resource not found |
| 500 | InternalServerError | Server-side error |

**Example Validation Error:**
```json
{
  "error": "Validation failed",
  "details": [
    "Invalid or missing name",
    "Invalid price (must be positive number)"
  ]
}
```

**Example Authentication Error:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid API key"
}
```

## Testing the API
You can test the API using:
1. Postman
2. Insomnia
3. curl commands

### Example Test Script
```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
API_KEY="SECRET_API_KEY"

# Create a new product
curl -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"name":"Bluetooth Speaker","price":89.99,"category":"electronics"}'

# Get all electronics products
curl "$BASE_URL/api/products?category=electronics"

# Search for products
curl "$BASE_URL/api/products/search?q=speaker"

# Get statistics
curl "$BASE_URL/api/products/stats"
```

## Environment Configuration
Create a `.env` file with the following content:
```env
PORT=3000
```
Use `.env.example` as a template.

## Dependencies
- express: Web framework
- body-parser: Middleware for parsing request bodies
- uuid: Generate unique IDs

## License
This project is licensed under the MIT License.