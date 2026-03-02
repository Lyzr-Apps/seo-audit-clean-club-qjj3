'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { FiChevronDown, FiChevronUp, FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiZap, FiPackage } from 'react-icons/fi'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface LighthouseTabProps { data: any }

function ScoreGauge({ score, label }: { score: number; label: string }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = ((score ?? 0) / 100) * circumference
  const color = (score ?? 0) >= 90 ? '#059669' : (score ?? 0) >= 50 ? '#d97706' : '#dc2626'
  const bgColor = (score ?? 0) >= 90 ? '#d1fae5' : (score ?? 0) >= 50 ? '#fef3c7' : '#fee2e2'

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" stroke={bgColor} strokeWidth="6" />
        <circle cx="44" cy="44" r={radius} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" transform="rotate(-90 44 44)" className="transition-all duration-700" />
        <text x="44" y="44" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="20" fontWeight="700">{score ?? 0}</text>
      </svg>
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  )
}

function StatusDot({ status }: { status?: string }) {
  const s = (status ?? '').toLowerCase()
  if (s === 'good' || s === 'pass') return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
  if (s === 'needs-improvement' || s === 'warning') return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
  return <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
}

function SeverityBadge({ severity }: { severity?: string }) {
  const s = (severity ?? '').toLowerCase()
  if (s === 'critical' || s === 'fail') return <Badge className="text-[10px] font-semibold bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Critical</Badge>
  if (s === 'warning') return <Badge className="text-[10px] font-semibold bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Warning</Badge>
  return <Badge className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Pass</Badge>
}

function PriorityBadge({ priority }: { priority?: string }) {
  const p = (priority ?? '').toLowerCase()
  if (p === 'high') return <Badge className="text-[10px] font-semibold bg-red-100 text-red-700 border-red-200 hover:bg-red-100">High</Badge>
  if (p === 'medium') return <Badge className="text-[10px] font-semibold bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Medium</Badge>
  return <Badge className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Low</Badge>
}

function CollapsibleSection({ title, icon, count, children }: { title: string; icon: React.ReactNode; count?: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2.5 px-5 py-3.5 text-left hover:bg-muted/20 transition-colors">
        {icon}
        <span className="text-sm font-semibold text-foreground flex-1">{title}</span>
        {count != null && <Badge variant="outline" className="text-[10px] font-medium">{count}</Badge>}
        {open ? <FiChevronUp className="w-4 h-4 text-muted-foreground" /> : <FiChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-border/50">{children}</div>}
    </div>
  )
}

export default function LighthouseTab({ data }: LighthouseTabProps) {
  const [showPassedA11y, setShowPassedA11y] = useState(false)
  const [showPassedBP, setShowPassedBP] = useState(false)
  const [showPassedSEO, setShowPassedSEO] = useState(false)

  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-3">
          <FiZap className="w-6 h-6 text-primary/60" />
        </div>
        <p className="text-sm text-muted-foreground">No Lighthouse data available yet. Run an audit to see performance analysis.</p>
      </div>
    )
  }

  const perf = data?.performance
  const metrics = perf?.metrics
  const metricEntries: { key: string; label: string; full: string }[] = [
    { key: 'fcp', label: 'FCP', full: 'First Contentful Paint' },
    { key: 'lcp', label: 'LCP', full: 'Largest Contentful Paint' },
    { key: 'tbt', label: 'TBT', full: 'Total Blocking Time' },
    { key: 'cls', label: 'CLS', full: 'Cumulative Layout Shift' },
    { key: 'inp', label: 'INP', full: 'Interaction to Next Paint' },
    { key: 'ttfb', label: 'TTFB', full: 'Time to First Byte' },
    { key: 'speed_index', label: 'SI', full: 'Speed Index' },
  ]

  const accessibilityIssues = Array.isArray(data?.accessibility?.issues) ? data.accessibility.issues : []
  const accessibilityPassed = Array.isArray(data?.accessibility?.passed_audits) ? data.accessibility.passed_audits : []
  const bpIssues = Array.isArray(data?.best_practices?.issues) ? data.best_practices.issues : []
  const bpPassed = Array.isArray(data?.best_practices?.passed_audits) ? data.best_practices.passed_audits : []
  const seoIssues = Array.isArray(data?.seo_technical?.issues) ? data.seo_technical.issues : []
  const seoPassed = Array.isArray(data?.seo_technical?.passed_audits) ? data.seo_technical.passed_audits : []
  const opportunities = Array.isArray(perf?.opportunities) ? perf.opportunities : []
  const diagnostics = Array.isArray(perf?.diagnostics) ? perf.diagnostics : []
  const pwaChecks = Array.isArray(data?.pwa?.checks) ? data.pwa.checks : []
  const res = data?.resource_summary

  return (
    <div className="space-y-7">
      {data?.summary && (
        <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Score Gauges */}
      <div className="flex flex-wrap items-center justify-center gap-8 py-6 px-4 bg-muted/20 rounded-2xl">
        {perf?.score != null && <ScoreGauge score={perf.score} label="Performance" />}
        {data?.accessibility?.score != null && <ScoreGauge score={data.accessibility.score} label="Accessibility" />}
        {data?.best_practices?.score != null && <ScoreGauge score={data.best_practices.score} label="Best Practices" />}
        {data?.seo_technical?.score != null && <ScoreGauge score={data.seo_technical.score} label="SEO" />}
        {data?.pwa?.score != null && <ScoreGauge score={data.pwa.score} label="PWA" />}
      </div>

      {/* Core Web Vitals */}
      {metrics && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Core Web Vitals</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {metricEntries.map(({ key, label, full }) => {
              const m = metrics?.[key]
              if (!m) return null
              const scoreVal = m?.score ?? 0
              const barColor = (m?.status ?? '').toLowerCase() === 'good' ? 'bg-emerald-500' : (m?.status ?? '').toLowerCase() === 'needs-improvement' ? 'bg-amber-500' : 'bg-red-500'
              return (
                <div key={key} className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 space-y-2.5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
                    <StatusDot status={m?.status} />
                  </div>
                  <p className="text-xl font-bold text-foreground">{m?.value ?? 'N/A'}</p>
                  <p className="text-[10px] text-muted-foreground">{full}</p>
                  <div className="w-full bg-muted/50 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${barColor} transition-all duration-500`} style={{ width: `${Math.min(scoreVal, 100)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <CollapsibleSection title="Opportunities" icon={<FiZap className="w-4 h-4 text-amber-500" />} count={opportunities.length}>
          <div className="space-y-2.5 mt-4">
            {opportunities.map((opp: { title?: string; description?: string; savings?: string; priority?: string }, i: number) => (
              <div key={i} className="bg-muted/20 border border-border/40 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-foreground">{opp?.title ?? 'Opportunity'}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {opp?.savings && <Badge variant="outline" className="text-[10px] font-medium">{opp.savings}</Badge>}
                    <PriorityBadge priority={opp?.priority} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{opp?.description ?? ''}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Diagnostics */}
      {diagnostics.length > 0 && (
        <CollapsibleSection title="Diagnostics" icon={<FiAlertTriangle className="w-4 h-4 text-amber-500" />} count={diagnostics.length}>
          <div className="space-y-2.5 mt-4">
            {diagnostics.map((diag: { title?: string; description?: string; value?: string }, i: number) => (
              <div key={i} className="flex items-start justify-between gap-3 bg-muted/20 border border-border/40 rounded-xl p-4">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-foreground">{diag?.title ?? 'Diagnostic'}</span>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{diag?.description ?? ''}</p>
                </div>
                {diag?.value && <Badge variant="outline" className="text-[10px] font-medium flex-shrink-0 whitespace-nowrap">{diag.value}</Badge>}
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Accessibility Issues */}
      {(accessibilityIssues.length > 0 || accessibilityPassed.length > 0) && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Accessibility</h3>
          {accessibilityIssues.length > 0 && (
            <div className="space-y-2.5 mb-3">
              {accessibilityIssues.map((issue: { title?: string; description?: string; severity?: string; elements_affected?: number }, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4">
                  <FiAlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${(issue?.severity ?? '').toLowerCase() === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{issue?.title ?? 'Issue'}</span>
                      <SeverityBadge severity={issue?.severity} />
                      {(issue?.elements_affected ?? 0) > 0 && <Badge variant="outline" className="text-[10px] font-medium">{issue.elements_affected} elements</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{issue?.description ?? ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {accessibilityPassed.length > 0 && (
            <div>
              <button onClick={() => setShowPassedA11y(!showPassedA11y)} className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
                <FiCheckCircle className="w-3.5 h-3.5" />
                {showPassedA11y ? 'Hide' : 'Show'} {accessibilityPassed.length} passed audits
                {showPassedA11y ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
              </button>
              {showPassedA11y && (
                <div className="mt-2.5 space-y-1.5">
                  {accessibilityPassed.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground"><FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{item}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Best Practices */}
      {(bpIssues.length > 0 || bpPassed.length > 0) && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Best Practices</h3>
          {bpIssues.length > 0 && (
            <div className="space-y-2.5 mb-3">
              {bpIssues.map((issue: { title?: string; description?: string; severity?: string }, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4">
                  <FiAlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-sm font-semibold text-foreground">{issue?.title ?? 'Issue'}</span><SeverityBadge severity={issue?.severity} /></div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{issue?.description ?? ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {bpPassed.length > 0 && (
            <div>
              <button onClick={() => setShowPassedBP(!showPassedBP)} className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
                <FiCheckCircle className="w-3.5 h-3.5" />
                {showPassedBP ? 'Hide' : 'Show'} {bpPassed.length} passed audits
                {showPassedBP ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
              </button>
              {showPassedBP && (
                <div className="mt-2.5 space-y-1.5">
                  {bpPassed.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground"><FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{item}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SEO Technical */}
      {(seoIssues.length > 0 || seoPassed.length > 0) && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">SEO Technical</h3>
          {seoIssues.length > 0 && (
            <div className="space-y-2.5 mb-3">
              {seoIssues.map((issue: { title?: string; description?: string; severity?: string }, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4">
                  <FiAlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${(issue?.severity ?? '').toLowerCase() === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-sm font-semibold text-foreground">{issue?.title ?? 'Issue'}</span><SeverityBadge severity={issue?.severity} /></div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{issue?.description ?? ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {seoPassed.length > 0 && (
            <div>
              <button onClick={() => setShowPassedSEO(!showPassedSEO)} className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
                <FiCheckCircle className="w-3.5 h-3.5" />
                {showPassedSEO ? 'Hide' : 'Show'} {seoPassed.length} passed audits
                {showPassedSEO ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
              </button>
              {showPassedSEO && (
                <div className="mt-2.5 space-y-1.5">
                  {seoPassed.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground"><FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{item}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PWA Checks */}
      {pwaChecks.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Progressive Web App</h3>
          <div className="space-y-2">
            {pwaChecks.map((check: { title?: string; status?: string; description?: string }, i: number) => {
              const passed = (check?.status ?? '').toLowerCase() === 'pass'
              return (
                <div key={i} className="flex items-start gap-3 bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4">
                  {passed ? <FiCheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> : <FiAlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-foreground">{check?.title ?? 'Check'}</span>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{check?.description ?? ''}</p>
                  </div>
                  <Badge className={`text-[10px] font-semibold flex-shrink-0 ${passed ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100'}`}>{passed ? 'Pass' : 'Fail'}</Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Resource Summary */}
      {res && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2"><FiPackage className="w-4 h-4 text-muted-foreground" /> Resource Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 text-center">
              <p className="text-xl font-bold text-foreground">{res?.total_requests ?? '-'}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-1">Total Requests</p>
            </div>
            <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 text-center">
              <p className="text-xl font-bold text-foreground">{res?.total_size ?? '-'}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-1">Total Size</p>
            </div>
            {res?.scripts && (
              <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 text-center">
                <p className="text-xl font-bold text-foreground">{res.scripts?.count ?? 0}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-1">Scripts ({res.scripts?.size ?? ''})</p>
              </div>
            )}
            {res?.stylesheets && (
              <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 text-center">
                <p className="text-xl font-bold text-foreground">{res.stylesheets?.count ?? 0}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-1">Stylesheets ({res.stylesheets?.size ?? ''})</p>
              </div>
            )}
            {res?.images && (
              <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 text-center">
                <p className="text-xl font-bold text-foreground">{res.images?.count ?? 0}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-1">Images ({res.images?.size ?? ''})</p>
              </div>
            )}
            {res?.fonts && (
              <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 text-center">
                <p className="text-xl font-bold text-foreground">{res.fonts?.count ?? 0}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-1">Fonts ({res.fonts?.size ?? ''})</p>
              </div>
            )}
            {res?.third_party && (
              <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 text-center">
                <p className="text-xl font-bold text-foreground">{res.third_party?.count ?? 0}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-1">3rd Party ({res.third_party?.size ?? ''})</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
