// components/molecule-viewer.tsx
"use client"

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, AlertCircle, Loader2 } from 'lucide-react'

// Global singleton for RDKit
declare global {
  interface Window {
    RDKit?: any
  }
}

interface MoleculeViewerProps {
  cid: number
  smiles: string
  width?: number
  height?: number
}

export default function MoleculeViewer({
  cid,
  smiles,
  width = 280,
  height = 180,
}: MoleculeViewerProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load RDKit once globally
  useEffect(() => {
    if (window.RDKit) {
      setLoading(false)
      return
    }

    const loadRDKit = async () => {
      try {
        console.log('Starting RDKit load...')
        
        // Load RDKit from local public folder
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = '/rdkit/RDKit_minimal.js'
          script.async = true
          
          script.onload = () => {
            console.log('RDKit script loaded')
            resolve()
          }
          
          script.onerror = (e) => {
            console.error('Script load error:', e)
            reject(new Error('Failed to load RDKit script'))
          }
          
          document.head.appendChild(script)
        })

        // Initialize RDKit
        if (!(window as any).initRDKitModule) {
          throw new Error('initRDKitModule not found after script load')
        }

        console.log('Initializing RDKit module...')
        const RDKitModule = await (window as any).initRDKitModule({
          locateFile: (file: string) => `/rdkit/${file}`
        })

        console.log('RDKit initialized:', !!RDKitModule)
        window.RDKit = RDKitModule
        setLoading(false)
        
      } catch (err: any) {
        console.error('RDKit initialization failed:', err)
        setError(`Failed to load molecule viewer: ${err.message}`)
        setLoading(false)
      }
    }

    loadRDKit()
  }, [])

  // Render molecule
  useEffect(() => {
    if (loading || error || !window.RDKit || !smiles || !svgContainerRef.current) return

    try {
      console.log('Rendering molecule...')
      
      const mol = window.RDKit.get_mol(smiles)
      if (!mol) {
        throw new Error('Invalid SMILES string')
      }

      const svgString = mol.get_svg()
      
      // Basic validation of SVG
      if (!svgString || svgString.length < 100) {
        mol.delete()
        throw new Error('Generated SVG is invalid')
      }

      svgContainerRef.current.innerHTML = svgString

      // Scale SVG
      const svg = svgContainerRef.current.querySelector('svg')
      if (svg) {
        svg.setAttribute('width', '100%')
        svg.setAttribute('height', '100%')
        svg.style.maxWidth = '100%'
        svg.style.maxHeight = '100%'
      }

      mol.delete()
      setError(null)
      
    } catch (err: any) {
      console.error('Molecule rendering failed:', err)
      setError(`Could not render molecule: ${err.message}`)
    }
  }, [loading, error, smiles])

  const openPubChem = () => {
    window.open(`https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`, '_blank')
  }

  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-gray-500 font-mono">Molecule Structure</div>
        <button
          onClick={openPubChem}
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          title="View on PubChem"
        >
          <ExternalLink className="w-3 h-4" />
          PubChem
        </button>
      </div>

      <div
        className="border border-gray-200 rounded-lg overflow-hidden bg-white flex items-center justify-center"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div
          ref={svgContainerRef}
          className="w-full h-full flex items-center justify-center p-2"
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Initializing molecule viewer...</p>
              <p className="text-xs text-gray-500 mt-1">This may take a moment</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90">
            <div className="text-center p-4">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{error}</p>
              <p className="text-xs text-gray-500 mt-2">
                Try refreshing the page
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="text-xs text-gray-500 font-mono truncate" title={smiles}>
          SMILES: <span className="text-gray-700">{smiles.substring(0, 50)}</span>
          {smiles.length > 50 && '...'}
        </div>
      </div>
    </div>
  )
}