'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FiCopy, FiCheck, FiCheckCircle, FiTag } from 'react-icons/fi'

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
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2.5 text-xs rounded-lg">
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
    <Badge className={`text-[10px] font-semibold ${ok ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100'}`}>
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
    <div className="space-y-7">
      {data.summary && (
        <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-5">
          <p className="text-sm text-foreground leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.current_meta && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FiTag className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">Current Meta Tags</h3>
          </div>
          <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Title</span>
                {data.current_meta.title_length != null && <CharCountBadge count={data.current_meta.title_length} limit={60} />}
              </div>
              <p className="text-sm text-foreground bg-muted/40 rounded-xl px-4 py-2.5 font-medium">{data.current_meta.title ?? 'N/A'}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Description</span>
                {data.current_meta.description_length != null && <CharCountBadge count={data.current_meta.description_length} limit={160} />}
              </div>
              <p className="text-sm text-foreground bg-muted/40 rounded-xl px-4 py-2.5">{data.current_meta.description ?? 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {titles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">Suggested Titles</h3>
          <div className="space-y-2.5">
            {titles.map((t, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-semibold text-foreground flex-1 leading-relaxed">{t.title ?? 'N/A'}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {t.character_count != null && <CharCountBadge count={t.character_count} limit={60} />}
                    {t.title && <CopyButton text={t.title} />}
                  </div>
                </div>
                {Array.isArray(t.keywords_used) && t.keywords_used.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {t.keywords_used.map((kw, ki) => (
                      <Badge key={ki} variant="outline" className="text-[10px] font-medium">{kw}</Badge>
                    ))}
                  </div>
                )}
                {t.rationale && <p className="text-xs text-muted-foreground leading-relaxed">{t.rationale}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {descriptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">Suggested Descriptions</h3>
          <div className="space-y-2.5">
            {descriptions.map((d, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm text-foreground flex-1 leading-relaxed">{d.description ?? 'N/A'}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {d.character_count != null && <CharCountBadge count={d.character_count} limit={160} />}
                    {d.description && <CopyButton text={d.description} />}
                  </div>
                </div>
                {Array.isArray(d.keywords_used) && d.keywords_used.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {d.keywords_used.map((kw, ki) => (
                      <Badge key={ki} variant="outline" className="text-[10px] font-medium">{kw}</Badge>
                    ))}
                  </div>
                )}
                {d.rationale && <p className="text-xs text-muted-foreground leading-relaxed">{d.rationale}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {notes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">Optimization Notes</h3>
          <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-5 space-y-3">
            {notes.map((n, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed">
                <FiCheckCircle className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                {n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
