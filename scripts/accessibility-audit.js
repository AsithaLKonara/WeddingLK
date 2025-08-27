#!/usr/bin/env node

/**
 * WeddingLK Accessibility Audit Script
 * Performs comprehensive accessibility checks using axe-core and Lighthouse
 */

const puppeteer = require('puppeteer')
const { AxePuppeteer } = require('@axe-core/puppeteer')
const lighthouse = require('lighthouse')
const fs = require('fs')
const path = require('path')

class AccessibilityAuditor {
  constructor() {
    this.baseUrl = 'http://localhost:3000'
    this.pages = [
      '/',
      '/venues',
      '/packages',
      '/feed',
      '/dashboard',
      '/login',
      '/register'
    ]
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalPages: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
        criticalIssues: 0
      },
      pages: [],
      recommendations: []
    }
  }

  async runAudit() {
    console.log('🔍 Starting WeddingLK Accessibility Audit...')
    console.log('=' * 60)

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    try {
      for (const pagePath of this.pages) {
        await this.auditPage(browser, pagePath)
      }

      await this.generateReport()
      await this.runLighthouseAudit()
      
    } catch (error) {
      console.error('❌ Audit failed:', error)
    } finally {
      await browser.close()
    }
  }

  async auditPage(browser, pagePath) {
    const page = await browser.newPage()
    const fullUrl = `${this.baseUrl}${pagePath}`
    
    console.log(`\n📄 Auditing: ${pagePath}`)
    
    try {
      // Navigate to page
      await page.goto(fullUrl, { waitUntil: 'networkidle0' })
      
      // Wait for content to load
      await page.waitForTimeout(2000)
      
      // Run axe-core audit
      const axeResults = await new AxePuppeteer(page).analyze()
      
      // Analyze results
      const pageResults = this.analyzeAxeResults(axeResults, pagePath)
      this.results.pages.push(pageResults)
      
      // Update summary
      this.results.summary.totalPages++
      if (pageResults.violations.length === 0) {
        this.results.summary.passed++
      } else {
        this.results.summary.failed++
        this.results.summary.criticalIssues += pageResults.criticalViolations
      }
      
      // Log results
      this.logPageResults(pageResults)
      
    } catch (error) {
      console.error(`❌ Error auditing ${pagePath}:`, error.message)
      this.results.pages.push({
        path: pagePath,
        error: error.message,
        violations: [],
        warnings: [],
        criticalViolations: 0
      })
    } finally {
      await page.close()
    }
  }

  analyzeAxeResults(axeResults, pagePath) {
    const violations = axeResults.violations || []
    const warnings = axeResults.passes || []
    
    // Categorize violations by severity
    const criticalViolations = violations.filter(v => 
      v.impact === 'critical' || v.impact === 'serious'
    )
    
    const moderateViolations = violations.filter(v => 
      v.impact === 'moderate'
    )
    
    const minorViolations = violations.filter(v => 
      v.impact === 'minor'
    )

    return {
      path: pagePath,
      violations: violations,
      warnings: warnings,
      criticalViolations: criticalViolations.length,
      moderateViolations: moderateViolations.length,
      minorViolations: minorViolations.length,
      totalIssues: violations.length,
      score: this.calculateAccessibilityScore(violations)
    }
  }

  calculateAccessibilityScore(violations) {
    if (violations.length === 0) return 100
    
    const criticalWeight = 5
    const seriousWeight = 3
    const moderateWeight = 2
    const minorWeight = 1
    
    let totalPenalty = 0
    
    violations.forEach(violation => {
      switch (violation.impact) {
        case 'critical':
          totalPenalty += criticalWeight
          break
        case 'serious':
          totalPenalty += seriousWeight
          break
        case 'moderate':
          totalPenalty += moderateWeight
          break
        case 'minor':
          totalPenalty += minorWeight
          break
      }
    })
    
    const maxPenalty = 20 // Maximum penalty for score calculation
    const score = Math.max(0, 100 - (totalPenalty / maxPenalty) * 100)
    
    return Math.round(score)
  }

  logPageResults(pageResults) {
    if (pageResults.error) {
      console.log(`  ❌ Error: ${pageResults.error}`)
      return
    }

    console.log(`  📊 Score: ${pageResults.score}/100`)
    console.log(`  🚨 Violations: ${pageResults.totalIssues}`)
    console.log(`  ⚠️  Critical: ${pageResults.criticalViolations}`)
    console.log(`  🔶 Moderate: ${pageResults.moderateViolations}`)
    console.log(`  🔸 Minor: ${pageResults.minorViolations}`)

    if (pageResults.criticalViolations > 0) {
      console.log(`  🚨 Critical Issues Found:`)
      pageResults.violations
        .filter(v => v.impact === 'critical' || v.impact === 'serious')
        .forEach(violation => {
          console.log(`    - ${violation.description}`)
          console.log(`      Rule: ${violation.id}`)
          console.log(`      Impact: ${violation.impact}`)
        })
    }
  }

  async generateReport() {
    console.log('\n📋 Generating Accessibility Report...')
    
    // Create reports directory
    const reportsDir = path.join(process.cwd(), 'reports', 'accessibility')
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true })
    }

    // Generate detailed report
    const reportPath = path.join(reportsDir, `accessibility-audit-${Date.now()}.json`)
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2))

    // Generate summary report
    const summaryPath = path.join(reportsDir, `accessibility-summary-${Date.now()}.md`)
    const summary = this.generateMarkdownSummary()
    fs.writeFileSync(summaryPath, summary)

    console.log(`✅ Reports generated:`)
    console.log(`   📄 Detailed: ${reportPath}`)
    console.log(`   📋 Summary: ${summaryPath}`)
  }

  generateMarkdownSummary() {
    const { summary, pages } = this.results
    
    let markdown = `# WeddingLK Accessibility Audit Report\n\n`
    markdown += `**Generated:** ${new Date().toLocaleString()}\n\n`
    
    // Overall Summary
    markdown += `## 📊 Overall Summary\n\n`
    markdown += `- **Total Pages Audited:** ${summary.totalPages}\n`
    markdown += `- **Pages Passed:** ${summary.passed}\n`
    markdown += `- **Pages Failed:** ${summary.failed}\n`
    markdown += `- **Critical Issues:** ${summary.criticalIssues}\n\n`
    
    // Page-by-page results
    markdown += `## 📄 Page Results\n\n`
    pages.forEach(page => {
      if (page.error) {
        markdown += `### ${page.path}\n`
        markdown += `❌ **Error:** ${page.error}\n\n`
      } else {
        markdown += `### ${page.path}\n`
        markdown += `- **Score:** ${page.score}/100\n`
        markdown += `- **Total Issues:** ${page.totalIssues}\n`
        markdown += `- **Critical:** ${page.criticalViolations}\n`
        markdown += `- **Moderate:** ${page.moderateViolations}\n`
        markdown += `- **Minor:** ${page.minorViolations}\n\n`
        
        if (page.criticalViolations > 0) {
          markdown += `**Critical Issues:**\n`
          page.violations
            .filter(v => v.impact === 'critical' || v.impact === 'serious')
            .forEach(violation => {
              markdown += `- ${violation.description} (${violation.id})\n`
            })
          markdown += `\n`
        }
      }
    })
    
    // Recommendations
    markdown += `## 🎯 Recommendations\n\n`
    markdown += this.generateRecommendations()
    
    return markdown
  }

  generateRecommendations() {
    const recommendations = []
    
    // Analyze common issues across pages
    const allViolations = this.results.pages.flatMap(p => p.violations || [])
    const violationCounts = {}
    
    allViolations.forEach(violation => {
      const key = violation.id
      violationCounts[key] = (violationCounts[key] || 0) + 1
    })
    
    // Generate recommendations based on common violations
    Object.entries(violationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([ruleId, count]) => {
        const violation = allViolations.find(v => v.id === ruleId)
        if (violation) {
          recommendations.push({
            rule: ruleId,
            description: violation.description,
            count: count,
            help: violation.help
          })
        }
      })
    
    let markdown = ''
    recommendations.forEach(rec => {
      markdown += `### ${rec.rule} (${rec.count} occurrences)\n`
      markdown += `**Issue:** ${rec.description}\n\n`
      markdown += `**Help:** ${rec.help}\n\n`
    })
    
    return markdown
  }

  async runLighthouseAudit() {
    console.log('\n🏗️  Running Lighthouse Accessibility Audit...')
    
    try {
      const { lhr } = await lighthouse(this.baseUrl, {
        port: 9222,
        output: 'json',
        onlyCategories: ['accessibility'],
        formFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        }
      })
      
      const accessibilityScore = lhr.categories.accessibility.score * 100
      console.log(`📊 Lighthouse Accessibility Score: ${accessibilityScore}/100`)
      
      // Save Lighthouse report
      const reportsDir = path.join(process.cwd(), 'reports', 'accessibility')
      const lighthousePath = path.join(reportsDir, `lighthouse-audit-${Date.now()}.json`)
      fs.writeFileSync(lighthousePath, JSON.stringify(lhr, null, 2))
      
      console.log(`✅ Lighthouse report saved: ${lighthousePath}`)
      
    } catch (error) {
      console.error('❌ Lighthouse audit failed:', error.message)
    }
  }
}

// Run the audit if this script is executed directly
if (require.main === module) {
  const auditor = new AccessibilityAuditor()
  auditor.runAudit().catch(console.error)
}

module.exports = AccessibilityAuditor
