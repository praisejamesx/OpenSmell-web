// app/search/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2, AlertCircle, ExternalLink, Copy, Check } from "lucide-react"
import SearchBar from "@/components/search-bar"
import { searchByOdor, searchByChemical } from "@/lib/odor-index"
import BatchedChemicalViewer from "@/components/batched-molecule-viewer"

interface Chemical {
  cid: number
  name: string
  smiles: string
  descriptors: string[]
  sources: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<Chemical[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedCID, setCopiedCID] = useState<number | null>(null)

  const q = searchParams.get("q") || ""
  const type = (searchParams.get("type") || "chemical") as "odor" | "chemical"

  useEffect(() => {
    setLoading(true)
    setError(null)
    try {
      let searchResults: Chemical[] = []
      
      if (type === "odor") {
        const terms = q
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
        if (terms.length === 0) {
          searchResults = []
        } else {
          searchResults = searchByOdor(terms)
        }
      } else {
        searchResults = searchByChemical(q)
      }
      
      if (searchResults.length > 500) {
        searchResults = searchResults.slice(0, 500)
        setError(`Showing first 500 of ${searchResults.length} results. Use specific search terms for better results.`)
      }
      
      setResults(searchResults)
    } catch (error) {
      console.error("Search error:", error)
      setError("An error occurred during search. Please try again.")
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [q, type])

  const copyToClipboard = (text: string, cid: number) => {
    navigator.clipboard.writeText(text)
    setCopiedCID(cid)
    setTimeout(() => setCopiedCID(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex-1 flex justify-center">
              <Link 
                href="/" 
                className="font-bold text-xl text-gray-900 flex items-center gap-2"
              >
                <div className="relative w-8 h-8">
                  <Image
                    src="/logo.jpg"
                    alt="OpenSmell"
                    fill
                    className="object-contain rounded"
                    sizes="32px"
                  />
                </div>
                OpenSmell
              </Link>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <SearchBar initialQuery={q} searchType={type} />
      </div>

      <section className="px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {type === "odor" ? "Chemicals with odor:" : "Chemicals matching:"} <span className="text-blue-600">{q}</span>
            </h1>
            <p className="text-gray-600 font-mono text-sm">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching database...
                </span>
              ) : (
                <span>
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </span>
              )}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
              <p className="font-mono text-gray-600">Searching chemical database...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="border border-gray-200 bg-white rounded-xl p-12 text-center">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try different search terms or browse by odor descriptors.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link 
                    href="/search?type=odor&q=sweet"
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                  >
                    sweet
                  </Link>
                  <Link 
                    href="/search?type=odor&q=fruity"
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                  >
                    fruity
                  </Link>
                  <Link 
                    href="/search?type=odor&q=floral"
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                  >
                    floral
                  </Link>
                  <Link 
                    href="/search?type=odor&q=woody"
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                  >
                    woody
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Table View Section */}
              <div className="mb-8 bg-white border border-gray-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="cursor-pointer bg-gray-50 px-6 py-4 border-b border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-800">View Results as Table</h3>
                      </div>
                      <span className="text-sm text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded">
                        {results.length} rows
                      </span>
                    </div>
                  </summary>
                  
                  <div className="p-0">
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              CID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              SMILES
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Descriptors
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Sources
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {results.map((chem) => (
                            <tr key={chem.cid} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <a 
                                    href={`https://pubchem.ncbi.nlm.nih.gov/compound/${chem.cid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-mono text-sm flex items-center gap-1"
                                  >
                                    {chem.cid}
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                  <button
                                    onClick={() => copyToClipboard(chem.smiles, chem.cid)}
                                    className="text-gray-400 hover:text-gray-600"
                                    title="Copy SMILES"
                                  >
                                    {copiedCID === chem.cid ? (
                                      <Check className="w-3 h-3 text-green-500" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                                {chem.name}
                              </td>
                              <td className="px-4 py-3">
                                <code className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded truncate block max-w-xs">
                                  {chem.smiles}
                                </code>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {chem.descriptors.slice(0, 3).map(desc => (
                                    <span key={desc} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                      {desc}
                                    </span>
                                  ))}
                                  {chem.descriptors.length > 3 && (
                                    <span className="text-xs text-gray-500">+{chem.descriptors.length - 3}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                  {chem.sources.slice(0, 2).map(source => (
                                    <span key={source} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                      {source}
                                    </span>
                                  ))}
                                  {chem.sources.length > 2 && (
                                    <span className="text-xs text-gray-500">+{chem.sources.length - 2}</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </details>
              </div>

              {/* Card View Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Molecular View</h3>
                <BatchedChemicalViewer 
                  chemicals={results} 
                  itemsPerPage={24}
                  gridColumns={{
                    base: 1,
                    sm: 2,
                    md: 2,
                    lg: 3,
                    xl: 3
                  }}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <Image
                  src="/logo.jpg"
                  alt="OpenSmell"
                  fill
                  className="object-contain rounded"
                  sizes="24px"
                />
              </div>
              <span className="font-bold text-gray-900">OpenSmell</span>
            </div>
            <div className="text-sm text-gray-600">
              Open source odor chemistry database
            </div>
            <div className="text-sm">
              <Link href="/" className="text-gray-600 hover:text-black">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}