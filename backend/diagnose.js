// RENDER DEPLOYMENT DIAGNOSIS SCRIPT
// Run this to identify why the main server fails silently

console.log('🔍 RENDER DEPLOYMENT DIAGNOSIS STARTED');
console.log('='.repeat(50));

// 1. Environment Check
console.log('1️⃣ ENVIRONMENT VARIABLES:');
const requiredVars = ['NODE_ENV', 'PORT', 'MONGODB_URI', 'JWT_SECRET'];
requiredVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`   ${varName}: ${value ? '✅ SET' : '❌ MISSING'}`);
  if (value) {
    console.log(`     - Length: ${value.length}`);
    console.log(`     - Type: ${typeof value}`);
  }
});

// 2. Node.js Version
console.log('\n2️⃣ NODE.JS VERSION:');
console.log(`   Version: ${process.version}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   Architecture: ${process.arch}`);

// 3. Dependencies Check
console.log('\n3️⃣ CRITICAL DEPENDENCIES:');
const criticalDeps = ['express', 'mongoose', 'winston', 'dotenv'];
criticalDeps.forEach(dep => {
  try {
    const pkg = require(dep);
    console.log(`   ${dep}: ✅ AVAILABLE`);
  } catch (error) {
    console.log(`   ${dep}: ❌ FAILED - ${error.message}`);
  }
});

// 4. File System Check
console.log('\n4️⃣ FILE SYSTEM:');
const fs = require('fs');
const path = require('path');

const criticalFiles = [
  './src/config/config.js',
  './src/utils/logger.js',
  './src/routes/menuRoutes.js',
  './src/middleware/cache.js'
];

criticalFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      console.log(`   ${file}: ✅ EXISTS`);
    } else {
      console.log(`   ${file}: ❌ MISSING`);
    }
  } catch (error) {
    console.log(`   ${file}: ❌ ERROR - ${error.message}`);
  }
});

// 5. Config Loading Test
console.log('\n5️⃣ CONFIG LOADING TEST:');
try {
  // Test dotenv loading
  require('dotenv').config();
  console.log('   dotenv: ✅ LOADED');
  
  // Test config loading
  const config = require('./src/config/config');
  console.log('   config.js: ✅ LOADED');
  console.log(`   - NODE_ENV: ${config.NODE_ENV}`);
  console.log(`   - PORT: ${config.PORT}`);
  console.log(`   - MONGODB_URI present: ${!!config.MONGODB_URI}`);
  
} catch (error) {
  console.log(`   config loading: ❌ FAILED - ${error.message}`);
  console.log(`   Stack: ${error.stack}`);
}

// 6. Logger Test
console.log('\n6️⃣ LOGGER TEST:');
try {
  const { logger } = require('./src/utils/logger');
  logger.info('Test log message');
  console.log('   logger: ✅ WORKING');
} catch (error) {
  console.log(`   logger: ❌ FAILED - ${error.message}`);
}

// 7. Memory and Process Info
console.log('\n7️⃣ PROCESS INFO:');
console.log(`   PID: ${process.pid}`);
console.log(`   Uptime: ${process.uptime()}s`);
console.log(`   Memory:`, JSON.stringify(process.memoryUsage(), null, 4));

// 8. Network Test
console.log('\n8️⃣ NETWORK TEST:');
const express = require('express');
const app = express();
const testPort = process.env.PORT || 5000;

app.get('/test', (req, res) => {
  res.json({ status: 'test-ok', timestamp: new Date().toISOString() });
});

const testServer = app.listen(testPort, '0.0.0.0', () => {
  console.log(`   Express server: ✅ STARTED on 0.0.0.0:${testPort}`);
  
  // Close test server after 2 seconds
  setTimeout(() => {
    testServer.close(() => {
      console.log('   Express server: ✅ CLOSED successfully');
      
      // Final verdict
      console.log('\n' + '='.repeat(50));
      console.log('🎯 DIAGNOSIS COMPLETE');
      console.log('');
      console.log('If you see this message, basic Node.js functionality works.');
      console.log('Check the ❌ FAILED items above for the root cause.');
      console.log('');
      console.log('💡 RECOMMENDATIONS:');
      console.log('- If config loading failed: Missing environment variables');
      console.log('- If logger failed: Winston/file system issues');
      console.log('- If dependencies failed: Installation problems');
      console.log('- If files missing: Build/deployment issues');
    });
  }, 2000);
});

testServer.on('error', (error) => {
  console.log(`   Express server: ❌ FAILED - ${error.message}`);
});