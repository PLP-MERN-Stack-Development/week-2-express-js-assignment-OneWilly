/**
 * server.js - Express.js API for managing products
 * 
 * This file contains the main server setup, routes, and middleware.
 * Designed for beginners to understand Express.js fundamentals.
 */

// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');          // Express web framework
const bodyParser = require('body-parser');   // Middleware to parse request bodies
const { v4: uuidv4 } = require('uuid');      // Generate unique IDs
const { 
  NotFoundError, 
  ValidationError, 
  UnauthorizedError 
} = require('./errors');  // Custom error classes

// Create Express application
const app = express();

// Set server port (from .env or default to 3000)
const PORT = process.env.PORT || 3000;

// ==================================================================
// MIDDLEWARE SETUP (Process requests before they reach routes)
// ==================================================================

// Parse JSON request bodies (makes req.body available)
app.use(bodyParser.json());

// Custom request logger - shows all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass control to next middleware
});

// ==================================================================
// CUSTOM MIDDLEWARE FUNCTIONS
// ==================================================================

/**
 * Authentication Middleware
 * Checks for valid API key in request headers
 */
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // Compare with key from environment variables
  if (apiKey && apiKey === process.env.API_KEY) { 
    next(); // Valid key, proceed
  } else {
    // Invalid key, pass error to error handler
    next(new UnauthorizedError('Invalid API key'));
  }
};

/**
 * Product Validation Middleware
 * Checks if product data is valid before creating/updating
 */
const validateProduct = (req, res, next) => {
  const product = req.body;
  const errors = [];
  
  // Validate name: must exist and be string
  if (!product.name || typeof product.name !== 'string') 
    errors.push('Name is required and must be text');
  
  // Validate price: must be positive number
  if (typeof product.price !== 'number' || product.price <= 0) 
    errors.push('Price must be a positive number');
  
  // Validate category: must exist and be string
  if (!product.category || typeof product.category !== 'string') 
    errors.push('Category is required and must be text');
  
  // If errors found, return validation error
  if (errors.length > 0) {
    return next(new ValidationError('Product validation failed', errors));
  }
  
  // No errors, proceed to route handler
  next();
};

// ==================================================================
// IN-MEMORY DATABASE (For demonstration purposes)
// ==================================================================
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// ==================================================================
// API ROUTES
// ==================================================================

// Root endpoint - Basic information
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Products API!',
    endpoints: {
      products: '/api/products',
      search: '/api/products/search?q=term',
      stats: '/api/products/stats'
    }
  });
});

/**
 * GET /api/products - List all products
 * Supports filtering by category and pagination
 */
app.get('/api/products', (req, res) => {
  // Create a copy of products array
  let result = [...products];
  
  // FILTERING: If category query parameter exists
  if (req.query.category) {
    result = result.filter(p => 
      p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  // PAGINATION: Get page and limit from query string
  const page = parseInt(req.query.page) || 1;    // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default 10 items/page
  
  // Calculate start/end indexes for pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  // Slice array for current page
  const paginated = result.slice(startIndex, endIndex);
  
  // Return products with pagination info
  res.json({
    data: paginated,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / limit)
    }
  });
});

/**
 * GET /api/products/:id - Get single product by ID
 */
app.get('/api/products/:id', (req, res, next) => {
  // Find product with matching ID
  const product = products.find(p => p.id === req.params.id);
  
  // If not found, return 404 error
  if (!product) {
    return next(new NotFoundError(`Product with ID ${req.params.id} not found`));
  }
  
  // Return found product
  res.json(product);
});

/**
 * POST /api/products - Create new product
 * Requires authentication and valid product data
 */
app.post('/api/products', authenticate, validateProduct, (req, res) => {
  // Create new product object with unique ID
  const newProduct = {
    id: uuidv4(), // Generate unique ID
    ...req.body,  // Copy all properties from request body
    
    // Set default inStock value if not provided
    inStock: req.body.inStock !== undefined ? req.body.inStock : true
  };
  
  // Add to products array
  products.push(newProduct);
  
  // Return 201 Created status with new product
  res.status(201).json(newProduct);
});

/**
 * PUT /api/products/:id - Update existing product
 * Requires authentication and valid product data
 */
app.put('/api/products/:id', authenticate, validateProduct, (req, res, next) => {
  // Find product index in array
  const index = products.findIndex(p => p.id === req.params.id);
  
  // Return 404 if not found
  if (index === -1) {
    return next(new NotFoundError(`Product with ID ${req.params.id} not found`));
  }
  
  // Create updated product (preserve ID)
  const updatedProduct = { 
    ...products[index],  // Existing properties
    ...req.body,        // New properties
    id: req.params.id   // Ensure ID doesn't change
  };
  
  // Update in array
  products[index] = updatedProduct;
  
  // Return updated product
  res.json(updatedProduct);
});

/**
 * DELETE /api/products/:id - Delete product
 * Requires authentication
 */
app.delete('/api/products/:id', authenticate, (req, res, next) => {
  // Store initial array length
  const initialLength = products.length;
  
  // Filter out product with matching ID
  products = products.filter(p => p.id !== req.params.id);
  
  // If no item was removed, return 404
  if (products.length === initialLength) {
    return next(new NotFoundError(`Product with ID ${req.params.id} not found`));
  }
  
  // Return 204 No Content status
  res.status(204).end();
});

/**
 * GET /api/products/search - Search products by name or description
 */
app.get('/api/products/search', (req, res, next) => {
  const term = req.query.q; // Get search term from query string
  
  // Validate search term exists
  if (!term) {
    return next(new ValidationError('Search term is required', ['q parameter is missing']));
  }
  
  // Convert to lowercase for case-insensitive search
  const searchTerm = term.toLowerCase();
  
  // Filter products where name or description contains term
  const results = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm) || 
    (p.description && p.description.toLowerCase().includes(searchTerm))
  );
  
  // Return matching products
  res.json(results);
});

/**
 * GET /api/products/stats - Get product statistics
 */
app.get('/api/products/stats', (req, res) => {
  // Initialize stats object
  const stats = {
    totalProducts: products.length,
    inStockCount: products.filter(p => p.inStock).length,
    outOfStockCount: products.filter(p => !p.inStock).length,
    categories: {},
    averagePrice: 0
  };
  
  // Calculate products per category
  products.forEach(p => {
    stats.categories[p.category] = (stats.categories[p.category] || 0) + 1;
  });
  
  // Calculate average price if products exist
  if (products.length > 0) {
    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    stats.averagePrice = parseFloat((totalPrice / products.length).toFixed(2));
  }
  
  // Return statistics
  res.json(stats);
});

// ==================================================================
// ERROR HANDLING MIDDLEWARE (Always comes after routes)
// ==================================================================

// Handle 404 Not Found for all unhandled routes
app.use((req, res, next) => {
  next(new NotFoundError(`Endpoint ${req.method} ${req.originalUrl} not found`));
});

// Global error handler
app.use((err, req, res, next) => {
  // Log server errors (500 status codes) to console
  if (!err.status || err.status >= 500) {
    console.error(`[ERROR] ${err.stack}`);
  }

  // Determine HTTP status code
  const status = err.status || 500;
  
  // Build error response
  const response = {
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred'
  };

  // Add validation details if available
  if (err.details) {
    response.details = err.details;
  }

  // Include stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Send error response
  res.status(status).json(response);
});

// ==================================================================
// START SERVER
// ==================================================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔐 API Key: ${process.env.API_KEY ? 'Set' : 'Not set (see .env)'}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\nAvailable endpoints:');
  console.log('  GET  /api/products           - List products');
  console.log('  POST /api/products           - Create product (requires auth)');
  console.log('  GET  /api/products/:id       - Get product details');
  console.log('  PUT  /api/products/:id       - Update product (requires auth)');
  console.log('  DELETE /api/products/:id     - Delete product (requires auth)');
  console.log('  GET  /api/products/search    - Search products');
  console.log('  GET  /api/products/stats     - Get statistics');
});