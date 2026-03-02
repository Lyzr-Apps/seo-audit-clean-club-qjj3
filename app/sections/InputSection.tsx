'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FiSearch } from 'react-icons/fi'
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

  return (
    <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-md p-6 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="url" className="text-sm font-medium text-foreground">Website URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com/page"
          value={url}
          onChange={(e) => { setUrl(e.target.value); if (urlError) validateUrl(e.target.value); }}
          className={urlError ? 'border-destructive' : ''}
          disabled={loading}
        />
        {urlError && <p className="text-xs text-destructive">{urlError}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-sm font-medium text-foreground">Focus Keywords (optional)</Label>
          <Input
            id="keywords"
            placeholder="seo, content optimization, keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">Comma-separated keywords</p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Target Audience (optional)</Label>
          <Select value={audience} onValueChange={setAudience} disabled={loading}>
            <SelectTrigger>
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
      <Button
        onClick={handleSubmit}
        disabled={loading || !url.trim()}
        className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
        size="lg"
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
  )
}
