'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { FiExternalLink, FiAlertCircle, FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface LinkRec {
  source_page?: string
  anchor_text?: string
  target_page?: string
  rationale?: string
  priority?: string
}

interface OrphanPage {
  page?: string
  issue?: string
  recommendation?: string
}

interface HubStrategy {
  topic_cluster?: string
  hub_page?: string
  spoke_pages?: string[]
  recommendation?: string
}

interface InternalLinkingData {
  summary?: string
  link_recommendations?: LinkRec[]
  orphan_pages?: OrphanPage[]
  hub_page_strategies?: HubStrategy[]
  general_recommendations?: string[]
}

interface InternalLinksTabProps {
  data: InternalLinkingData | null | undefined
}

function PriorityBadge({ priority }: { priority?: string }) {
  const p = priority?.toLowerCase() ?? ''
  if (p === 'high') return <Badge className="text-xs bg-red-100 text-red-700 border-red-200 hover:bg-red-100">High</Badge>
  if (p === 'medium') return <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Medium</Badge>
  return <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">{priority ?? 'Low'}</Badge>
}

function HubCard({ hub }: { hub: HubStrategy }) {
  const [open, setOpen] = useState(false)
  const spokes = Array.isArray(hub.spoke_pages) ? hub.spoke_pages : []

  return (
    <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">{hub.topic_cluster ?? 'Topic Cluster'}</span>
        </div>
        {open ? <FiChevronUp className="w-4 h-4 text-muted-foreground" /> : <FiChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border space-y-3 pt-3">
          {hub.hub_page && (
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Hub Page</span>
              <p className="text-sm text-foreground mt-0.5">{hub.hub_page}</p>
            </div>
          )}
          {spokes.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Spoke Pages</span>
              <ul className="mt-1 space-y-1">
                {spokes.map((sp, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <FiExternalLink className="w-3 h-3 mt-1 text-muted-foreground flex-shrink-0" />
                    {sp}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hub.recommendation && (
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase">Recommendation</span>
              <p className="text-sm text-foreground mt-0.5">{hub.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function InternalLinksTab({ data }: InternalLinksTabProps) {
  if (!data) return <p className="text-muted-foreground text-sm p-4">No internal linking data available.</p>

  const links = Array.isArray(data.link_recommendations) ? data.link_recommendations : []
  const orphans = Array.isArray(data.orphan_pages) ? data.orphan_pages : []
  const hubs = Array.isArray(data.hub_page_strategies) ? data.hub_page_strategies : []
  const genRecs = Array.isArray(data.general_recommendations) ? data.general_recommendations : []

  const sortedLinks = [...links].sort((a, b) => {
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 }
    return (order[a.priority?.toLowerCase() ?? 'low'] ?? 2) - (order[b.priority?.toLowerCase() ?? 'low'] ?? 2)
  })

  return (
    <div className="space-y-6">
      {data.summary && (
        <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4">
          <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
        </div>
      )}

      {sortedLinks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Link Recommendations</h3>
          <div className="space-y-2">
            {sortedLinks.map((lk, i) => (
              <div key={i} className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PriorityBadge priority={lk.priority} />
                  <span className="text-xs text-muted-foreground">Anchor:</span>
                  <Badge variant="outline" className="text-xs font-mono">{lk.anchor_text ?? 'N/A'}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <span className="text-muted-foreground">Source: </span>
                    <span className="text-foreground">{lk.source_page ?? 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target: </span>
                    <span className="text-foreground">{lk.target_page ?? 'N/A'}</span>
                  </div>
                </div>
                {lk.rationale && <p className="text-xs text-muted-foreground">{lk.rationale}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {orphans.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Orphan Pages</h3>
          <div className="space-y-2">
            {orphans.map((op, i) => (
              <div key={i} className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiAlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-sm font-medium text-foreground">{op.page ?? 'Unknown page'}</span>
                </div>
                {op.issue && <p className="text-xs text-muted-foreground mb-1">{op.issue}</p>}
                {op.recommendation && <p className="text-xs text-emerald-700">{op.recommendation}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {hubs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Hub Page Strategies</h3>
          <div className="space-y-2">
            {hubs.map((hub, i) => <HubCard key={i} hub={hub} />)}
          </div>
        </div>
      )}

      {genRecs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">General Recommendations</h3>
          <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4 space-y-2">
            {genRecs.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                <FiCheckCircle className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                {r}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
