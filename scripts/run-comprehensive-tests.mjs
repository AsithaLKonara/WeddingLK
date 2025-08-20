#!/usr/bin/env node

/**
 * Comprehensive Test Runner for WeddingLK
 * Orchestrates database seeding, API testing, and monitoring
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Test configuration
const TEST_CONFIG = {
  databaseSeeding: true,
  apiTesting: true,
  databaseMonitoring: true,
  browserTesting: true,
  generateReports: true
};

// Test results storage
const testResults = {
  startTime: new Date(),
  phases: [],
  summary: {
    totalPhases: 0,
    completedPhases: 0,
    failedPhases: 0,
    totalDuration: 0
  }
};

// Utility functions
const logPhase = (phase, status, details = '') => {
  const phaseResult = {
    timestamp: new Date(),
    phase,
    status,
    details,
    duration: 0
  };
  
  testResults.phases.push(phaseResult);
  
  if (status === 'STARTED') {
    console.log(`🚀 ${phase}: ${details}`);
  } else if (status === 'COMPLETED') {
    console.log(`✅ ${phase}: ${details}`);
    testResults.summary.completedPhases++;
  } else if (status === 'FAILED') {
    console.log(`❌ ${phase}: ${details}`);
    testResults.summary.failedPhases++;
  }
  
  testResults.summary.totalPhases++;
};

const runScript = (scriptPath, args = []) => {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath, ...args], {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
      process.stdout.write(data);
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
      process.stderr.write(data);
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject(new Error(`Script failed with code ${code}: ${stderr}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
};

const waitForService = async (url, maxAttempts = 30) => {
  const fetch = (await import('node-fetch')).default;
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Service not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return false;
};

const openBrowser = async (url) => {
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    const platform = process.platform;
    let command;
    
    if (platform === 'darwin') {
      command = `open "${url}"`;
    } else if (platform === 'win32') {
      command = `start "${url}"`;
    } else {
      command = `xdg-open "${url}"`;
    }
    
    await execAsync(command);
    return true;
  } catch (error) {
    console.log(`Could not open browser automatically. Please open: ${url}`);
    return false;
  }
};

const generateTestReport = () => {
  const endTime = new Date();
  const duration = endTime - testResults.startTime.getTime();
  
  const report = {
    ...testResults,
    endTime,
    duration,
    summary: {
      ...testResults.summary,
      totalDuration: duration,
      successRate: ((testResults.summary.completedPhases / testResults.summary.totalPhases) * 100).toFixed(1)
    }
  };
  
  // Save JSON report
  fs.writeFileSync('comprehensive-test-report.json', JSON.stringify(report, null, 2));
  
  // Generate HTML report
  const htmlReport = generateHTMLReport(report);
  fs.writeFileSync('comprehensive-test-report.html', htmlReport);
  
  console.log('\n📊 COMPREHENSIVE TEST REPORT GENERATED');
  console.log('========================================');
  console.log(`Total Phases: ${report.summary.totalPhases}`);
  console.log(`Completed: ${report.summary.completedPhases}`);
  console.log(`Failed: ${report.summary.failedPhases}`);
  console.log(`Success Rate: ${report.summary.successRate}%`);
  console.log(`Total Duration: ${(duration / 1000).toFixed(2)}s`);
  console.log('\n📁 Reports saved:');
  console.log('  - comprehensive-test-report.json');
  console.log('  - comprehensive-test-report.html');
};

const generateHTMLReport = (report) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>WeddingLK Comprehensive Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #dee2e6; }
        .metric h3 { margin: 0; color: #495057; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
        .metric .value { font-size: 2.5em; font-weight: bold; margin: 10px 0; }
        .pass { color: #28a745; }
        .fail { color: #dc3545; }
        .started { color: #17a2b8; }
        .phases { margin: 30px 0; }
        .phase { padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid; }
        .phase.completed { background: #d4edda; border-color: #28a745; }
        .phase.failed { background: #f8d7da; border-color: #dc3545; }
        .phase.started { background: #d1ecf1; border-color: #17a2b8; }
        .phase-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .phase-name { font-weight: bold; font-size: 1.1em; }
        .phase-status { padding: 5px 10px; border-radius: 15px; font-size: 0.8em; font-weight: bold; }
        .status-completed { background: #28a745; color: white; }
        .status-failed { background: #dc3545; color: white; }
        .status-started { background: #17a2b8; color: white; }
        .phase-details { color: #6c757d; font-size: 0.9em; }
        .phase-duration { color: #495057; font-size: 0.8em; margin-top: 5px; }
        .footer { text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid #dee2e6; color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 WeddingLK Comprehensive Test Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <p>Duration: ${(report.duration / 1000).toFixed(2)} seconds</p>
        </div>
        
        <div class="summary">
            <div class="metric">
                <h3>Total Phases</h3>
                <div class="value">${report.summary.totalPhases}</div>
            </div>
            <div class="metric">
                <h3>Completed</h3>
                <div class="value pass">${report.summary.completedPhases}</div>
            </div>
            <div class="metric">
                <h3>Failed</h3>
                <div class="value fail">${report.summary.failedPhases}</div>
            </div>
            <div class="metric">
                <h3>Success Rate</h3>
                <div class="value">${report.summary.successRate}%</div>
            </div>
        </div>
        
        <div class="phases">
            <h2>📋 Test Phases</h2>
            ${report.phases.map(phase => `
                <div class="phase ${phase.status.toLowerCase()}">
                    <div class="phase-header">
                        <div class="phase-name">${phase.phase}</div>
                        <div class="phase-status status-${phase.status.toLowerCase()}">${phase.status}</div>
                    </div>
                    <div class="phase-details">${phase.details}</div>
                    <div class="phase-duration">Duration: ${phase.duration}ms</div>
                </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <p>WeddingLK Testing Suite - Comprehensive Test Report</p>
            <p>Generated automatically by the testing framework</p>
        </div>
    </div>
</body>
</html>`;
};

// Main test phases
const runDatabaseSeeding = async () => {
  const startTime = Date.now();
  logPhase('Database Seeding', 'STARTED', 'Seeding all database tables with test data...');
  
  try {
    await runScript('./scripts/comprehensive-test-seed.mjs');
    
    const duration = Date.now() - startTime;
    const lastPhase = testResults.phases[testResults.phases.length - 1];
    lastPhase.duration = duration;
    lastPhase.status = 'COMPLETED';
    lastPhase.details = 'Database seeded successfully with comprehensive test data';
    
    logPhase('Database Seeding', 'COMPLETED', 'Database seeded successfully with comprehensive test data');
  } catch (error) {
    const duration = Date.now() - startTime;
    const lastPhase = testResults.phases[testResults.phases.length - 1];
    lastPhase.duration = duration;
    lastPhase.status = 'FAILED';
    lastPhase.details = `Failed to seed database: ${error.message}`;
    
    logPhase('Database Seeding', 'FAILED', `Failed to seed database: ${error.message}`);
    throw error;
  }
};

const runAPITesting = async () => {
  const startTime = Date.now();
  logPhase('API Testing', 'STARTED', 'Running comprehensive API tests...');
  
  try {
    // Wait for the application to be ready
    console.log('⏳ Waiting for application to be ready...');
    const isReady = await waitForService('http://localhost:3000/api/health');
    
    if (!isReady) {
      throw new Error('Application not ready after waiting');
    }
    
    console.log('✅ Application is ready, starting API tests...');
    await runScript('./scripts/api-test-suite.mjs');
    
    const duration = Date.now() - startTime;
    const lastPhase = testResults.phases[testResults.phases.length - 1];
    lastPhase.duration = duration;
    lastPhase.status = 'COMPLETED';
    lastPhase.details = 'API tests completed successfully';
    
    logPhase('API Testing', 'COMPLETED', 'API tests completed successfully');
  } catch (error) {
    const duration = Date.now() - startTime;
    const lastPhase = testResults.phases[testResults.phases.length - 1];
    lastPhase.duration = duration;
    lastPhase.status = 'FAILED';
    lastPhase.details = `Failed to run API tests: ${error.message}`;
    
    logPhase('API Testing', 'FAILED', `Failed to run API tests: ${error.message}`);
    throw error;
  }
};

const runDatabaseMonitoring = async () => {
  const startTime = Date.now();
  logPhase('Database Monitoring', 'STARTED', 'Starting database monitoring...');
  
  try {
    // Start monitoring in background
    const monitoringProcess = spawn('node', ['./scripts/database-monitor.mjs'], {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    // Let it run for a while to collect data
    await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
    
    // Stop monitoring
    monitoringProcess.kill('SIGINT');
    
    const duration = Date.now() - startTime;
    const lastPhase = testResults.phases[testResults.phases.length - 1];
    lastPhase.duration = duration;
    lastPhase.status = 'COMPLETED';
    lastPhase.details = 'Database monitoring completed';
    
    logPhase('Database Monitoring', 'COMPLETED', 'Database monitoring completed');
  } catch (error) {
    const duration = Date.now() - startTime;
    const lastPhase = testResults.phases[testResults.phases.length - 1];
    lastPhase.duration = duration;
    lastPhase.status = 'FAILED';
    lastPhase.details = `Failed to run database monitoring: ${error.message}`;
    
    logPhase('Database Monitoring', 'FAILED', `Failed to run database monitoring: ${error.message}`);
    throw error;
  }
};

const runBrowserTesting = async () => {
  const startTime = Date.now();
  logPhase('Browser Testing', 'STARTED', 'Opening application in browser for manual testing...');
  
  try {
    // Open main application
    await openBrowser('http://localhost:3000');
    
    // Open admin panel
    await openBrowser('http://localhost:3000/dashboard/admin');
    
    // Open MongoDB Express
    await openBrowser('http://localhost:8081');
    
    console.log('\n🌐 BROWSER TESTING INSTRUCTIONS:');
    console.log('==================================');
    console.log('1. Main App (http://localhost:3000):');
    console.log('   - Test user registration and login');
    console.log('   - Browse vendors and venues');
    console.log('   - Test search functionality');
    console.log('   - Test booking process');
    console.log('');
    console.log('2. Admin Panel (http://localhost:3000/dashboard/admin):');
    console.log('   - Test user management');
    console.log('   - Test vendor management');
    console.log('   - Test analytics dashboard');
    console.log('');
    console.log('3. Database (http://localhost:8081):');
    console.log('   - Username: admin, Password: admin123');
    console.log('   - Verify all collections have data');
    console.log('   - Test database queries');
    console.log('');
    console.log('Press Enter when you have completed manual testing...');
    
    // Wait for user input
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
    
    const duration = Date.now() - startTime;
    const lastPhase = testResults.phases[testResults.phases.length - 1];
    lastPhase.duration = duration;
    lastPhase.status = 'COMPLETED';
    lastPhase.details = 'Browser testing completed';
    
    logPhase('Browser Testing', 'COMPLETED', 'Browser testing completed');
  } catch (error) {
    const duration = Date.now() - startTime;
    const lastPhase = testResults.phases[testResults.phases.length - 1];
    lastPhase.duration = duration;
    lastPhase.status = 'FAILED';
    lastPhase.details = `Failed to run browser testing: ${error.message}`;
    
    logPhase('Browser Testing', 'FAILED', `Failed to run browser testing: ${error.message}`);
    throw error;
  }
};

// Main test runner
const runComprehensiveTests = async () => {
  console.log('🚀 WEDDINGLK COMPREHENSIVE TEST SUITE');
  console.log('======================================');
  console.log('This will run a complete testing cycle including:');
  console.log('1. Database seeding with comprehensive test data');
  console.log('2. API endpoint testing');
  console.log('3. Database monitoring and performance tracking');
  console.log('4. Browser-based manual testing');
  console.log('5. Comprehensive test reporting');
  console.log('');
  console.log('Make sure your Docker services are running:');
  console.log('  docker-compose up -d');
  console.log('');
  
  try {
    // Run all test phases
    if (TEST_CONFIG.databaseSeeding) {
      await runDatabaseSeeding();
    }
    
    if (TEST_CONFIG.apiTesting) {
      await runAPITesting();
    }
    
    if (TEST_CONFIG.databaseMonitoring) {
      await runDatabaseMonitoring();
    }
    
    if (TEST_CONFIG.browserTesting) {
      await runBrowserTesting();
    }
    
    // Generate reports
    if (TEST_CONFIG.generateReports) {
      generateTestReport();
    }
    
    console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    
  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error.message);
    console.log('\n📊 Partial results will be saved to reports.');
    
    if (TEST_CONFIG.generateReports) {
      generateTestReport();
    }
    
    process.exit(1);
  }
};

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runComprehensiveTests();
}

export default runComprehensiveTests; 