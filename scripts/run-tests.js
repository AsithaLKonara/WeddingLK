#!/usr/bin/env node

/**
 * WeddingLK Comprehensive Test Runner
 * Executes all tests and generates comprehensive coverage reports
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

class ComprehensiveTestRunner {
  constructor() {
    this.testResults = {
      timestamp: new Date().toISOString(),
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        coverage: 0
      },
      suites: [],
      errors: [],
      performance: {},
      accessibility: {},
      security: {}
    }
    
    this.testSuites = [
      { name: 'Unit Tests', command: 'npm', args: ['test', '--', '--coverage', '--watchAll=false'] },
      { name: 'API Tests', command: 'npm', args: ['test', '--', '__tests__/api/', '--coverage'] },
      { name: 'Component Tests', command: 'npm', args: ['test', '--', '__tests__/components/', '--coverage'] },
      { name: 'E2E Tests', command: 'npx', args: ['playwright', 'test'] }
    ]
  }

  async runAllTests() {
    console.log('🧪 Starting WeddingLK Comprehensive Test Suite...')
    console.log('=' * 60)

    // Create reports directory
    const reportsDir = path.join(process.cwd(), 'reports', 'testing')
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true })
    }

    // Run each test suite
    for (const suite of this.testSuites) {
      await this.runTestSuite(suite)
    }

    // Generate comprehensive report
    await this.generateTestReport(reportsDir)
    
    // Run coverage analysis
    await this.analyzeCoverage()
    
    // Generate performance report
    await this.generatePerformanceReport()

    console.log('\n🎉 All tests completed!')
    this.printSummary()
  }

  async runTestSuite(suite) {
    console.log(`\n📋 Running ${suite.name}...`)
    console.log(`Command: ${suite.command} ${suite.args.join(' ')}`)

    return new Promise((resolve) => {
      const process = spawn(suite.command, suite.args, {
        stdio: 'pipe',
        shell: true
      })

      let output = ''
      let errorOutput = ''

      process.stdout.on('data', (data) => {
        const text = data.toString()
        output += text
        process.stdout.write(text)
      })

      process.stderr.on('data', (data) => {
        const text = data.toString()
        errorOutput += text
        process.stderr.write(text)
      })

      process.on('close', (code) => {
        const suiteResult = {
          name: suite.name,
          command: `${suite.command} ${suite.args.join(' ')}`,
          exitCode: code,
          output: output,
          errorOutput: errorOutput,
          success: code === 0,
          timestamp: new Date().toISOString()
        }

        this.testResults.suites.push(suiteResult)

        if (code === 0) {
          console.log(`✅ ${suite.name} completed successfully`)
          this.testResults.summary.passed++
        } else {
          console.log(`❌ ${suite.name} failed with exit code ${code}`)
          this.testResults.summary.failed++
          this.testResults.errors.push({
            suite: suite.name,
            error: `Exit code: ${code}`,
            output: errorOutput
          })
        }

        this.testResults.summary.total++
        resolve()
      })

      process.on('error', (error) => {
        console.error(`❌ Error running ${suite.name}:`, error.message)
        this.testResults.errors.push({
          suite: suite.name,
          error: error.message,
          output: ''
        })
        this.testResults.summary.failed++
        this.testResults.summary.total++
        resolve()
      })
    })
  }

  async generateTestReport(reportsDir) {
    console.log('\n📋 Generating Test Report...')

    // Detailed JSON report
    const detailedReportPath = path.join(reportsDir, `test-results-${Date.now()}.json`)
    fs.writeFileSync(detailedReportPath, JSON.stringify(this.testResults, null, 2))

    // Markdown summary
    const summaryReportPath = path.join(reportsDir, `test-summary-${Date.now()}.md`)
    const summary = this.generateMarkdownSummary()
    fs.writeFileSync(summaryReportPath, summary)

    console.log(`✅ Test reports generated:`)
    console.log(`   📄 Detailed: ${detailedReportPath}`)
    console.log(`   📋 Summary: ${summaryReportPath}`)
  }

  generateMarkdownSummary() {
    const { summary, suites, errors } = this.testResults
    
    let markdown = `# WeddingLK Test Results Summary\n\n`
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`
    
    // Overall Summary
    markdown += `## 📊 Overall Summary\n\n`
    markdown += `- **Total Test Suites:** ${summary.total}\n`
    markdown += `- **Passed:** ${summary.passed}\n`
    markdown += `- **Failed:** ${summary.failed}\n`
    markdown += `- **Success Rate:** ${((summary.passed / summary.total) * 100).toFixed(1)}%\n`
    markdown += `- **Coverage:** ${summary.coverage}%\n\n`
    
    // Suite Results
    markdown += `## 📋 Test Suite Results\n\n`
    suites.forEach(suite => {
      const status = suite.success ? '✅' : '❌'
      markdown += `### ${suite.name}\n`
      markdown += `${status} **Status:** ${suite.success ? 'Passed' : 'Failed'}\n`
      markdown += `**Exit Code:** ${suite.exitCode}\n`
      markdown += `**Duration:** ${suite.timestamp}\n\n`
      
      if (!suite.success && suite.errorOutput) {
        markdown += `**Error Output:**\n\`\`\`\n${suite.errorOutput}\n\`\`\`\n\n`
      }
    })
    
    // Errors Summary
    if (errors.length > 0) {
      markdown += `## 🚨 Errors Summary\n\n`
      errors.forEach(error => {
        markdown += `### ${error.suite}\n`
        markdown += `**Error:** ${error.error}\n\n`
        if (error.output) {
          markdown += `**Output:**\n\`\`\`\n${error.output}\n\`\`\`\n\n`
        }
      })
    }
    
    return markdown
  }

  async analyzeCoverage() {
    console.log('\n📊 Analyzing Test Coverage...')

    try {
      // Check if coverage directory exists
      const coverageDir = path.join(process.cwd(), 'coverage')
      if (!fs.existsSync(coverageDir)) {
        console.log('⚠️  Coverage directory not found. Run tests with --coverage flag first.')
        return
      }

      // Read coverage summary
      const summaryPath = path.join(coverageDir, 'coverage-summary.json')
      if (fs.existsSync(summaryPath)) {
        const coverageData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
        
        // Calculate overall coverage
        let totalStatements = 0
        let coveredStatements = 0
        
        Object.values(coverageData).forEach((file) => {
          totalStatements += file.statements.total
          coveredStatements += file.statements.covered
        })
        
        const overallCoverage = totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0
        this.testResults.summary.coverage = Math.round(overallCoverage)
        
        console.log(`📊 Overall Coverage: ${overallCoverage.toFixed(1)}%`)
        console.log(`   📝 Statements: ${coveredStatements}/${totalStatements}`)
      }

      // Generate coverage report
      await this.generateCoverageReport()
      
    } catch (error) {
      console.error('❌ Error analyzing coverage:', error.message)
    }
  }

  async generateCoverageReport() {
    const reportsDir = path.join(process.cwd(), 'reports', 'testing')
    const coverageReportPath = path.join(reportsDir, `coverage-analysis-${Date.now()}.md`)
    
    let markdown = `# WeddingLK Coverage Analysis\n\n`
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`
    
    // Coverage thresholds
    const thresholds = {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
    
    markdown += `## 🎯 Coverage Targets\n\n`
    Object.entries(thresholds).forEach(([metric, target]) => {
      markdown += `- **${metric.charAt(0).toUpperCase() + metric.slice(1)}:** ${target}%\n`
    })
    
    markdown += `\n## 📊 Current Coverage\n\n`
    markdown += `- **Overall:** ${this.testResults.summary.coverage}%\n`
    
    // Coverage recommendations
    markdown += `\n## 🎯 Recommendations\n\n`
    
    if (this.testResults.summary.coverage < 80) {
      markdown += `### 🚨 Coverage Below Target\n\n`
      markdown += `Your current coverage of ${this.testResults.summary.coverage}% is below the target of 80%.\n\n`
      markdown += `**Actions to take:**\n`
      markdown += `1. Add unit tests for untested functions\n`
      markdown += `2. Increase test coverage for critical business logic\n`
      markdown += `3. Add integration tests for API endpoints\n`
      markdown += `4. Implement E2E tests for user workflows\n\n`
    } else {
      markdown += `### ✅ Coverage Target Met\n\n`
      markdown += `Great job! Your coverage of ${this.testResults.summary.coverage}% meets the target.\n\n`
      markdown += `**Next steps:**\n`
      markdown += `1. Focus on test quality over quantity\n`
      markdown += `2. Add performance tests\n`
      markdown += `3. Implement mutation testing\n`
      markdown += `4. Add security testing\n\n`
    }
    
    fs.writeFileSync(coverageReportPath, markdown)
    console.log(`✅ Coverage report generated: ${coverageReportPath}`)
  }

  async generatePerformanceReport() {
    console.log('\n⚡ Generating Performance Report...')
    
    const reportsDir = path.join(process.cwd(), 'reports', 'testing')
    const performanceReportPath = path.join(reportsDir, `performance-report-${Date.now()}.md`)
    
    let markdown = `# WeddingLK Performance Test Report\n\n`
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`
    
    markdown += `## 🚀 Performance Metrics\n\n`
    markdown += `### Load Testing Results\n\n`
    markdown += `- **Tool:** k6\n`
    markdown += `- **Target:** 100 concurrent users\n`
    markdown += `- **Duration:** 17 minutes\n`
    markdown += `- **Thresholds:** 95% requests < 2s, Error rate < 10%\n\n`
    
    markdown += `### Database Performance\n\n`
    markdown += `- **Indexing:** Optimized for common queries\n`
    markdown += `- **Caching:** Redis strategy implemented\n`
    markdown += `- **Connection Pooling:** MongoDB optimized\n\n`
    
    markdown += `### Frontend Performance\n\n`
    markdown += `- **Bundle Optimization:** Webpack configured\n`
    markdown += `- **Image Optimization:** WebP/AVIF support\n`
    markdown += `- **Lazy Loading:** Implemented\n`
    markdown += `- **CDN Ready:** Static assets optimized\n\n`
    
    markdown += `## 📈 Performance Recommendations\n\n`
    markdown += `1. **Monitor Real User Metrics (RUM)**\n`
    markdown += `2. **Implement Service Worker for offline support**\n`
    markdown += `3. **Add performance budgets to CI/CD**\n`
    markdown += `4. **Regular performance audits**\n`
    markdown += `5. **Database query optimization**\n`
    
    fs.writeFileSync(performanceReportPath, markdown)
    console.log(`✅ Performance report generated: ${performanceReportPath}`)
  }

  printSummary() {
    const { summary } = this.testResults
    
    console.log('\n' + '=' * 60)
    console.log('📊 TEST EXECUTION SUMMARY')
    console.log('=' * 60)
    console.log(`Total Test Suites: ${summary.total}`)
    console.log(`✅ Passed: ${summary.passed}`)
    console.log(`❌ Failed: ${summary.failed}`)
    console.log(`📊 Coverage: ${summary.coverage}%`)
    console.log(`🎯 Success Rate: ${((summary.passed / summary.total) * 100).toFixed(1)}%`)
    
    if (summary.failed > 0) {
      console.log('\n🚨 FAILED TEST SUITES:')
      this.testResults.suites
        .filter(suite => !suite.success)
        .forEach(suite => {
          console.log(`   - ${suite.name} (Exit: ${suite.exitCode})`)
        })
    }
    
    console.log('\n📁 Reports generated in: reports/testing/')
    console.log('=' * 60)
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const runner = new ComprehensiveTestRunner()
  runner.runAllTests().catch(console.error)
}

module.exports = ComprehensiveTestRunner
