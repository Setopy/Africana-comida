#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('=== Netlify Functions Deploy Debug ===');
console.log('Current working directory:', process.cwd());
console.log('Functions directory exists:', fs.existsSync('./netlify/functions'));
console.log('Functions directory contents:');

if (fs.existsSync('./netlify/functions')) {
  const files = fs.readdirSync('./netlify/functions');
  files.forEach(file => {
    const filePath = path.join('./netlify/functions', file);
    const stats = fs.statSync(filePath);
    console.log(`  ${file} ${stats.isDirectory() ? '(directory)' : '(file)'}`);
  });
}

console.log('Environment variables:');
console.log('  NODE_VERSION:', process.env.NODE_VERSION);
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  MONGODB_URI exists:', !!process.env.MONGODB_URI);

console.log('=== End Debug ===');