#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
GRAY='\033[1;30m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "Building workflow..."
rm -rf ./dist
tsc --p ./tsconfig.lib.json

echo -e "${BLUE}Copying Package Resources${NC}"
cp -r package.json ./dist/package.json
cp -r README.md ./dist/README.md
cp -r LICENSES.json ./dist/LICENSES.json
cp -r CHANGELOG.md ./dist/CHANGELOG.md
cp -r src/assets/. dist/assets

echo -e "${BLUE}Updating the package to ESM format${NC}"

tsc-esm-fix dist
node ./scripts/fix-import.js

echo -e "\r\n${GREEN}-----------------------------------"
echo -e "React workflow package successfully created"
echo -e "-----------------------------------${NC}\r\n\r\n"

exit 0

 