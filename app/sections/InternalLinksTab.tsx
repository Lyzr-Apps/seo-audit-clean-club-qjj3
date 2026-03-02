'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { FiExternalLink, FiAlertCircle, FiCheckCircle, FiChevronDown, FiChevronUp, FiLink } from 'react-icons/fi'

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
  if (p === 'high') return <Badge className="text-[10px] font-semibold bg-red-100 text-red-700 border-red-200 hover:bg-red-100">High</Badge>
  if (p === 'medium') return <Badge className="text-[10px] font-semibold bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Medium</Badge>
  return <Badge className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">{priority ?? 'Low'}</Badge>
}

function HubCard({ hub }: { hub: HubStrategy }) {
  const [open, setOpen] = useState(false)
  const spokes = Array.isArray(hub.spoke_pages) ? hub.spoke_pages : []

  return (
    <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <FiLink className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">{hub.topic_cluster ?? 'Topic Cluster'}</span>
        </div>
        {open ? <FiChevronUp className="w-4 h-4 text-muted-foreground" /> : <FiChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border/50 space-y-4 pt-4">
          {hub.hub_page && (
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hub Page</span>
              <p className="text-sm text-foreground mt-1 font-medium font-mono bg-muted/30 px-3 py-1.5 rounded-lg">{hub.hub_page}</p>
            </div>
          )}
          {spokes.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Spoke Pages</span>
              <ul className="mt-1.5 space-y-1.5">
                {spokes.map((sp, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <FiExternalLink className="w-3.5 h-3.5 mt-0.5 text-primary/60 flex-shrink-0" />
                    <span className="font-mono text-xs">{sp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hub.recommendation && (
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Recommendation</span>
              <p className="text-sm text-foreground mt-1 leading-relaxed">{hub.recommendation}</p>
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
    <div className="space-y-7">
      {data.summary && (
        <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-5">
          <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
        </div>
      )}

      {sortedLinks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">Link Recommendations</h3>
            <Badge variant="outline" className="text-[10px] font-medium">{sortedLinks.length}</Badge>
          </div>
          <div className="space-y-2.5">
            {sortedLinks.map((lk, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <PriorityBadge priority={lk.priority} />
                  <span className="text-[10px] text-muted-foreground font-medium">Anchor:</span>
                  <Badge variant="outline" className="text-[10px] font-mono font-medium">{lk.anchor_text ?? 'N/A'}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-2.5">
                  <div className="bg-muted/30 rounded-lg px-3 py-2">
                    <span className="text-muted-foreground font-medium">Source: </span>
                    <span className="text-foreground font-mono">{lk.source_page ?? 'N/A'}</span>
                  </div>
                  <div className="bg-muted/30 rounded-lg px-3 py-2">
                    <span className="text-muted-foreground font-medium">Target: </span>
                    <span className="text-foreground font-mono">{lk.target_page ?? 'N/A'}</span>
                  </div>
                </div>
                {lk.rationale && <p className="text-xs text-muted-foreground leading-relaxed">{lk.rationale}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {orphans.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">Orphan Pages</h3>
            <Badge className="text-[10px] font-semibold bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">{orphans.length} found</Badge>
          </div>
          <div className="space-y-2.5">
            {orphans.map((op, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-[20px] border border-amber-200/40 rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <FiAlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground font-mono">{op.page ?? 'Unknown page'}</span>
                </div>
                {op.issue && <p className="text-xs text-muted-foreground mb-1.5 ml-6">{op.issue}</p>}
                {op.recommendation && (
                  <div className="flex items-start gap-2 ml-6">
                    <FiCheckCircle className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                    <p className="text-xs text-emerald-700 leading-relaxed">{op.recommendation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hubs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">Hub Page Strategies</h3>
          <div className="space-y-2.5">
            {hubs.map((hub, i) => <HubCard key={i} hub={hub} />)}
          </div>
        </div>
      )}

      {genRecs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">General Recommendations</h3>
          <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-5 space-y-3">
            {genRecs.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                <FiCheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                {r}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
