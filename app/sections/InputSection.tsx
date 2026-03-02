'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FiSearch, FiTarget, FiUsers } from 'react-icons/fi'
import { Loader2 } from 'lucide-react'

interface InputSectionProps {
  loading: boolean
  onSubmit: (url: string, keywords: string, audience: string) => void
}

export default function InputSection({ loading, onSubmit }: InputSectionProps) {
  const [url, setUrl] = useState('')
  const [keywords, setKeywords] = useState('')
  const [audience, setAudience] = useState('')
  const [urlError, setUrlError] = useState('')

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setUrlError('URL is required')
      return false
    }
    try {
      new URL(value.startsWith('http') ? value : `https://${value}`)
      setUrlError('')
      return true
    } catch {
      setUrlError('Please enter a valid URL')
      return false
    }
  }

  const handleSubmit = () => {
    if (validateUrl(url)) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`
      onSubmit(fullUrl, keywords, audience)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && url.trim()) {
      handleSubmit()
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm">
      {/* URL Input Row */}
      <div className="p-5 pb-4">
        <Label htmlFor="url" className="text-sm font-semibold text-foreground mb-2 block">
          Website URL
        </Label>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <FiSearch className="w-4 h-4" />
            </div>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/page-to-audit"
              value={url}
              onChange={(e) => { setUrl(e.target.value); if (urlError) validateUrl(e.target.value) }}
              onKeyDown={handleKeyDown}
              className={`pl-10 h-11 text-sm bg-white/60 ${urlError ? 'border-destructive focus-visible:ring-destructive' : 'border-border'}`}
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading || !url.trim()}
            className="h-11 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-md shadow-emerald-500/20 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FiSearch className="mr-2 h-4 w-4" />
                Run SEO Audit
              </>
            )}
          </Button>
        </div>
        {urlError && <p className="text-xs text-destructive mt-1.5">{urlError}</p>}
      </div>

      {/* Optional Fields Row */}
      <div className="border-t border-border/50 px-5 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="keywords" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <FiTarget className="w-3 h-3" />
              Focus Keywords (optional)
            </Label>
            <Input
              id="keywords"
              placeholder="seo, content optimization, keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={loading}
              className="h-9 text-sm bg-white/60"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <FiUsers className="w-3 h-3" />
              Target Audience (optional)
            </Label>
            <Select value={audience} onValueChange={setAudience} disabled={loading}>
              <SelectTrigger className="h-9 text-sm bg-white/60">
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="b2b">B2B</SelectItem>
                <SelectItem value="b2c">B2C</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="non-technical">Non-Technical</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
