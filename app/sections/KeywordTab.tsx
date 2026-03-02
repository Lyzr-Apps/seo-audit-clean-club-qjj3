'use client'

import { Badge } from '@/components/ui/badge'
import { FiCheckCircle, FiTrendingUp } from 'react-icons/fi'

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
  if (d === 'high') return <Badge className="text-[10px] font-semibold bg-red-100 text-red-700 border-red-200 hover:bg-red-100">High</Badge>
  if (d === 'medium') return <Badge className="text-[10px] font-semibold bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Medium</Badge>
  return <Badge className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">{difficulty ?? 'Low'}</Badge>
}

function RelevanceBar({ score }: { score: number }) {
  const width = Math.min(Math.max(score * 10, 0), 100)
  const color = score >= 7 ? 'bg-emerald-500' : score >= 4 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-20 h-2 bg-muted/60 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${width}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">{score}/10</span>
    </div>
  )
}

function KeywordGroup({ title, keywords, color }: { title: string; keywords: KeywordEntry[]; color: string }) {
  if (keywords.length === 0) return null
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <Badge variant="outline" className="text-[10px] font-medium">{keywords.length}</Badge>
      </div>
      <div className="space-y-2.5">
        {keywords.map((kw, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="font-semibold text-sm text-foreground">{kw.keyword ?? 'N/A'}</span>
              {kw.search_intent && (
                <Badge variant="outline" className="text-[10px] font-medium">{kw.search_intent}</Badge>
              )}
              <DifficultyBadge difficulty={kw.difficulty} />
              <div className="ml-auto">
                <RelevanceBar score={kw.relevance_score ?? 0} />
              </div>
            </div>
            {kw.recommendation && (
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">{kw.recommendation}</p>
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
    <div className="space-y-7">
      {data.summary && (
        <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-5">
          <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
        </div>
      )}
      <KeywordGroup title="Primary Keywords" keywords={primaryKw} color="bg-red-500" />
      <KeywordGroup title="Secondary Keywords" keywords={secondaryKw} color="bg-amber-500" />
      <KeywordGroup title="Long-tail Keywords" keywords={longTailKw} color="bg-emerald-500" />
      {strategies.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Optimization Strategies</h3>
          </div>
          <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-5 space-y-3">
            {strategies.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                <FiCheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
