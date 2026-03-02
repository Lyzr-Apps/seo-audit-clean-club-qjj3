'use client'

import { Badge } from '@/components/ui/badge'
import { FiCheckCircle } from 'react-icons/fi'

interface KeywordEntry {
  keyword?: string
  search_intent?: string
  difficulty?: string
  relevance_score?: number
  recommendation?: string
}

interface KeywordData {
  summary?: string
  primary_keywords?: KeywordEntry[]
  secondary_keywords?: KeywordEntry[]
  long_tail_keywords?: KeywordEntry[]
  optimization_strategies?: string[]
}

interface KeywordTabProps {
  data: KeywordData | null | undefined
}

function DifficultyBadge({ difficulty }: { difficulty?: string }) {
  const d = difficulty?.toLowerCase() ?? ''
  if (d === 'high') return <Badge className="text-xs bg-red-100 text-red-700 border-red-200 hover:bg-red-100">High</Badge>
  if (d === 'medium') return <Badge className="text-xs bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Medium</Badge>
  return <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">{difficulty ?? 'Low'}</Badge>
}

function RelevanceBar({ score }: { score: number }) {
  const width = Math.min(Math.max(score * 10, 0), 100)
  const color = score >= 7 ? 'bg-emerald-500' : score >= 4 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{score}/10</span>
    </div>
  )
}

function KeywordGroup({ title, keywords }: { title: string; keywords: KeywordEntry[] }) {
  if (keywords.length === 0) return null
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="space-y-2">
        {keywords.map((kw, i) => (
          <div key={i} className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-medium text-sm text-foreground">{kw.keyword ?? 'N/A'}</span>
              {kw.search_intent && (
                <Badge variant="outline" className="text-xs">{kw.search_intent}</Badge>
              )}
              <DifficultyBadge difficulty={kw.difficulty} />
              <div className="ml-auto">
                <RelevanceBar score={kw.relevance_score ?? 0} />
              </div>
            </div>
            {kw.recommendation && (
              <p className="text-xs text-muted-foreground leading-relaxed">{kw.recommendation}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function KeywordTab({ data }: KeywordTabProps) {
  if (!data) return <p className="text-muted-foreground text-sm p-4">No keyword research data available.</p>

  const primaryKw = Array.isArray(data.primary_keywords) ? data.primary_keywords : []
  const secondaryKw = Array.isArray(data.secondary_keywords) ? data.secondary_keywords : []
  const longTailKw = Array.isArray(data.long_tail_keywords) ? data.long_tail_keywords : []
  const strategies = Array.isArray(data.optimization_strategies) ? data.optimization_strategies : []

  return (
    <div className="space-y-6">
      {data.summary && (
        <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4">
          <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
        </div>
      )}
      <KeywordGroup title="Primary Keywords" keywords={primaryKw} />
      <KeywordGroup title="Secondary Keywords" keywords={secondaryKw} />
      <KeywordGroup title="Long-tail Keywords" keywords={longTailKw} />
      {strategies.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Optimization Strategies</h3>
          <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4 space-y-2">
            {strategies.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                <FiCheckCircle className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
