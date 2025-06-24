import fs from 'fs';
import path from 'path';

const directory = path.resolve(new URL('.', import.meta.url).pathname, '../dist');

function fixImports(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixImports(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.d.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Remove .js or /index.js extension from any @mui/material/* package import
            content = content.replace(
                /import (.*?) from ['"](@mui\/material\/[^'"]+?)(\/index)?\.js['"]/g,
                (match, imports, modulePath, indexPart) => {
                    // Remove /index.js or .js from the import path
                    let fixedPath = modulePath.replace(/\/index$/, '');
                    return `import ${imports} from '${fixedPath}'`;
                }
            );
            fs.writeFileSync(fullPath, content, 'utf8');
        }
    });
}

fixImports(directory);