
export interface IntegrationIssue {
  system: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  location: string;
  solution: string;
  tested: boolean;
}

export interface HealthCheckResult {
  system: string;
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
  error?: string;
  timestamp: Date;
}

export class IntegrationAuditor {
  private issues: IntegrationIssue[] = [];
  private healthChecks: HealthCheckResult[] = [];

  logIssue(issue: IntegrationIssue) {
    console.error(`[INTEGRATION AUDIT] ${issue.severity.toUpperCase()}: ${issue.issue}`, {
      system: issue.system,
      location: issue.location,
      solution: issue.solution
    });
    this.issues.push(issue);
  }

  recordHealthCheck(result: HealthCheckResult) {
    this.healthChecks.push(result);
    
    if (result.status !== 'healthy') {
      this.logIssue({
        system: result.system,
        severity: result.status === 'down' ? 'critical' : 'high',
        issue: result.error || 'System degraded',
        location: `Health check for ${result.system}`,
        solution: 'Check system connectivity and configuration',
        tested: false
      });
    }
  }

  generateReport(): string {
    const critical = this.issues.filter(i => i.severity === 'critical').length;
    const high = this.issues.filter(i => i.severity === 'high').length;
    const medium = this.issues.filter(i => i.severity === 'medium').length;
    const low = this.issues.filter(i => i.severity === 'low').length;

    return `
INTEGRATION AUDIT REPORT
========================
Critical Issues: ${critical}
High Priority: ${high}
Medium Priority: ${medium}
Low Priority: ${low}

${this.issues.map(issue => `
${issue.severity.toUpperCase()}: ${issue.system}
Issue: ${issue.issue}
Location: ${issue.location}
Solution: ${issue.solution}
Tested: ${issue.tested ? '✅' : '❌'}
`).join('\n')}

HEALTH CHECK SUMMARY
====================
${this.healthChecks.map(check => `
${check.system}: ${check.status.toUpperCase()} ${check.latency ? `(${check.latency}ms)` : ''}
${check.error ? `Error: ${check.error}` : ''}
Checked: ${check.timestamp.toISOString()}
`).join('\n')}
    `;
  }

  getCriticalIssues(): IntegrationIssue[] {
    return this.issues.filter(i => i.severity === 'critical');
  }

  getSystemHealth(system: string): HealthCheckResult | undefined {
    return this.healthChecks.find(h => h.system === system);
  }
}

export const auditor = new IntegrationAuditor();
