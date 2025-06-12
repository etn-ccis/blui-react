import fs from 'fs';
import path from 'path';

const directory = path.resolve(new URL('.', import.meta.url).pathname, '../dist');
const muiIconsPattern = /^@mui\/icons-material/;

function fixImports(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixImports(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.d.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/import (.*?) from ['"](.*?)['"]/g, (match, imports, modulePath) => {
                if (muiIconsPattern.test(modulePath)) {
                    // Remove .js extension for @mui/icons-material imports
                    return match.replace('.js', '');
                }
                return match; // Leave other imports untouched
            });
            fs.writeFileSync(fullPath, content, 'utf8');
        }
    });
}

fixImports(directory);
