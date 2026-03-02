'use client'

import { Badge } from '@/components/ui/badge'

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
  if (l === 'high') return <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">High Impact</Badge>
  if (l === 'medium') return <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Medium Impact</Badge>
  return <Badge className="text-xs bg-muted text-muted-foreground hover:bg-muted">{level ?? 'Low'} Impact</Badge>
}

function EffortBadge({ level }: { level?: string }) {
  const l = level?.toLowerCase() ?? ''
  if (l === 'high') return <Badge variant="outline" className="text-xs border-red-200 text-red-600">High Effort</Badge>
  if (l === 'medium') return <Badge variant="outline" className="text-xs border-amber-200 text-amber-600">Medium Effort</Badge>
  return <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-600">{level ?? 'Low'} Effort</Badge>
}

function CategoryBadge({ category }: { category?: string }) {
  return <Badge variant="secondary" className="text-xs">{category ?? 'General'}</Badge>
}

export default function PriorityActionsSection({ actions }: PriorityActionsSectionProps) {
  const items = Array.isArray(actions) ? actions : []
  if (items.length === 0) return null

  const sorted = [...items].sort((a, b) => {
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 }
    return (order[a.impact?.toLowerCase() ?? 'low'] ?? 2) - (order[b.impact?.toLowerCase() ?? 'low'] ?? 2)
  })

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Priority Actions</h3>
      <div className="space-y-2">
        {sorted.map((item, i) => (
          <div key={i} className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-foreground">{item.action ?? 'N/A'}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={item.category} />
              <ImpactBadge level={item.impact} />
              <EffortBadge level={item.effort} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
