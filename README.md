# Express Products API

A beginner-friendly Express.js API for managing products. Implements CRUD operations, authentication, and advanced features like search and statistics.

## Features
- ✅ Create, read, update, delete products
- 🔑 API key authentication
- 🔍 Search products by name/description
- 📊 Product statistics
- 📄 Pagination and filtering
- 🛡️ Input validation
- 💬 Detailed error messages

## Setup Guide

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

### 3. Start the server
```bash
npm start
```

## API Reference

### Base URL
`http://localhost:3000`

### Authentication
Include in headers:
```http
X-API-Key: your_api_key_from_env
```

### Endpoints

| Method | Endpoint                | Description                     | Auth Required |
|--------|-------------------------|---------------------------------|--------------|
| GET    | `/`                     | API information                 | No           |
| GET    | `/api/products`         | List products (filterable)      | No           |
| POST   | `/api/products`         | Create new product              | Yes          |
| GET    | `/api/products/:id`     | Get product by ID               | No           |
| PUT    | `/api/products/:id`     | Update product                  | Yes          |
| DELETE | `/api/products/:id`     | Delete product                  | Yes          |
| GET    | `/api/products/search`  | Search products                 | No           |
| GET    | `/api/products/stats`   | Get product statistics          | No           |

## Example Usage

### Create product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_key" \
  -d '{
    "name": "Wireless Mouse",
    "price": 29.99,
    "category": "electronics"
  }'
```

### Search products
```bash
curl "http://localhost:3000/api/products/search?q=wireless"
```

### Get statistics
```bash
curl http://localhost:3000/api/products/stats
```

## Error Handling
The API returns JSON errors with:
- `error`: Error type
- `message`: Human-readable message
- `details`: Additional info (if available)

Example:
```json
{
  "error": "ValidationError",
  "message": "Product validation failed",
  "details": ["Price must be a positive number"]
}
```

## Learning Resources
- [Express.js Fundamentals](https://expressjs.com/en/starter/installing.html)
- [HTTP Status Codes](https://httpstatuses.com/)
- [REST API Best Practices](https://restfulapi.net/)
