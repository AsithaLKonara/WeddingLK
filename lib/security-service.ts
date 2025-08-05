// Security Service for WeddingLK
// This service provides advanced security features and protection

export interface SecurityConfig {
  rateLimit: {
    windowMs: number
    maxRequests: number
  }
  encryption: {
    algorithm: string
    keyLength: number
  }
  validation: {
    strictMode: boolean
    sanitizeInput: boolean
  }
}

export interface SecurityEvent {
  id: string
  type: 'threat' | 'warning' | 'info'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  userId?: string
  ipAddress?: string
  userAgent?: string
}

export interface SecurityMetrics {
  totalThreats: number
  blockedRequests: number
  suspiciousActivities: number
  securityScore: number
  lastIncident: Date
}

export class SecurityService {
  private static events: SecurityEvent[] = []
  private static blockedIPs = new Set<string>()
  private static rateLimitMap = new Map<string, { count: number; resetTime: number }>()

  // Rate limiting
  static checkRateLimit(ipAddress: string, maxRequests: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
    try {
      const now = Date.now()
      const key = `rate_limit_${ipAddress}`
      const current = this.rateLimitMap.get(key)

      if (!current || now > current.resetTime) {
        this.rateLimitMap.set(key, {
          count: 1,
          resetTime: now + windowMs
        })
        return true
      }

      if (current.count >= maxRequests) {
        this.logSecurityEvent('threat', 'high', `Rate limit exceeded for IP: ${ipAddress}`)
        return false
      }

      current.count++
      return true
    } catch (error) {
      console.error('Rate limit check error:', error)
      return true
    }
  }

  // Input validation and sanitization
  static validateInput(input: any, type: 'email' | 'password' | 'text' | 'url'): boolean {
    try {
      if (!input || typeof input !== 'string') return false

      switch (type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(input)

        case 'password':
          // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
          return passwordRegex.test(input)

        case 'text':
          // Basic text validation
          return input.length > 0 && input.length <= 1000

        case 'url':
          try {
            new URL(input)
            return true
          } catch {
            return false
          }

        default:
          return false
      }
    } catch (error) {
      console.error('Input validation error:', error)
      return false
    }
  }

  // Sanitize HTML input
  static sanitizeHTML(input: string): string {
    try {
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
    } catch (error) {
      console.error('HTML sanitization error:', error)
      return ''
    }
  }

  // XSS Protection
  static detectXSS(input: string): boolean {
    try {
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi
      ]

      return xssPatterns.some(pattern => pattern.test(input))
    } catch (error) {
      console.error('XSS detection error:', error)
      return false
    }
  }

  // SQL Injection Protection
  static detectSQLInjection(input: string): boolean {
    try {
      const sqlPatterns = [
        /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi,
        /(\b(or|and)\b\s+\d+\s*=\s*\d+)/gi,
        /(\b(union|select)\b\s+.*\bfrom\b)/gi,
        /(--|\/\*|\*\/)/g
      ]

      return sqlPatterns.some(pattern => pattern.test(input))
    } catch (error) {
      console.error('SQL injection detection error:', error)
      return false
    }
  }

  // Block suspicious IP
  static blockIP(ipAddress: string, reason: string): void {
    try {
      this.blockedIPs.add(ipAddress)
      this.logSecurityEvent('threat', 'high', `IP blocked: ${ipAddress} - ${reason}`)
    } catch (error) {
      console.error('IP blocking error:', error)
    }
  }

  // Check if IP is blocked
  static isIPBlocked(ipAddress: string): boolean {
    return this.blockedIPs.has(ipAddress)
  }

  // Log security event
  static logSecurityEvent(type: SecurityEvent['type'], severity: SecurityEvent['severity'], message: string, userId?: string, ipAddress?: string): void {
    try {
      const event: SecurityEvent = {
        id: `security_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        severity,
        message,
        timestamp: new Date(),
        userId,
        ipAddress,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
      }

      this.events.push(event)
      console.log('Security event logged:', event)
    } catch (error) {
      console.error('Security event logging error:', error)
    }
  }

  // Get security metrics
  static getSecurityMetrics(): SecurityMetrics {
    try {
      const totalThreats = this.events.filter(event => event.type === 'threat').length
      const blockedRequests = this.blockedIPs.size
      const suspiciousActivities = this.events.filter(event => event.severity === 'high' || event.severity === 'critical').length
      
      const lastIncident = this.events.length > 0 
        ? new Date(Math.max(...this.events.map(event => event.timestamp.getTime())))
        : new Date()

      // Calculate security score (0-100)
      const securityScore = Math.max(0, 100 - (totalThreats * 5) - (suspiciousActivities * 3))

      return {
        totalThreats,
        blockedRequests,
        suspiciousActivities,
        securityScore,
        lastIncident
      }
    } catch (error) {
      console.error('Security metrics error:', error)
      return {
        totalThreats: 0,
        blockedRequests: 0,
        suspiciousActivities: 0,
        securityScore: 100,
        lastIncident: new Date()
      }
    }
  }

  // Generate security report
  static generateSecurityReport(): any {
    try {
      const metrics = this.getSecurityMetrics()
      const recentEvents = this.events
        .filter(event => event.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000))
        .slice(-10)

      return {
        metrics,
        recentEvents,
        recommendations: [
          'Enable two-factor authentication',
          'Implement session timeout',
          'Add IP whitelisting',
          'Enable security headers',
          'Regular security audits'
        ]
      }
    } catch (error) {
      console.error('Security report error:', error)
      return {}
    }
  }

  // Encrypt sensitive data
  static encryptData(data: string): string {
    try {
      // Mock encryption (in production, use proper encryption)
      return btoa(data)
    } catch (error) {
      console.error('Data encryption error:', error)
      return data
    }
  }

  // Decrypt sensitive data
  static decryptData(encryptedData: string): string {
    try {
      // Mock decryption (in production, use proper decryption)
      return atob(encryptedData)
    } catch (error) {
      console.error('Data decryption error:', error)
      return encryptedData
    }
  }

  // Validate session
  static validateSession(session: any): boolean {
    try {
      if (!session || !session.user) return false

      // Check session expiry
      if (session.expires && new Date() > new Date(session.expires)) {
        return false
      }

      // Check user permissions
      if (!session.user.email || !session.user.id) {
        return false
      }

      return true
    } catch (error) {
      console.error('Session validation error:', error)
      return false
    }
  }

  // Generate secure token
  static generateSecureToken(): string {
    try {
      const array = new Uint8Array(32)
      crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } catch (error) {
      console.error('Token generation error:', error)
      return Math.random().toString(36).substr(2, 15)
    }
  }
}

// Export the security service
export default SecurityService 