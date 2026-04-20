const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      const filteredLines = lines.filter(line => !line.includes('eslint-disable-next-line'));
      if (lines.length !== filteredLines.length) {
        fs.writeFileSync(fullPath, filteredLines.join('\n'), 'utf8');
        console.log(`Cleaned: ${fullPath}`);
      }
    }
  }
}

processDir('src');
