'use client'

import { FiGlobe, FiExternalLink } from 'react-icons/fi'

interface HeaderSectionProps {
  urlAudited?: string
}

export default function HeaderSection({ urlAudited }: HeaderSectionProps) {
  return (
    <header className="bg-white/80 backdrop-blur-[20px] border border-white/[0.22] rounded-2xl shadow-sm px-6 py-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <FiGlobe className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">
            SEO Content Optimizer
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Comprehensive SEO audit powered by AI agents
          </p>
        </div>
        {urlAudited && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 max-w-xs">
            <FiExternalLink className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs text-emerald-700 truncate font-medium">{urlAudited}</span>
          </div>
        )}
      </div>
    </header>
  )
}
