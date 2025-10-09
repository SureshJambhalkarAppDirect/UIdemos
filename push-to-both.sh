#!/bin/bash

# Script to push changes to both personal and work repositories
# Usage: ./push-to-both.sh [commit-message]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Pushing to both personal and work repositories...${NC}"

# Check if there are any changes to commit
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}📝 Found uncommitted changes. Committing them...${NC}"
    
    if [ -n "$1" ]; then
        git add .
        git commit -m "$1"
        echo -e "${GREEN}✅ Changes committed with message: $1${NC}"
    else
        echo -e "${RED}❌ Please provide a commit message: ./push-to-both.sh \"Your commit message\"${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ No uncommitted changes found.${NC}"
fi

# Push to work repository
echo -e "${YELLOW}🏢 Pushing to work repository...${NC}"
if git push work main; then
    echo -e "${GREEN}✅ Successfully pushed to work repository${NC}"
else
    echo -e "${RED}❌ Failed to push to work repository${NC}"
    exit 1
fi

# Push to personal repository
echo -e "${YELLOW}👤 Pushing to personal repository...${NC}"
if git push personal main; then
    echo -e "${GREEN}✅ Successfully pushed to personal repository${NC}"
else
    echo -e "${YELLOW}⚠️  Personal repository might not exist or have access issues${NC}"
    echo -e "${YELLOW}   You may need to create the repository at: https://github.com/sureshjambhalkar/appdirectUI${NC}"
fi

echo -e "${GREEN}🎉 Push process completed!${NC}"
