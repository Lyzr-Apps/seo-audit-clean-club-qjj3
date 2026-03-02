'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiChevronDown, FiChevronUp, FiExternalLink, FiCopy, FiCheck, FiCode, FiShield, FiSmartphone, FiGlobe } from 'react-icons/fi'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DeveloperToolsTabProps { data: any }

function StatusBadge({ status }: { status?: string }) {
  const s = (status ?? '').toLowerCase()
  if (s === 'pass' || s === 'good') return <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Pass</Badge>
  if (s === 'warning' || s === 'needs-improvement') return <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Warning</Badge>
  if (s === 'fail' || s === 'poor' || s === 'critical') return <Badge className="text-[10px] bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Fail</Badge>
  return <Badge variant="outline" className="text-[10px]">{status ?? 'Unknown'}</Badge>
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }
  return (
    <div className="relative bg-gray-900 rounded-lg p-4 overflow-x-auto mt-2">
      <button onClick={handleCopy} className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600 flex items-center gap-1">
        {copied ? <><FiCheck className="w-3 h-3" /> Copied</> : <><FiCopy className="w-3 h-3" /> Copy</>}
      </button>
      <pre className="text-xs text-gray-100 font-mono whitespace-pre-wrap">{code}</pre>
    </div>
  )
}

function FindingsCard({ title, icon, status, url, findings, issues, recommendations }: {
  title: string; icon: React.ReactNode; status?: string; url?: string;
  findings?: string[]; issues?: string[]; recommendations?: string[]
}) {
  const findingsList = Array.isArray(findings) ? findings : []
  const issuesList = Array.isArray(issues) ? issues : []
  const recList = Array.isArray(recommendations) ? recommendations : []

  return (
    <div className="bg-white/60 border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {icon}
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <StatusBadge status={status} />
      </div>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          {url} <FiExternalLink className="w-3 h-3" />
        </a>
      )}
      {findingsList.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Findings</p>
          <ul className="space-y-1">
            {findingsList.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground"><span className="text-muted-foreground/50 mt-0.5">-</span>{f}</li>
            ))}
          </ul>
        </div>
      )}
      {issuesList.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-red-600 uppercase mb-1">Issues</p>
          <ul className="space-y-1">
            {issuesList.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-red-600"><FiAlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />{item}</li>
            ))}
          </ul>
        </div>
      )}
      {recList.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-emerald-600 uppercase mb-1">Recommendations</p>
          <ul className="space-y-1">
            {recList.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-700"><FiCheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SocialMetaCard({ title, tagsFound, missingTags, recommendations, status }: {
  title: string; status?: string;
  tagsFound?: { property: string; content: string; valid: boolean }[];
  missingTags?: string[]; recommendations?: string[]
}) {
  const tags = Array.isArray(tagsFound) ? tagsFound : []
  const missing = Array.isArray(missingTags) ? missingTags : []
  const recs = Array.isArray(recommendations) ? recommendations : []

  return (
    <div className="bg-white/60 border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <FiGlobe className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <StatusBadge status={status} />
      </div>
      {tags.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border"><th className="text-left py-1.5 pr-3 text-muted-foreground font-medium">Property</th><th className="text-left py-1.5 pr-3 text-muted-foreground font-medium">Content</th><th className="text-left py-1.5 text-muted-foreground font-medium">Valid</th></tr></thead>
            <tbody>
              {tags.map((tag, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-1.5 pr-3 font-mono text-foreground">{tag?.property ?? ''}</td>
                  <td className="py-1.5 pr-3 text-muted-foreground max-w-[200px] truncate">{tag?.content ?? ''}</td>
                  <td className="py-1.5">{tag?.valid ? <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <FiAlertCircle className="w-3.5 h-3.5 text-red-500" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {missing.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-red-600 uppercase mb-1">Missing Tags</p>
          <div className="flex flex-wrap gap-1">{missing.map((t, i) => <Badge key={i} variant="outline" className="text-[10px] text-red-600 border-red-200">{t}</Badge>)}</div>
        </div>
      )}
      {recs.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-emerald-600 uppercase mb-1">Recommendations</p>
          <ul className="space-y-1">{recs.map((r, i) => <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-700"><FiCheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />{r}</li>)}</ul>
        </div>
      )}
    </div>
  )
}

export default function DeveloperToolsTab({ data }: DeveloperToolsTabProps) {
  const [expandedSchemas, setExpandedSchemas] = useState<number[]>([])

  if (!data) {
    return (
      <div className="text-center py-10">
        <FiCode className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No developer SEO data available yet. Run an audit to see technical analysis.</p>
      </div>
    )
  }

  const schema = data?.schema_markup
  const existingSchemas = Array.isArray(schema?.existing_schemas) ? schema.existing_schemas : []
  const recommendedSchemas = Array.isArray(schema?.recommended_schemas) ? schema.recommended_schemas : []
  const richResults = Array.isArray(schema?.rich_result_eligible) ? schema.rich_result_eligible : []
  const secHeaders = Array.isArray(data?.security_headers?.headers) ? data.security_headers.headers : []
  const speedFindings = Array.isArray(data?.page_speed_technical?.findings) ? data.page_speed_technical.findings : []
  const speedRecs = Array.isArray(data?.page_speed_technical?.recommendations) ? data.page_speed_technical.recommendations : []

  const toggleSchema = (idx: number) => {
    setExpandedSchemas(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx])
  }

  return (
    <div className="space-y-6">
      {data?.summary && <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>}

      {/* Schema Markup */}
      {schema && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiCode className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Schema Markup</h3>
            <StatusBadge status={schema?.status} />
          </div>

          {existingSchemas.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Existing Schemas</p>
              <div className="space-y-2">
                {existingSchemas.map((s: { type?: string; format?: string; valid?: boolean; issues?: string[] }, i: number) => {
                  const issuesList = Array.isArray(s?.issues) ? s.issues : []
                  return (
                    <div key={i} className="bg-white/60 border border-border rounded-lg p-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">{s?.type ?? 'Unknown'}</span>
                        <Badge variant="outline" className="text-[10px]">{s?.format ?? ''}</Badge>
                        {s?.valid ? <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Valid</Badge> : <Badge className="text-[10px] bg-red-100 text-red-700 border-red-200 hover:bg-red-100">Invalid</Badge>}
                      </div>
                      {issuesList.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {issuesList.map((issue: string, j: number) => (
                            <li key={j} className="flex items-start gap-1.5 text-xs text-red-600"><FiAlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />{issue}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {recommendedSchemas.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Recommended Schemas</p>
              <div className="space-y-2">
                {recommendedSchemas.map((s: { type?: string; reason?: string; code_snippet?: string }, i: number) => (
                  <div key={i} className="bg-white/60 border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">{s?.type ?? 'Schema'}</Badge>
                        <span className="text-xs text-muted-foreground">{s?.reason ?? ''}</span>
                      </div>
                      {s?.code_snippet && (
                        <button onClick={() => toggleSchema(i)} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
                          <FiCode className="w-3 h-3" />
                          {expandedSchemas.includes(i) ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                    {expandedSchemas.includes(i) && s?.code_snippet && <CodeBlock code={s.code_snippet} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {richResults.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5">Rich Result Eligible</p>
              <div className="flex flex-wrap gap-1.5">{richResults.map((r: string, i: number) => <Badge key={i} className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">{r}</Badge>)}</div>
            </div>
          )}
        </div>
      )}

      {/* Technical Config Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {data?.robots_txt && <FindingsCard title="Robots.txt" icon={<FiCode className="w-4 h-4 text-muted-foreground" />} status={data.robots_txt?.status} findings={data.robots_txt?.findings} issues={data.robots_txt?.issues} recommendations={data.robots_txt?.recommendations} />}
        {data?.sitemap && <FindingsCard title="XML Sitemap" icon={<FiCode className="w-4 h-4 text-muted-foreground" />} status={data.sitemap?.status} url={data.sitemap?.url} findings={data.sitemap?.findings} issues={data.sitemap?.issues} recommendations={data.sitemap?.recommendations} />}
        {data?.canonical_tags && <FindingsCard title="Canonical Tags" icon={<FiCode className="w-4 h-4 text-muted-foreground" />} status={data.canonical_tags?.status} findings={data.canonical_tags?.findings} issues={data.canonical_tags?.issues} recommendations={data.canonical_tags?.recommendations} />}
        {data?.hreflang && <FindingsCard title="Hreflang" icon={<FiGlobe className="w-4 h-4 text-muted-foreground" />} status={data.hreflang?.status} findings={data.hreflang?.findings} issues={data.hreflang?.issues} recommendations={data.hreflang?.recommendations} />}
      </div>

      {/* Social Meta Tags */}
      {(data?.open_graph || data?.twitter_cards) && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Social Meta Tags</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data?.open_graph && <SocialMetaCard title="Open Graph" status={data.open_graph?.status} tagsFound={data.open_graph?.tags_found} missingTags={data.open_graph?.missing_tags} recommendations={data.open_graph?.recommendations} />}
            {data?.twitter_cards && <SocialMetaCard title="Twitter Cards" status={data.twitter_cards?.status} tagsFound={data.twitter_cards?.tags_found} missingTags={data.twitter_cards?.missing_tags} recommendations={data.twitter_cards?.recommendations} />}
          </div>
        </div>
      )}

      {/* Security Headers */}
      {secHeaders.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiShield className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Security Headers</h3>
            <StatusBadge status={data?.security_headers?.status} />
            {data?.security_headers?.score != null && (
              <Badge variant="outline" className="text-[10px]">Score: {data.security_headers.score}/100</Badge>
            )}
          </div>
          <div className="overflow-x-auto bg-white/60 border border-border rounded-lg">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-border"><th className="text-left p-3 text-muted-foreground font-medium">Header</th><th className="text-left p-3 text-muted-foreground font-medium">Present</th><th className="text-left p-3 text-muted-foreground font-medium">Value</th><th className="text-left p-3 text-muted-foreground font-medium">Recommendation</th></tr></thead>
              <tbody>
                {secHeaders.map((h: { name?: string; present?: boolean; value?: string; recommendation?: string }, i: number) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-3 font-mono font-medium text-foreground whitespace-nowrap">{h?.name ?? ''}</td>
                    <td className="p-3">{h?.present ? <FiCheckCircle className="w-4 h-4 text-emerald-500" /> : <FiAlertCircle className="w-4 h-4 text-red-500" />}</td>
                    <td className="p-3 text-muted-foreground max-w-[200px] truncate">{h?.value || <span className="text-red-400 italic">Not set</span>}</td>
                    <td className="p-3 text-muted-foreground">{h?.recommendation ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile & Rendering */}
      {(data?.mobile_friendliness || data?.js_rendering) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data?.mobile_friendliness && (
            <FindingsCard title="Mobile Friendliness" icon={<FiSmartphone className="w-4 h-4 text-muted-foreground" />} status={data.mobile_friendliness?.status} findings={data.mobile_friendliness?.findings} issues={data.mobile_friendliness?.issues} recommendations={data.mobile_friendliness?.recommendations} />
          )}
          {data?.js_rendering && (
            <div className="bg-white/60 border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <FiCode className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">JS Rendering</span>
                <StatusBadge status={data.js_rendering?.status} />
                {data.js_rendering?.rendering_type && <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">{data.js_rendering.rendering_type}</Badge>}
              </div>
              {Array.isArray(data.js_rendering?.findings) && data.js_rendering.findings.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Findings</p>
                  <ul className="space-y-1">{data.js_rendering.findings.map((f: string, i: number) => <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground"><span className="text-muted-foreground/50 mt-0.5">-</span>{f}</li>)}</ul>
                </div>
              )}
              {Array.isArray(data.js_rendering?.issues) && data.js_rendering.issues.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-red-600 uppercase mb-1">Issues</p>
                  <ul className="space-y-1">{data.js_rendering.issues.map((item: string, i: number) => <li key={i} className="flex items-start gap-1.5 text-xs text-red-600"><FiAlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />{item}</li>)}</ul>
                </div>
              )}
              {Array.isArray(data.js_rendering?.recommendations) && data.js_rendering.recommendations.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase mb-1">Recommendations</p>
                  <ul className="space-y-1">{data.js_rendering.recommendations.map((r: string, i: number) => <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-700"><FiCheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />{r}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Page Speed Technical */}
      {(speedFindings.length > 0 || speedRecs.length > 0) && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiAlertTriangle className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Page Speed Technical</h3>
            <StatusBadge status={data?.page_speed_technical?.status} />
          </div>
          {speedFindings.length > 0 && (
            <div className="overflow-x-auto bg-white/60 border border-border rounded-lg mb-3">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border"><th className="text-left p-3 text-muted-foreground font-medium">Factor</th><th className="text-left p-3 text-muted-foreground font-medium">Status</th><th className="text-left p-3 text-muted-foreground font-medium">Detail</th></tr></thead>
                <tbody>
                  {speedFindings.map((f: { factor?: string; status?: string; detail?: string }, i: number) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="p-3 font-medium text-foreground whitespace-nowrap">{f?.factor ?? ''}</td>
                      <td className="p-3"><StatusBadge status={f?.status} /></td>
                      <td className="p-3 text-muted-foreground">{f?.detail ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {speedRecs.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-emerald-600 uppercase mb-1.5">Recommendations</p>
              <ul className="space-y-1">
                {speedRecs.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-700"><FiCheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
