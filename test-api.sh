#!/bin/bash

BASE_URL="http://localhost:3000"
API_KEY="SECRET_API_KEY"

echo "=== Testing Product API ==="

# Test root endpoint
curl -s "$BASE_URL"

# Test get all products
curl -s "$BASE_URL/api/products"

# Test get single product
curl -s "$BASE_URL/api/products/1"

# Test create product (authenticated)
curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"name":"Test Product","price":19.99,"category":"test"}'

# Test search
curl -s "$BASE_URL/api/products/search?q=coffee"

# Test statistics
curl -s "$BASE_URL/api/products/stats"

# Test invalid request
curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: invalid-key" \
  -d '{}'

echo "=== Tests completed ==="
