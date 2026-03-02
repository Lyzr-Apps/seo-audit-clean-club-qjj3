'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { FiChevronDown, FiChevronUp, FiCheckCircle, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi'

interface AuditArea {
  score?: number
  severity?: string
  word_count?: number
  reading_level?: string
  findings?: string[]
  recommendations?: string[]
}

interface ContentAuditData {
  overall_score?: number
  summary?: string
  heading_structure?: AuditArea
  content_length?: AuditArea
  readability?: AuditArea
  keyword_density?: AuditArea
  image_alt_text?: AuditArea
  content_gaps?: AuditArea
}

interface ContentAuditTabProps {
  data: ContentAuditData | null | undefined
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : score >= 40 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'
  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold border ${color}`}>
      {score}
    </span>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const s = severity?.toLowerCase() ?? ''
  if (s === 'critical' || s === 'high') return <Badge variant="destructive" className="text-xs">{severity}</Badge>
  if (s === 'warning' || s === 'medium') return <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">{severity}</Badge>
  return <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">{severity}</Badge>
}

function SeverityIcon({ severity }: { severity?: string }) {
  const s = severity?.toLowerCase() ?? ''
  if (s === 'critical' || s === 'high') return <FiAlertCircle className="w-4 h-4 text-red-500" />
  if (s === 'warning' || s === 'medium') return <FiAlertTriangle className="w-4 h-4 text-amber-500" />
  return <FiCheckCircle className="w-4 h-4 text-emerald-500" />
}

function AuditCard({ title, area, extra }: { title: string; area?: AuditArea; extra?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  if (!area) return null
  const findings = Array.isArray(area.findings) ? area.findings : []
  const recs = Array.isArray(area.recommendations) ? area.recommendations : []

  return (
    <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <SeverityIcon severity={area.severity} />
          <span className="font-medium text-sm text-foreground">{title}</span>
          {area.severity && <SeverityBadge severity={area.severity} />}
          {extra}
        </div>
        <div className="flex items-center gap-3">
          <ScoreBadge score={area.score ?? 0} />
          {open ? <FiChevronUp className="w-4 h-4 text-muted-foreground" /> : <FiChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-border">
          {findings.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Findings</h4>
              <ul className="space-y-1.5">
                {findings.map((f, i) => (
                  <li key={i} className="text-sm text-foreground flex gap-2 items-start">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recs.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Recommendations</h4>
              <ul className="space-y-1.5">
                {recs.map((r, i) => (
                  <li key={i} className="text-sm text-emerald-700 flex gap-2 items-start">
                    <FiCheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ContentAuditTab({ data }: ContentAuditTabProps) {
  if (!data) return <p className="text-muted-foreground text-sm p-4">No content audit data available.</p>

  const overallScore = data.overall_score ?? 0
  const scoreColor = overallScore >= 70 ? 'text-emerald-600' : overallScore >= 40 ? 'text-amber-600' : 'text-red-600'
  const scoreBg = overallScore >= 70 ? 'bg-emerald-50 border-emerald-200' : overallScore >= 40 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'

  return (
    <div className="space-y-5">
      <div className={`flex items-center gap-5 p-5 rounded-[0.875rem] border ${scoreBg}`}>
        <div className="flex flex-col items-center">
          <span className={`text-4xl font-bold ${scoreColor}`}>{overallScore}</span>
          <span className="text-xs text-muted-foreground mt-1">/ 100</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm mb-1">Content Audit Score</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.summary ?? 'No summary available.'}</p>
        </div>
      </div>
      <div className="space-y-3">
        <AuditCard title="Heading Structure" area={data.heading_structure} />
        <AuditCard
          title="Content Length"
          area={data.content_length}
          extra={data.content_length?.word_count != null ? <Badge variant="outline" className="text-xs ml-1">{data.content_length.word_count} words</Badge> : null}
        />
        <AuditCard
          title="Readability"
          area={data.readability}
          extra={data.readability?.reading_level ? <Badge variant="outline" className="text-xs ml-1">{data.readability.reading_level}</Badge> : null}
        />
        <AuditCard title="Keyword Density" area={data.keyword_density} />
        <AuditCard title="Image Alt Text" area={data.image_alt_text} />
        <AuditCard title="Content Gaps" area={data.content_gaps} />
      </div>
    </div>
  )
}
