#!/bin/bash

BASE_URL="http://localhost:3000"
API_KEY="SECRET_API_KEY"

echo "=== Testing Product API ==="

# 1. Test root endpoint
echo -n "Root endpoint: "
curl -s "$BASE_URL"

# 2. Test product creation
echo -e "\n\nCreating product:"
curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"name":"Test Product","price":19.99,"category":"test"}' | jq

# 3. Test listing products
echo -e "\nAll products:"
curl -s "$BASE_URL/api/products" | jq '.data[0]'

# 4. Test search
echo -e "\nSearch results:"
curl -s "$BASE_URL/api/products/search?q=test" | jq

# 5. Test statistics
echo -e "\nProduct statistics:"
curl -s "$BASE_URL/api/products/stats" | jq

# 6. Test authentication failure
echo -e "\nAuthentication test (should fail):"
curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: invalid-key" \
  -d '{"name":"Should Fail"}' | jq

# 7. Test validation failure
echo -e "\nValidation test (should fail):"
curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"price": -10}' | jq

echo "=== Tests completed ==="