// components/batched-chemical-viewer.tsx
"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { ExternalLink, Copy, Check, BarChart3 } from 'lucide-react'
import Link from 'next/link'

// Global RDKit loader with safe cleanup
const loadRDKit = (): Promise<any> => {
  if ((window as any).RDKit) return Promise.resolve((window as any).RDKit)
  
  return new Promise(async (resolve, reject) => {
    try {
      const script = document.createElement('script')
      script.src = '/rdkit/RDKit_minimal.js'
      script.async = true
      script.id = 'rdkit-script'
      
      script.onload = async () => {
        try {
          const RDKitModule = await (window as any).initRDKitModule({
            locateFile: (file: string) => `/rdkit/${file}`
          })
          ;(window as any).RDKit = RDKitModule
          resolve(RDKitModule)
        } catch (err) {
          reject(err)
        }
      }
      
      script.onerror = reject
      document.head.appendChild(script)
    } catch (err) {
      reject(err)
    }
  })
}

interface Chemical {
  cid: number
  name: string
  smiles: string
  descriptors: string[]
  sources: string[]
}

interface ChemicalCardProps {
  chemical: Chemical
  priority?: boolean
  showDetails?: boolean
}

export function ChemicalCard({ chemical, priority = false, showDetails = true }: ChemicalCardProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const [rendered, setRendered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [svgContent, setSvgContent] = useState<string>('')
  const [copied, setCopied] = useState(false)

  // Safe cleanup function
  const cleanupSVG = useCallback(() => {
    if (svgContainerRef.current) {
      // SAFE METHOD: Use textContent instead of innerHTML to avoid DOM conflicts
      svgContainerRef.current.textContent = ''
    }
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderMolecule = useCallback(async () => {
    if (rendered || loading) return
    
    setLoading(true)
    try {
      const RDKit = await loadRDKit()
      const mol = RDKit.get_mol(chemical.smiles)
      
      if (!mol) {
        throw new Error('Failed to parse molecule')
      }
      
      const svg = mol.get_svg()
      
      // Clean up previous content safely
      cleanupSVG()
      
      // Set SVG content for display
      setSvgContent(svg)
      
      // Scale SVG safely
      setTimeout(() => {
        if (svgContainerRef.current) {
          const svgEl = svgContainerRef.current.querySelector('svg')
          if (svgEl) {
            svgEl.setAttribute('width', '100%')
            svgEl.setAttribute('height', '100%')
            svgEl.style.maxWidth = '100%'
            svgEl.style.maxHeight = '100%'
          }
        }
      }, 10)
      
      mol.delete()
      setRendered(true)
    } catch (err) {
      console.error('Failed to render molecule', err)
      cleanupSVG()
    } finally {
      setLoading(false)
    }
  }, [rendered, loading, chemical.smiles, cleanupSVG])

  // Priority rendering for first few items
  useEffect(() => {
    if (priority) {
      const timer = setTimeout(() => {
        renderMolecule()
      }, Math.random() * 300)
      return () => clearTimeout(timer)
    }
  }, [priority, renderMolecule])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupSVG()
    }
  }, [cleanupSVG])

  const openPubChem = () => {
    window.open(`https://pubchem.ncbi.nlm.nih.gov/compound/${chemical.cid}`, '_blank')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
      {/* Header - Same as original ChemicalCard */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded flex-shrink-0">
              CID_{chemical.cid}
            </span>
            <button
              onClick={openPubChem}
              className="text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
              title="Open in PubChem"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <h3 className="font-bold text-gray-900 text-lg truncate" title={chemical.name}>
            {chemical.name}
          </h3>
        </div>
        
        <button
          onClick={() => copyToClipboard(chemical.smiles)}
          className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0 ml-2"
          title="Copy SMILES"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Molecule Visualization Area */}
      <div className="mb-4">
        {!rendered ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
            style={{ height: '180px' }}
            onClick={renderMolecule}
          >
            {loading ? (
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Rendering molecule...</p>
              </div>
            ) : (
              <div className="text-center p-4">
                <div className="text-gray-400 mb-2">Click to render molecule</div>
                <div className="text-xs text-gray-500 font-mono">
                  {chemical.smiles.substring(0, 40)}...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div 
            ref={svgContainerRef}
            className="border border-gray-200 rounded-lg overflow-hidden"
            style={{ height: '180px' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>

      {/* Descriptors - Same as original */}
      {showDetails && (
        <>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Odor Profile</span>
              <span className="text-xs text-gray-500">({chemical.descriptors.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {chemical.descriptors.slice(0, 6).map((desc, idx) => (
                <span
                  key={`${chemical.cid}-${desc}-${idx}`}
                  className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                  title={desc}
                >
                  {desc}
                </span>
              ))}
              {chemical.descriptors.length > 6 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{chemical.descriptors.length - 6} more
                </span>
              )}
            </div>
          </div>

          {/* Sources */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1">Data Sources</div>
            <div className="flex flex-wrap gap-1">
              {chemical.sources.slice(0, 3).map(source => (
                <span
                  key={source}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
                >
                  {source}
                </span>
              ))}
              {chemical.sources.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{chemical.sources.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* View Details Button */}
          <Link
            href={`/chemical/${chemical.cid}`}
            className="block w-full text-center border border-gray-300 text-gray-700 hover:border-black hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            View Details
          </Link>
        </>
      )}
    </div>
  )
}

// Main component for displaying search results
interface BatchedChemicalViewerProps {
  chemicals: Chemical[]
  itemsPerPage?: number
  showDetails?: boolean
  gridColumns?: {
    base?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export default function BatchedChemicalViewer({ 
  chemicals, 
  itemsPerPage = 24,
  showDetails = true,
  gridColumns = {
    base: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 3
  }
}: BatchedChemicalViewerProps) {
  const [visibleCount, setVisibleCount] = useState(Math.min(itemsPerPage, chemicals.length))

  // Load RDKit in background
  useEffect(() => {
    loadRDKit().catch(console.error)
  }, [])

  const visibleChemicals = useMemo(() => {
    return chemicals.slice(0, visibleCount)
  }, [chemicals, visibleCount])

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + itemsPerPage, chemicals.length))
  }

  // Generate grid class
  const gridClass = `grid grid-cols-${gridColumns.base || 1} ${
    gridColumns.sm ? `sm:grid-cols-${gridColumns.sm}` : ''
  } ${gridColumns.md ? `md:grid-cols-${gridColumns.md}` : ''} ${
    gridColumns.lg ? `lg:grid-cols-${gridColumns.lg}` : ''
  } ${gridColumns.xl ? `xl:grid-cols-${gridColumns.xl}` : ''} gap-6`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{visibleChemicals.length}</span> of{' '}
          <span className="font-semibold">{chemicals.length}</span> chemicals
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadMore}
            disabled={visibleCount >= chemicals.length}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Load {Math.min(itemsPerPage, chemicals.length - visibleCount)} More
          </button>
          {visibleCount > itemsPerPage && (
            <button
              onClick={() => setVisibleCount(itemsPerPage)}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Show Less
            </button>
          )}
        </div>
      </div>

      <div className={gridClass}>
        {visibleChemicals.map((chemical, index) => (
          <ChemicalCard
            key={chemical.cid}
            chemical={chemical}
            priority={index < 6} // Auto-render first 6
            showDetails={showDetails}
          />
        ))}
      </div>

      {visibleCount < chemicals.length && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Load {Math.min(itemsPerPage, chemicals.length - visibleCount)} More Chemicals
            <div className="text-sm font-normal mt-1 opacity-75">
              Currently showing {visibleCount} of {chemicals.length}
            </div>
          </button>
        </div>
      )}
    </div>
  )
}