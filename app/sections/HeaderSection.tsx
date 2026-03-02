'use client'

import { FiGlobe } from 'react-icons/fi'

interface HeaderSectionProps {
  urlAudited?: string
}

export default function HeaderSection({ urlAudited }: HeaderSectionProps) {
  return (
    <header className="bg-white/75 backdrop-blur-[16px] border border-white/[0.18] rounded-[0.875rem] shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <FiGlobe className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.01em] text-foreground font-sans">SEO Content Optimizer</h1>
          {urlAudited && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{urlAudited}</p>
          )}
        </div>
      </div>
    </header>
  )
}
