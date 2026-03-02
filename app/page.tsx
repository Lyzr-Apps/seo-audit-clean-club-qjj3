'use client'

import React, { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'
import { FiSearch, FiFileText, FiLink, FiTag, FiAlertCircle, FiRefreshCw, FiActivity, FiCode } from 'react-icons/fi'

import HeaderSection from './sections/HeaderSection'
import InputSection from './sections/InputSection'
import ContentAuditTab from './sections/ContentAuditTab'
import KeywordTab from './sections/KeywordTab'
import MetaTagsTab from './sections/MetaTagsTab'
import InternalLinksTab from './sections/InternalLinksTab'
import PriorityActionsSection from './sections/PriorityActionsSection'
import LighthouseTab from './sections/LighthouseTab'
import DeveloperToolsTab from './sections/DeveloperToolsTab'

const MANAGER_AGENT_ID = '69a50ac5b804714191c768f9'

const AGENTS = [
  { id: '69a50ac5b804714191c768f9', name: 'SEO Audit Manager', purpose: 'Coordinates all sub-agents and aggregates findings' },
  { id: '69a50aa0c527182215353557', name: 'Content Audit Agent', purpose: 'Evaluates heading structure, readability, keyword density' },
  { id: '69a50aa02524759877284058', name: 'Keyword Research Agent', purpose: 'Discovers keyword opportunities and search trends' },
  { id: '69a50aa1252475987728405a', name: 'Meta Tag Generator', purpose: 'Generates optimized meta titles and descriptions' },
  { id: '69a50aa18074d73c14ba554f', name: 'Internal Linking Agent', purpose: 'Suggests internal linking opportunities' },
  { id: '69a50f53227dc30e21e15eeb', name: 'Lighthouse Performance Agent', purpose: 'Core Web Vitals, accessibility, best practices, PWA analysis' },
  { id: '69a50f536f8bdb5f8163f9ad', name: 'Developer SEO Agent', purpose: 'Schema markup, robots.txt, security headers, technical SEO' },
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
  lighthouse: {
    summary: 'The website demonstrates moderate performance with room for improvement in Core Web Vitals. Accessibility needs attention with several WCAG violations. Best practices score is strong.',
    performance: {
      score: 68,
      metrics: {
        fcp: { value: '1.8s', score: 72, status: 'needs-improvement' },
        lcp: { value: '3.2s', score: 45, status: 'poor' },
        tbt: { value: '180ms', score: 78, status: 'needs-improvement' },
        cls: { value: '0.08', score: 85, status: 'good' },
        inp: { value: '210ms', score: 65, status: 'needs-improvement' },
        ttfb: { value: '0.6s', score: 70, status: 'needs-improvement' },
        speed_index: { value: '2.4s', score: 72, status: 'needs-improvement' },
      },
      opportunities: [
        { title: 'Serve images in next-gen formats', description: 'Image formats like WebP and AVIF often provide better compression than PNG or JPEG.', savings: '~420 KB', priority: 'high' },
        { title: 'Eliminate render-blocking resources', description: '2 CSS files and 3 JavaScript files are blocking the first paint of your page.', savings: '~1.2s', priority: 'high' },
        { title: 'Reduce unused JavaScript', description: 'Reduce unused JavaScript and defer loading scripts until needed.', savings: '~180 KB', priority: 'medium' },
        { title: 'Enable text compression', description: 'Text-based resources should be served with compression (gzip, brotli).', savings: '~90 KB', priority: 'medium' },
      ],
      diagnostics: [
        { title: 'DOM Size', description: 'A large DOM will increase memory usage and produce costly layout reflows.', value: '1,847 elements' },
        { title: 'JavaScript execution time', description: 'Consider reducing the time spent parsing, compiling, and executing JS.', value: '2.1s' },
        { title: 'Critical request chains', description: 'Chains with depth 4 found, potentially delaying above-the-fold content.', value: 'Depth: 4' },
      ],
    },
    accessibility: {
      score: 72,
      issues: [
        { title: 'Image elements do not have [alt] attributes', description: '3 image elements found without alt attributes.', severity: 'critical', elements_affected: 3 },
        { title: 'Background and foreground colors lack contrast ratio', description: 'Low-contrast text found on 5 elements.', severity: 'warning', elements_affected: 5 },
        { title: 'Form elements do not have associated labels', description: '2 form inputs missing associated label elements.', severity: 'critical', elements_affected: 2 },
        { title: 'Links do not have discernible names', description: '1 link element found without accessible text.', severity: 'warning', elements_affected: 1 },
      ],
      passed_audits: ['Document has a valid lang attribute', 'Meta viewport allows zoom', 'Heading elements appear in sequentially-descending order', 'ARIA attributes are used correctly', 'Tab order follows DOM order'],
    },
    best_practices: {
      score: 85,
      issues: [
        { title: 'Uses deprecated APIs', description: 'The page uses document.write() which can delay page rendering.', severity: 'warning' },
        { title: 'Browser errors logged to console', description: '3 JavaScript errors detected in browser console.', severity: 'warning' },
      ],
      passed_audits: ['Uses HTTPS', 'No detected JavaScript libraries with known vulnerabilities', 'Page has the HTML doctype', 'Allows paste in password fields', 'Displays images with correct aspect ratios'],
    },
    seo_technical: {
      score: 78,
      issues: [
        { title: 'Document does not have a meta description', description: 'Meta descriptions can be included in search results to summarize page content.', severity: 'warning' },
        { title: 'Links are not crawlable', description: '2 links use JavaScript URLs that search engines cannot follow.', severity: 'critical' },
      ],
      passed_audits: ['Document has a valid title', 'Has a viewport meta tag', 'Document uses legible font sizes', 'Tap targets are sized appropriately', 'robots.txt is valid'],
    },
    pwa: {
      score: 32,
      checks: [
        { title: 'Registers a service worker', status: 'fail', description: 'No service worker registration detected.' },
        { title: 'Web app manifest', status: 'fail', description: 'No manifest.json or manifest.webmanifest found.' },
        { title: 'Redirects HTTP to HTTPS', status: 'pass', description: 'HTTP traffic is properly redirected to HTTPS.' },
        { title: 'Sets a theme-color meta tag', status: 'fail', description: 'No theme-color meta tag found.' },
        { title: 'Content sized correctly for viewport', status: 'pass', description: 'Content width matches viewport width.' },
      ],
    },
    resource_summary: {
      total_requests: 47,
      total_size: '2.4 MB',
      scripts: { count: 12, size: '890 KB' },
      stylesheets: { count: 5, size: '220 KB' },
      images: { count: 18, size: '1.1 MB' },
      fonts: { count: 4, size: '160 KB' },
      third_party: { count: 8, size: '340 KB' },
    },
  },
  developer_seo: {
    summary: 'Technical SEO implementation has several gaps. Schema markup is incomplete, security headers need enhancement, and social meta tags are partially configured. robots.txt and sitemap are properly set up.',
    schema_markup: {
      status: 'warning',
      existing_schemas: [
        { type: 'Organization', format: 'JSON-LD', valid: true, issues: [] },
        { type: 'WebPage', format: 'JSON-LD', valid: false, issues: ['Missing required property: datePublished', 'Missing recommended property: author'] },
      ],
      recommended_schemas: [
        { type: 'Article', reason: 'Blog content should use Article schema for rich search results', code_snippet: '{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Your Article Title",\n  "author": {\n    "@type": "Person",\n    "name": "Author Name"\n  },\n  "datePublished": "2024-01-15",\n  "image": "https://example.com/image.jpg"\n}' },
        { type: 'BreadcrumbList', reason: 'Enables breadcrumb rich results in Google Search', code_snippet: '{\n  "@context": "https://schema.org",\n  "@type": "BreadcrumbList",\n  "itemListElement": [{\n    "@type": "ListItem",\n    "position": 1,\n    "name": "Home",\n    "item": "https://example.com"\n  }]\n}' },
        { type: 'FAQ', reason: 'FAQ sections can trigger FAQ rich results with expandable answers', code_snippet: '{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [{\n    "@type": "Question",\n    "name": "What is SEO?",\n    "acceptedAnswer": {\n      "@type": "Answer",\n      "text": "SEO stands for..."\n    }\n  }]\n}' },
      ],
      rich_result_eligible: ['Article', 'Breadcrumb', 'FAQ', 'Sitelinks Search Box'],
    },
    robots_txt: {
      status: 'pass',
      findings: ['robots.txt found at /robots.txt', 'Sitemap reference included', 'User-agent directives properly formatted'],
      issues: [],
      recommendations: ['Consider adding Crawl-delay directive for aggressive bots', 'Add specific disallow rules for admin/login pages'],
    },
    sitemap: {
      status: 'pass',
      url: 'https://example.com/sitemap.xml',
      findings: ['Sitemap found and accessible', '156 URLs indexed', 'lastmod dates present on all entries'],
      issues: ['changefreq attribute is deprecated by Google', '3 URLs return 404 status codes'],
      recommendations: ['Remove 404 URLs from sitemap', 'Remove changefreq as it is ignored by Google', 'Add image sitemap entries for visual content'],
    },
    canonical_tags: {
      status: 'warning',
      findings: ['Canonical tag present on main page', 'Self-referencing canonical detected'],
      issues: ['3 pages missing canonical tags', 'Canonical points to HTTP instead of HTTPS on 2 pages'],
      recommendations: ['Add canonical tags to all pages', 'Ensure all canonicals use HTTPS URLs', 'Fix non-self-referencing canonical inconsistencies'],
    },
    hreflang: {
      status: 'warning',
      findings: ['No hreflang tags detected on any pages'],
      issues: ['International versions of the site exist but have no hreflang configuration'],
      recommendations: ['Add hreflang tags for each language version', 'Include x-default tag for fallback', 'Ensure return tags are present on all referenced pages'],
    },
    open_graph: {
      status: 'warning',
      tags_found: [
        { property: 'og:title', content: 'SEO Guide - Our Blog', valid: true },
        { property: 'og:type', content: 'article', valid: true },
        { property: 'og:url', content: 'https://example.com/blog/seo-guide', valid: true },
      ],
      missing_tags: ['og:description', 'og:image', 'og:site_name', 'og:locale'],
      recommendations: ['Add og:description matching meta description', 'Add og:image with 1200x630px dimensions', 'Add og:site_name for brand consistency'],
    },
    twitter_cards: {
      status: 'fail',
      tags_found: [
        { property: 'twitter:card', content: 'summary', valid: true },
      ],
      missing_tags: ['twitter:title', 'twitter:description', 'twitter:image', 'twitter:site'],
      recommendations: ['Upgrade to twitter:card summary_large_image for better visibility', 'Add all required Twitter Card meta tags', 'Validate with Twitter Card Validator tool'],
    },
    security_headers: {
      status: 'warning',
      headers: [
        { name: 'Strict-Transport-Security', present: true, value: 'max-age=31536000; includeSubDomains', recommendation: 'Consider adding preload directive' },
        { name: 'Content-Security-Policy', present: false, value: '', recommendation: 'Add CSP header to prevent XSS attacks' },
        { name: 'X-Content-Type-Options', present: true, value: 'nosniff', recommendation: 'Properly configured' },
        { name: 'X-Frame-Options', present: true, value: 'SAMEORIGIN', recommendation: 'Properly configured' },
        { name: 'Referrer-Policy', present: false, value: '', recommendation: 'Add strict-origin-when-cross-origin policy' },
        { name: 'Permissions-Policy', present: false, value: '', recommendation: 'Add to restrict browser feature access' },
      ],
      score: 50,
    },
    mobile_friendliness: {
      status: 'pass',
      findings: ['Viewport meta tag properly configured', 'Content sized correctly for viewport', 'Font sizes are legible'],
      issues: ['2 tap targets are too small (below 48x48px)', 'Horizontal scrolling detected on small screens'],
      recommendations: ['Increase tap target sizes to minimum 48x48px', 'Fix horizontal overflow on mobile viewports', 'Test with Chrome DevTools device emulation'],
    },
    js_rendering: {
      status: 'warning',
      rendering_type: 'CSR',
      findings: ['Page uses client-side rendering (React SPA)', 'Initial HTML contains minimal content', 'Full content requires JavaScript execution'],
      issues: ['Search engines may not fully render JavaScript content', 'Time to meaningful content depends on JS bundle loading'],
      recommendations: ['Implement Server-Side Rendering (SSR) or Static Site Generation (SSG)', 'Use dynamic rendering for search engine bots', 'Add pre-rendering for critical pages', 'Ensure meta tags are server-rendered'],
    },
    page_speed_technical: {
      status: 'warning',
      findings: [
        { factor: 'HTTP/2', status: 'pass', detail: 'HTTP/2 protocol detected' },
        { factor: 'Compression', status: 'warning', detail: 'Gzip enabled but Brotli not configured' },
        { factor: 'Image Format', status: 'fail', detail: '12 images use JPEG/PNG instead of WebP/AVIF' },
        { factor: 'CSS Minification', status: 'pass', detail: 'All CSS files are minified' },
        { factor: 'JS Minification', status: 'pass', detail: 'All JavaScript files are minified' },
        { factor: 'Critical CSS', status: 'fail', detail: 'No critical CSS inlining detected' },
        { factor: 'Preload Hints', status: 'warning', detail: 'Only 1 preload hint found, LCP image not preloaded' },
        { factor: 'CDN', status: 'pass', detail: 'CloudFlare CDN detected' },
      ],
      recommendations: ['Enable Brotli compression for better savings', 'Convert images to WebP/AVIF format', 'Inline critical CSS for above-the-fold content', 'Add preload hints for LCP image and critical fonts'],
    },
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
  { id: 'lighthouse' as const, label: 'Lighthouse', icon: FiActivity },
  { id: 'developer' as const, label: 'Developer', icon: FiCode },
]

type TabId = 'content' | 'keywords' | 'meta' | 'links' | 'lighthouse' | 'developer'

function ScoreGauge({ score }: { score: number }) {
  const safeScore = score ?? 0
  const radius = 54
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const progress = (safeScore / 100) * circumference
  const offset = circumference - progress
  const color = safeScore >= 70 ? '#059669' : safeScore >= 40 ? '#d97706' : '#dc2626'
  const bgColor = safeScore >= 70 ? '#d1fae5' : safeScore >= 40 ? '#fef3c7' : '#fee2e2'

  return (
    <div className="relative flex-shrink-0">
      <svg width="140" height="140" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
        <circle cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 64 64)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>{safeScore}</span>
        <span className="text-[11px] text-muted-foreground font-medium mt-0.5">out of 100</span>
      </div>
    </div>
  )
}

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

          {/* Header Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <HeaderSection urlAudited={displayData?.url_audited} />
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm px-5 py-3">
              <Label htmlFor="sample-toggle" className="text-xs font-medium text-muted-foreground whitespace-nowrap select-none cursor-pointer">Sample Data</Label>
              <Switch id="sample-toggle" checked={useSample} onCheckedChange={setUseSample} />
            </div>
          </div>

          {/* Input Section */}
          <InputSection loading={loading} onSubmit={handleSubmit} />

          {/* Loading State */}
          {loading && (
            <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-10 flex flex-col items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-primary animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Running SEO Audit...</p>
                <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">The manager agent is coordinating all sub-agents to analyze your website</p>
              </div>
              <div className="w-full max-w-xs bg-muted/50 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full animate-pulse" style={{ width: '65%' }} />
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white/80 backdrop-blur-[20px] border border-red-200/60 rounded-2xl shadow-sm p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <FiAlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-red-800">Audit Failed</p>
                <p className="text-sm text-red-600 mt-1 leading-relaxed">{error}</p>
              </div>
              <button onClick={handleRetry} className="flex items-center gap-1.5 text-sm text-red-700 hover:text-red-900 font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
                <FiRefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          )}

          {/* Results */}
          {hasResults && !loading && (
            <>
              {/* Executive Summary + Score */}
              {(displayData?.overall_score != null || displayData?.executive_summary) && (
                <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                    {displayData?.overall_score != null && (
                      <ScoreGauge score={displayData.overall_score} />
                    )}
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="font-bold text-foreground text-lg mb-2">Executive Summary</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">{displayData?.executive_summary ?? 'No summary available.'}</p>
                      {displayData?.url_audited && (
                        <p className="text-xs text-muted-foreground/70 mt-3 font-mono">{displayData.url_audited}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Priority Actions */}
              <PriorityActionsSection actions={displayData?.priority_actions} />

              {/* Tab Navigation + Content */}
              <div className="space-y-3">
                {/* Tab Bar */}
                <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-2">
                  <div className="flex gap-1 overflow-x-auto scrollbar-none">
                    {TABS.map((tab) => {
                      const Icon = tab.icon
                      const isActive = activeTab === tab.id
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-xl transition-all duration-200 ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm overflow-hidden">
                  <ScrollArea className="max-h-[640px]">
                    <div className="p-5 sm:p-6">
                      {activeTab === 'content' && <ContentAuditTab data={displayData?.content_audit} />}
                      {activeTab === 'keywords' && <KeywordTab data={displayData?.keyword_research} />}
                      {activeTab === 'meta' && <MetaTagsTab data={displayData?.meta_tags} />}
                      {activeTab === 'links' && <InternalLinksTab data={displayData?.internal_linking} />}
                      {activeTab === 'lighthouse' && <LighthouseTab data={displayData?.lighthouse} />}
                      {activeTab === 'developer' && <DeveloperToolsTab data={displayData?.developer_seo} />}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!hasResults && !loading && !error && (
            <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-7 h-7 text-primary/60" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">Ready to Optimize</h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">Enter a website URL above and click &quot;Run SEO Audit&quot; to get a comprehensive analysis of your content, keywords, meta tags, and internal linking strategy.</p>
            </div>
          )}

          {/* Agent Status */}
          <div className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-muted/60 flex items-center justify-center">
                <FiActivity className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agent Network</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {AGENTS.map((agent) => {
                const isManager = agent.id === MANAGER_AGENT_ID
                const isActive = activeAgentId === agent.id
                return (
                  <div
                    key={agent.id}
                    className={`relative flex items-start gap-2.5 px-3.5 py-3 rounded-xl transition-all duration-200 ${isManager ? 'bg-primary/[0.06] border border-primary/[0.12]' : 'bg-muted/30 border border-transparent hover:border-muted/60'}`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5 ${isActive ? 'bg-amber-500 animate-pulse shadow-sm shadow-amber-500/40' : activeAgentId ? 'bg-emerald-500' : 'bg-muted-foreground/25'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-foreground truncate">{agent.name}</p>
                        {isManager && (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-primary/30 text-primary font-semibold flex-shrink-0">Manager</Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{agent.purpose}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </ErrorBoundary>
  )
}
