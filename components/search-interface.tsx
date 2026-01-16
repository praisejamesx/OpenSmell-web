"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

interface SearchInterfaceProps {
  onSearch?: (query: string, type: "odor" | "chemical") => void
}

export default function SearchInterface({ onSearch }: SearchInterfaceProps) {
  const [odorQuery, setOdorQuery] = useState("")
  const [chemicalQuery, setChemicalQuery] = useState("")
  const router = useRouter()

  const handleOdorSearch = () => {
    if (odorQuery.trim()) {
      const encodedQuery = encodeURIComponent(odorQuery)
      router.push(`/search?type=odor&q=${encodedQuery}`)
      onSearch?.(odorQuery, "odor")
    }
  }

  const handleChemicalSearch = () => {
    if (chemicalQuery.trim()) {
      const encodedQuery = encodeURIComponent(chemicalQuery)
      router.push(`/search?type=chemical&q=${encodedQuery}`)
      onSearch?.(chemicalQuery, "chemical")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Search by Odor */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold mr-3">
            1
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Find chemicals by smell</h3>
            <p className="text-sm text-gray-600">What chemicals smell like "citrus" or "floral"?</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex">
            <input
              type="text"
              value={odorQuery}
              onChange={(e) => setOdorQuery(e.target.value)}
              placeholder="citrus, floral, woody, aldehydic..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleOdorSearch()}
            />
            <button
              onClick={handleOdorSearch}
              className="bg-blue-600 text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
              disabled={!odorQuery.trim()}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => {
                setOdorQuery("citrus")
                handleOdorSearch()
              }}
              className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
            >
              citrus
            </button>
            <button 
              onClick={() => {
                setOdorQuery("floral")
                handleOdorSearch()
              }}
              className="text-sm bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg hover:bg-pink-100 transition-colors"
            >
              floral
            </button>
            <button 
              onClick={() => {
                setOdorQuery("woody")
                handleOdorSearch()
              }}
              className="text-sm bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
            >
              woody
            </button>
          </div>
        </div>
      </div>
      
      {/* Search by Chemical */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold mr-3">
            2
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Find smells by chemical</h3>
            <p className="text-sm text-gray-600">What does vanillin or limonene smell like?</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex">
            <input
              type="text"
              value={chemicalQuery}
              onChange={(e) => setChemicalQuery(e.target.value)}
              placeholder="vanillin, limonene, CID_440917..."
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handleChemicalSearch()}
            />
            <button
              onClick={handleChemicalSearch}
              className="bg-green-600 text-white px-4 py-3 rounded-r-lg hover:bg-green-700 transition-colors flex items-center"
              disabled={!chemicalQuery.trim()}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => {
                setChemicalQuery("vanillin")
                handleChemicalSearch()
              }}
              className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
            >
              vanillin
            </button>
            <button 
              onClick={() => {
                setChemicalQuery("limonene")
                handleChemicalSearch()
              }}
              className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              limonene
            </button>
            <button 
              onClick={() => {
                setChemicalQuery("benzaldehyde")
                handleChemicalSearch()
              }}
              className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              benzaldehyde
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}