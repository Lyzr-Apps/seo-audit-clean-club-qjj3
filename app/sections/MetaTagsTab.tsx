'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FiCopy, FiCheck, FiCheckCircle } from 'react-icons/fi'

interface SuggestedTitle {
  title?: string
  character_count?: number
  keywords_used?: string[]
  rationale?: string
}

interface SuggestedDescription {
  description?: string
  character_count?: number
  keywords_used?: string[]
  rationale?: string
}

interface MetaTagsData {
  summary?: string
  current_meta?: {
    title?: string
    description?: string
    title_length?: number
    description_length?: number
  }
  suggested_titles?: SuggestedTitle[]
  suggested_descriptions?: SuggestedDescription[]
  optimization_notes?: string[]
}

interface MetaTagsTabProps {
  data: MetaTagsData | null | undefined
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }
  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs">
      {copied ? (
        <><FiCheck className="w-3 h-3 mr-1 text-emerald-500" />Copied!</>
      ) : (
        <><FiCopy className="w-3 h-3 mr-1" />Copy</>
      )}
    </Button>
  )
}

function CharCountBadge({ count, limit }: { count: number; limit: number }) {
  const ok = count <= limit
  return (
    <Badge className={`text-xs ${ok ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100'}`}>
      {count} chars {ok ? '' : `(>${limit})`}
    </Badge>
  )
}

export default function MetaTagsTab({ data }: MetaTagsTabProps) {
  if (!data) return <p className="text-muted-foreground text-sm p-4">No meta tags data available.</p>

  const titles = Array.isArray(data.suggested_titles) ? data.suggested_titles : []
  const descriptions = Array.isArray(data.suggested_descriptions) ? data.suggested_descriptions : []
  const notes = Array.isArray(data.optimization_notes) ? data.optimization_notes : []

  return (
    <div className="space-y-6">
      {data.summary && (
        <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4">
          <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.current_meta && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Current Meta Tags</h3>
          <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Title</span>
                {data.current_meta.title_length != null && <CharCountBadge count={data.current_meta.title_length} limit={60} />}
              </div>
              <p className="text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2">{data.current_meta.title ?? 'N/A'}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Description</span>
                {data.current_meta.description_length != null && <CharCountBadge count={data.current_meta.description_length} limit={160} />}
              </div>
              <p className="text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2">{data.current_meta.description ?? 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {titles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Suggested Titles</h3>
          <div className="space-y-2">
            {titles.map((t, i) => (
              <div key={i} className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-foreground flex-1">{t.title ?? 'N/A'}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {t.character_count != null && <CharCountBadge count={t.character_count} limit={60} />}
                    {t.title && <CopyButton text={t.title} />}
                  </div>
                </div>
                {Array.isArray(t.keywords_used) && t.keywords_used.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {t.keywords_used.map((kw, ki) => (
                      <Badge key={ki} variant="outline" className="text-xs">{kw}</Badge>
                    ))}
                  </div>
                )}
                {t.rationale && <p className="text-xs text-muted-foreground">{t.rationale}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {descriptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Suggested Descriptions</h3>
          <div className="space-y-2">
            {descriptions.map((d, i) => (
              <div key={i} className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm text-foreground flex-1">{d.description ?? 'N/A'}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {d.character_count != null && <CharCountBadge count={d.character_count} limit={160} />}
                    {d.description && <CopyButton text={d.description} />}
                  </div>
                </div>
                {Array.isArray(d.keywords_used) && d.keywords_used.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {d.keywords_used.map((kw, ki) => (
                      <Badge key={ki} variant="outline" className="text-xs">{kw}</Badge>
                    ))}
                  </div>
                )}
                {d.rationale && <p className="text-xs text-muted-foreground">{d.rationale}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {notes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Optimization Notes</h3>
          <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4 space-y-2">
            {notes.map((n, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                <FiCheckCircle className="w-3.5 h-3.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                {n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
