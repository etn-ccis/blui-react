#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
GRAY='\033[1;30m'
NC='\033[0m' # No Color

echo "Building components..."
rm -rf ./dist
tsc --p ./tsconfig.lib.json

echo -e "${BLUE}Copying Package Resources${NC}"
cp -r package.json ./dist/package.json
cp -r README.md ./dist/README.md
cp -r LICENSE ./dist/LICENSE
cp -r LICENSES.json ./dist/LICENSES.json
cp -r CHANGELOG.md ./dist/CHANGELOG.md

echo -e "\r\n${GREEN}-----------------------------------"
echo -e "React Components package successfully created"
echo -e "-----------------------------------${NC}\r\n\r\n"

exit 0
