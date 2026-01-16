"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Copy, Check, BarChart3 } from 'lucide-react'
import MoleculeViewer from './molecule-viewer'
import { Chemical } from '@/lib/odor-index'

interface ChemicalCardProps {
  chemical: Chemical
}

export default function ChemicalCard({ chemical }: ChemicalCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openPubChem = () => {
    window.open(`https://pubchem.ncbi.nlm.nih.gov/compound/${chemical.cid}`, '_blank')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
              CID_{chemical.cid}
            </span>
            <button
              onClick={openPubChem}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Open in PubChem"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <h3 className="font-bold text-gray-900 text-lg">{chemical.name}</h3>
        </div>
        
        <button
          onClick={() => copyToClipboard(chemical.smiles)}
          className="text-gray-400 hover:text-gray-700 transition-colors"
          title="Copy SMILES"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Molecule Visualization */}
      <div className="mb-4">
        <MoleculeViewer
          cid={chemical.cid}
          smiles={chemical.smiles} 
          width={280}
          height={180}
        />
      </div>

      {/* Descriptors */}
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
    </div>
  )
}