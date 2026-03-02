'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'
import { FiSearch, FiFileText, FiLink, FiTag, FiAlertCircle, FiRefreshCw, FiActivity } from 'react-icons/fi'

import HeaderSection from './sections/HeaderSection'
import InputSection from './sections/InputSection'
import ContentAuditTab from './sections/ContentAuditTab'
import KeywordTab from './sections/KeywordTab'
import MetaTagsTab from './sections/MetaTagsTab'
import InternalLinksTab from './sections/InternalLinksTab'
import PriorityActionsSection from './sections/PriorityActionsSection'

const MANAGER_AGENT_ID = '69a50ac5b804714191c768f9'

const AGENTS = [
  { id: '69a50ac5b804714191c768f9', name: 'SEO Audit Manager', purpose: 'Coordinates all sub-agents and aggregates findings' },
  { id: '69a50aa0c527182215353557', name: 'Content Audit Agent', purpose: 'Evaluates heading structure, readability, keyword density' },
  { id: '69a50aa02524759877284058', name: 'Keyword Research Agent', purpose: 'Discovers keyword opportunities and search trends' },
  { id: '69a50aa1252475987728405a', name: 'Meta Tag Generator', purpose: 'Generates optimized meta titles and descriptions' },
  { id: '69a50aa18074d73c14ba554f', name: 'Internal Linking Agent', purpose: 'Suggests internal linking opportunities' },
]

const SAMPLE_DATA = {
  executive_summary: 'The website shows moderate SEO health with key areas for improvement. Content structure needs refinement, keyword optimization is partially implemented, and internal linking strategy requires significant enhancement. Priority focus should be on heading hierarchy fixes and meta tag optimization.',
  overall_score: 62,
  url_audited: 'https://example.com/blog/seo-guide',
  content_audit: {
    overall_score: 65,
    summary: 'Content quality is above average but has notable gaps in heading structure and keyword optimization. The page provides good value but needs structural improvements for better search engine comprehension.',
    heading_structure: { score: 55, severity: 'warning', findings: ['Missing H1 tag on main content area', 'H3 tags used before H2 tags in sidebar', 'Multiple H1 tags detected on the page'], recommendations: ['Add a single, descriptive H1 tag', 'Restructure headings to follow proper hierarchy', 'Use H2 for main sections and H3 for subsections'] },
    content_length: { score: 78, severity: 'good', word_count: 1847, findings: ['Word count of 1,847 is above the recommended minimum of 1,500', 'Content depth is adequate for the topic'], recommendations: ['Consider expanding sections on advanced techniques', 'Add a FAQ section to boost content comprehensiveness'] },
    readability: { score: 72, severity: 'good', reading_level: 'Grade 9', findings: ['Reading level is appropriate for the target audience', 'Some paragraphs exceed 150 words'], recommendations: ['Break long paragraphs into shorter ones', 'Use more bullet points for scannable content'] },
    keyword_density: { score: 58, severity: 'warning', findings: ['Primary keyword appears 4 times (0.2% density)', 'Keyword density is below optimal range of 1-2%', 'No keyword variations found in subheadings'], recommendations: ['Increase primary keyword usage to 1-1.5%', 'Add keyword variations in H2 and H3 tags', 'Use semantic keywords throughout the content'] },
    image_alt_text: { score: 45, severity: 'critical', findings: ['3 out of 7 images missing alt text', 'Alt text on remaining images is generic', 'No keyword-optimized alt text found'], recommendations: ['Add descriptive alt text to all images', 'Include target keywords naturally in alt attributes', 'Ensure alt text describes image content accurately'] },
    content_gaps: { score: 60, severity: 'warning', findings: ['Missing section on technical SEO fundamentals', 'No mention of mobile SEO best practices', 'Competitor pages cover link building strategies'], recommendations: ['Add a section on technical SEO', 'Include mobile optimization tips', 'Cover link building basics to match competitor depth'] },
  },
  keyword_research: {
    summary: 'Analysis reveals strong opportunities in long-tail keywords with lower competition. Primary keywords face high competition but are essential for topical authority.',
    primary_keywords: [
      { keyword: 'SEO guide', search_intent: 'Informational', difficulty: 'high', relevance_score: 9, recommendation: 'Target in H1 and first paragraph. Build supporting content around this topic.' },
      { keyword: 'search engine optimization', search_intent: 'Informational', difficulty: 'high', relevance_score: 8, recommendation: 'Use as a secondary reference in the introduction and conclusion sections.' },
    ],
    secondary_keywords: [
      { keyword: 'on-page SEO', search_intent: 'Informational', difficulty: 'medium', relevance_score: 7, recommendation: 'Create a dedicated section covering on-page factors.' },
      { keyword: 'SEO best practices', search_intent: 'Informational', difficulty: 'medium', relevance_score: 7, recommendation: 'Include in subheadings and throughout the article body.' },
    ],
    long_tail_keywords: [
      { keyword: 'how to optimize content for SEO beginners', search_intent: 'Informational', difficulty: 'low', relevance_score: 8, recommendation: 'Add a beginner-focused section to capture this search query.' },
      { keyword: 'SEO content writing checklist 2024', search_intent: 'Transactional', difficulty: 'low', relevance_score: 6, recommendation: 'Create a downloadable checklist to serve this intent.' },
      { keyword: 'improve website ranking without backlinks', search_intent: 'Informational', difficulty: 'low', relevance_score: 5, recommendation: 'Address in a FAQ or tips section.' },
    ],
    optimization_strategies: ['Focus on long-tail keywords for quick wins', 'Build topical clusters around primary keywords', 'Use semantic variations naturally throughout content', 'Target featured snippet opportunities with structured answers'],
  },
  meta_tags: {
    summary: 'Current meta tags are functional but not optimized. Title is too generic and the description does not include a clear call-to-action.',
    current_meta: { title: 'SEO Guide - Our Blog', description: 'Learn about SEO in our comprehensive guide.', title_length: 24, description_length: 48 },
    suggested_titles: [
      { title: 'Complete SEO Guide 2024: Proven Strategies for Higher Rankings', character_count: 58, keywords_used: ['SEO Guide', 'Rankings'], rationale: 'Includes primary keyword, year for freshness, and benefit-driven language.' },
      { title: 'SEO Content Optimization: Step-by-Step Guide for Beginners', character_count: 56, keywords_used: ['SEO', 'Content Optimization', 'Guide'], rationale: 'Targets secondary keywords while maintaining click appeal.' },
    ],
    suggested_descriptions: [
      { description: 'Master SEO with our 2024 guide. Learn proven content optimization strategies, keyword research techniques, and on-page SEO best practices. Start ranking higher today.', character_count: 158, keywords_used: ['SEO', 'content optimization', 'keyword research'], rationale: 'Comprehensive description with CTA and multiple keywords.' },
      { description: 'Discover actionable SEO strategies to boost your website rankings. Expert tips on content optimization, meta tags, and internal linking for better search visibility.', character_count: 156, keywords_used: ['SEO strategies', 'content optimization', 'internal linking'], rationale: 'Action-oriented with diverse keyword coverage.' },
    ],
    optimization_notes: ['Keep titles under 60 characters for full SERP display', 'Include a call-to-action in meta descriptions', 'Front-load primary keywords in both title and description', 'Use power words like "proven", "complete", "actionable" for higher CTR'],
  },
  internal_linking: {
    summary: 'The page has minimal internal links and several orphan pages that could benefit from cross-linking. Implementing a hub-and-spoke model would significantly improve site architecture.',
    link_recommendations: [
      { source_page: '/blog/seo-guide', anchor_text: 'keyword research tools', target_page: '/tools/keyword-planner', rationale: 'Links to a relevant tool page, improving user journey and distributing authority.', priority: 'high' },
      { source_page: '/blog/seo-guide', anchor_text: 'technical SEO checklist', target_page: '/blog/technical-seo', rationale: 'Cross-links related content, building topical depth.', priority: 'high' },
      { source_page: '/blog/seo-guide', anchor_text: 'content marketing strategy', target_page: '/services/content-marketing', rationale: 'Connects informational content to service page for conversion.', priority: 'medium' },
    ],
    orphan_pages: [
      { page: '/blog/local-seo-tips', issue: 'No inbound internal links from any page', recommendation: 'Add contextual links from the main SEO guide and related blog posts.' },
      { page: '/resources/seo-glossary', issue: 'Only linked from footer, not contextually', recommendation: 'Add inline links to glossary terms mentioned in blog content.' },
    ],
    hub_page_strategies: [
      { topic_cluster: 'SEO Fundamentals', hub_page: '/blog/seo-guide', spoke_pages: ['/blog/on-page-seo', '/blog/technical-seo', '/blog/keyword-research-guide', '/blog/local-seo-tips'], recommendation: 'Create a comprehensive hub page linking to all spoke pages, with each spoke linking back to the hub.' },
    ],
    general_recommendations: ['Add breadcrumb navigation for improved site structure', 'Use descriptive anchor text instead of generic "click here"', 'Aim for 3-5 internal links per 1,000 words', 'Regularly audit for broken internal links'],
  },
  priority_actions: [
    { action: 'Fix image alt text on all pages', category: 'Content', impact: 'high', effort: 'low' },
    { action: 'Optimize meta title and description', category: 'Meta Tags', impact: 'high', effort: 'low' },
    { action: 'Restructure heading hierarchy', category: 'Content', impact: 'high', effort: 'medium' },
    { action: 'Add internal links to orphan pages', category: 'Internal Linking', impact: 'medium', effort: 'low' },
    { action: 'Increase primary keyword density', category: 'Keywords', impact: 'medium', effort: 'medium' },
    { action: 'Implement hub-and-spoke content model', category: 'Internal Linking', impact: 'high', effort: 'high' },
  ],
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAgentResponse(result: any): any {
  if (!result?.success) return null
  let data = result?.response?.result
  if (typeof data === 'string') {
    try { data = JSON.parse(data) } catch { return null }
  }
  if (data?.response?.result) {
    data = data.response.result
    if (typeof data === 'string') {
      try { data = JSON.parse(data) } catch { return null }
    }
  }
  if (data?.message && typeof data.message === 'string') {
    try {
      const parsed = JSON.parse(data.message)
      if (parsed.executive_summary || parsed.overall_score) { data = parsed }
    } catch { /* ignore */ }
  }
  return data
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Try again</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const TABS = [
  { id: 'content' as const, label: 'Content Audit', icon: FiFileText },
  { id: 'keywords' as const, label: 'Keywords', icon: FiSearch },
  { id: 'meta' as const, label: 'Meta Tags', icon: FiTag },
  { id: 'links' as const, label: 'Internal Links', icon: FiLink },
]

type TabId = 'content' | 'keywords' | 'meta' | 'links'

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<TabId>('content')
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [useSample, setUseSample] = useState(false)

  const handleSubmit = async (url: string, keywords: string, audience: string) => {
    setLoading(true)
    setError('')
    setData(null)
    setActiveAgentId(MANAGER_AGENT_ID)

    let message = `Perform a comprehensive SEO audit for: ${url}`
    if (keywords.trim()) message += `\n\nFocus Keywords: ${keywords}`
    if (audience) message += `\nTarget Audience: ${audience}`

    try {
      const result = await callAIAgent(message, MANAGER_AGENT_ID)
      const parsed = parseAgentResponse(result)
      if (parsed) {
        setData(parsed)
        setActiveTab('content')
      } else {
        setError('Could not parse the audit response. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }

  const handleRetry = () => {
    setError('')
    setData(null)
  }

  const displayData = useSample ? SAMPLE_DATA : data
  const hasResults = displayData !== null

  return (
    <ErrorBoundary>
      <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, hsl(160 40% 94%) 0%, hsl(180 35% 93%) 30%, hsl(160 35% 95%) 60%, hsl(140 40% 94%) 100%)' }}>
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <HeaderSection urlAudited={displayData?.url_audited} />
            </div>
            <div className="flex items-center gap-2 bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-md px-4 py-3">
              <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground whitespace-nowrap">Sample Data</Label>
              <Switch id="sample-toggle" checked={useSample} onCheckedChange={setUseSample} />
            </div>
          </div>

          <InputSection loading={loading} onSubmit={handleSubmit} />

          {loading && (
            <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-md p-8 flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Analyzing content...</p>
                <p className="text-xs text-muted-foreground mt-1">The manager agent is coordinating all sub-agents</p>
              </div>
              <div className="w-full max-w-xs bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[0.875rem] p-5 flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Audit Failed</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
              <button onClick={handleRetry} className="flex items-center gap-1 text-sm text-red-700 hover:text-red-900 font-medium">
                <FiRefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          )}

          {hasResults && !loading && (
            <>
              {(displayData?.overall_score != null || displayData?.executive_summary) && (
                <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-md p-5">
                  <div className="flex items-center gap-5">
                    {displayData?.overall_score != null && (
                      <div className="flex flex-col items-center">
                        <span className={`text-5xl font-bold ${(displayData.overall_score ?? 0) >= 70 ? 'text-emerald-600' : (displayData.overall_score ?? 0) >= 40 ? 'text-amber-600' : 'text-red-600'}`}>{displayData.overall_score}</span>
                        <span className="text-xs text-muted-foreground mt-1">Overall Score</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="font-semibold text-foreground text-sm mb-1">Executive Summary</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{displayData?.executive_summary ?? 'No summary available.'}</p>
                    </div>
                  </div>
                </div>
              )}

              <PriorityActionsSection actions={displayData?.priority_actions} />

              <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-md overflow-hidden">
                <div className="flex border-b border-border overflow-x-auto">
                  {TABS.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'}`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
                <ScrollArea className="max-h-[600px]">
                  <div className="p-5">
                    {activeTab === 'content' && <ContentAuditTab data={displayData?.content_audit} />}
                    {activeTab === 'keywords' && <KeywordTab data={displayData?.keyword_research} />}
                    {activeTab === 'meta' && <MetaTagsTab data={displayData?.meta_tags} />}
                    {activeTab === 'links' && <InternalLinksTab data={displayData?.internal_linking} />}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}

          {!hasResults && !loading && !error && (
            <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-md p-10 text-center">
              <FiSearch className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Ready to Optimize</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">Enter a website URL above and click &quot;Run SEO Audit&quot; to get a comprehensive analysis of your content, keywords, meta tags, and internal linking strategy.</p>
            </div>
          )}

          <div className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <FiActivity className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Agent Status</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {AGENTS.map((agent) => (
                <div key={agent.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${activeAgentId === agent.id ? 'bg-amber-500 animate-pulse' : activeAgentId ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{agent.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{agent.purpose}</p>
                  </div>
                  {agent.id === MANAGER_AGENT_ID && <Badge variant="outline" className="text-[10px] ml-auto flex-shrink-0">Primary</Badge>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
