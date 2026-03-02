'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { FiChevronDown, FiChevronUp, FiFlag } from 'react-icons/fi'

interface PriorityAction {
  action?: string
  category?: string
  impact?: string
  effort?: string
}

interface PriorityActionsSectionProps {
  actions: PriorityAction[] | null | undefined
}

function ImpactBadge({ level }: { level?: string }) {
  const l = level?.toLowerCase() ?? ''
  if (l === 'high') return <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">High Impact</Badge>
  if (l === 'medium') return <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Med Impact</Badge>
  return <Badge className="text-[10px] bg-muted text-muted-foreground hover:bg-muted">{level ?? 'Low'} Impact</Badge>
}

function EffortBadge({ level }: { level?: string }) {
  const l = level?.toLowerCase() ?? ''
  if (l === 'high') return <Badge variant="outline" className="text-[10px] border-red-200 text-red-600">High Effort</Badge>
  if (l === 'medium') return <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-600">Med Effort</Badge>
  return <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-600">{level ?? 'Low'} Effort</Badge>
}

function CategoryBadge({ category }: { category?: string }) {
  return <Badge variant="secondary" className="text-[10px]">{category ?? 'General'}</Badge>
}

export default function PriorityActionsSection({ actions }: PriorityActionsSectionProps) {
  const items = Array.isArray(actions) ? actions : []
  const [expanded, setExpanded] = useState(false)
  if (items.length === 0) return null

  const sorted = [...items].sort((a, b) => {
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 }
    return (order[a.impact?.toLowerCase() ?? 'low'] ?? 2) - (order[b.impact?.toLowerCase() ?? 'low'] ?? 2)
  })

  const displayItems = expanded ? sorted : sorted.slice(0, 3)
  const hasMore = sorted.length > 3

  return (
    <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 pt-4 pb-3">
        <FiFlag className="w-4 h-4 text-emerald-600" />
        <h3 className="text-sm font-semibold text-foreground flex-1">Priority Actions</h3>
        <Badge variant="outline" className="text-[10px]">{items.length} items</Badge>
      </div>
      <div className="px-5 pb-2">
        <div className="space-y-2">
          {displayItems.map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 py-2.5 px-3 rounded-xl bg-muted/20 border border-border/40">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">{i + 1}</span>
                <p className="text-sm text-foreground truncate">{item.action ?? 'N/A'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:flex-shrink-0">
                <CategoryBadge category={item.category} />
                <ImpactBadge level={item.impact} />
                <EffortBadge level={item.effort} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-primary font-medium hover:bg-muted/20 transition-colors border-t border-border/40"
        >
          {expanded ? (
            <>Show Less <FiChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>Show All {sorted.length} Actions <FiChevronDown className="w-3.5 h-3.5" /></>
          )}
        </button>
      )}
    </div>
  )
}
