"use client"

import { useParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Copy, Check, BarChart3, Database, Tag } from "lucide-react"
import MoleculeViewer from "@/components/molecule-viewer"
import { getChemicalByCID, Chemical } from "@/lib/odor-index"

function ChemicalDetailPage() {
  const params = useParams()
  const [chemical, setChemical] = useState<Chemical | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  const cid = parseInt(params.cid as string)

  useEffect(() => {
    const found = getChemicalByCID(cid)
    if (found) {
      setChemical(found)
    } else {
      setChemical(null)
    }
    setLoading(false)
  }, [cid])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openPubChem = () => {
    window.open(`https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading chemical data...</p>
        </div>
      </div>
    )
  }

  if (!chemical) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200 px-8 py-6">
          <Link href="/" className="font-bold text-xl text-gray-900">
            OpenSmell
          </Link>
        </header>
        <main className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Chemical not found</h1>
            <p className="text-gray-600 mb-6">CID_{cid} doesn't exist in our database.</p>
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to search
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-700 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="font-semibold">Back to Search</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="font-bold text-xl text-gray-900"
              >
                OpenSmell
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Chemical Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Molecule & Basic Info */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-lg bg-blue-50 text-blue-700 px-3 py-1.5 rounded">
                      CID_{chemical.cid}
                    </span>
                    <button
                      onClick={openPubChem}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      title="Open in PubChem"
                    >
                      <ExternalLink className="w-4 h-4" />
                      PubChem
                    </button>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{chemical.name}</h1>
                </div>
                <button
                  onClick={() => copyToClipboard(chemical.smiles)}
                  className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                  title="Copy SMILES"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy SMILES</span>
                    </>
                  )}
                </button>
              </div>

              {/* Large Molecule Viewer */}
              <div className="mb-6">
                <MoleculeViewer
                  cid={chemical.cid}
                  smiles={chemical.smiles} 
                  width={600}
                  height={300}
                />
              </div>

              {/* SMILES String */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  SMILES String
                </div>
                <div className="font-mono text-sm bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                  {chemical.smiles}
                </div>
              </div>
            </div>

            {/* Descriptors */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900">Odor Profile</h2>
                <span className="text-gray-500">({chemical.descriptors.length} descriptors)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {chemical.descriptors.map((desc, idx) => (
                  <span
                    key={idx}
                    className="text-base bg-gray-50 text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    {desc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Metadata */}
          <div className="lg:col-span-1">
            {/* Data Sources */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-gray-400" />
                <h3 className="font-bold text-gray-900">Data Sources</h3>
              </div>
              <div className="space-y-2">
                {chemical.sources.map((source, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700">{source}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  This data is compiled from {chemical.sources.length} scientific sources
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={openPubChem}
                  className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-3 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on PubChem
                </button>
                <button
                  onClick={() => copyToClipboard(chemical.smiles)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      SMILES Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy SMILES
                    </>
                  )}
                </button>
                <Link
                  href="/"
                  className="block w-full text-center border border-gray-300 text-gray-700 hover:border-black hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors"
                >
                  Search Another Chemical
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ChemicalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading chemical...</p>
        </div>
      </div>
    }>
      <ChemicalDetailPage />
    </Suspense>
  )
}