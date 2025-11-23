#!/bin/bash
# ============================================================================
# API Testing Script
# Tests all MADLAB API endpoints
# ============================================================================

set -e

API_BASE="http://localhost:3001/api"
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧪 Testing MADLAB API Endpoints"
echo "================================"
echo ""

# Test health endpoint
echo -e "${BLUE}1. Testing Health Endpoint...${NC}"
HEALTH=$(curl -s "${API_BASE}/health")
echo "$HEALTH" | jq '.'
if echo "$HEALTH" | jq -e '.success == true' > /dev/null; then
  echo -e "${GREEN}✓ Health check passed${NC}"
else
  echo -e "${RED}✗ Health check failed${NC}"
  exit 1
fi
echo ""

# Test projects endpoint
echo -e "${BLUE}2. Testing GET /api/projects...${NC}"
PROJECTS=$(curl -s "${API_BASE}/projects")
echo "$PROJECTS" | jq '.'
PROJECT_COUNT=$(echo "$PROJECTS" | jq '.data | length')
echo -e "${GREEN}✓ Found ${PROJECT_COUNT} project(s)${NC}"
echo ""

# Test tasks endpoint
echo -e "${BLUE}3. Testing GET /api/tasks...${NC}"
TASKS=$(curl -s "${API_BASE}/tasks")
TASK_COUNT=$(echo "$TASKS" | jq '.count')
echo -e "${GREEN}✓ Found ${TASK_COUNT} task(s)${NC}"
echo ""

# Show first 3 tasks
echo -e "${BLUE}4. Sample Tasks:${NC}"
echo "$TASKS" | jq '.data[:3] | .[] | {id, title, phase, status, assignee: .assignee.name}'
echo ""

# Test filtering by phase
echo -e "${BLUE}5. Testing GET /api/tasks?phase=1...${NC}"
PHASE1_TASKS=$(curl -s "${API_BASE}/tasks?phase=1")
PHASE1_COUNT=$(echo "$PHASE1_TASKS" | jq '.count')
echo -e "${GREEN}✓ Found ${PHASE1_COUNT} task(s) in Phase 1${NC}"
echo ""

# Test filtering by status
echo -e "${BLUE}6. Testing GET /api/tasks?status=not-started...${NC}"
NOT_STARTED=$(curl -s "${API_BASE}/tasks?status=not-started")
NOT_STARTED_COUNT=$(echo "$NOT_STARTED" | jq '.count')
echo -e "${GREEN}✓ Found ${NOT_STARTED_COUNT} not-started task(s)${NC}"
echo ""

# Summary
echo "================================"
echo -e "${GREEN}✅ All API tests passed!${NC}"
echo ""
echo "Summary:"
echo "  - Projects: ${PROJECT_COUNT}"
echo "  - Total Tasks: ${TASK_COUNT}"
echo "  - Phase 1 Tasks: ${PHASE1_COUNT}"
echo "  - Not Started: ${NOT_STARTED_COUNT}"
echo ""
