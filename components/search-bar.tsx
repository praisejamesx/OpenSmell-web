// components/search-bar.tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface SearchBarProps {
  initialQuery?: string
  searchType?: 'odor' | 'chemical'
  compact?: boolean
}

export default function SearchBar({ 
  initialQuery = '', 
  searchType = 'chemical',
  compact = false 
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState<'odor' | 'chemical'>(searchType)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    const encodedQuery = encodeURIComponent(query.trim())
    router.push(`/search?type=${type}&q=${encodedQuery}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={type === 'odor' ? "Search by smell (citrus, floral, woody...)" : "Search by chemical (vanillin, limonene...)"}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'odor' | 'chemical')}
            className="border border-gray-300 border-l-0 px-3 py-3 bg-gray-50 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="chemical">Chemical</option>
            <option value="odor">Odor</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </div>
      {!compact && (
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            onClick={() => {
              setQuery('citrus')
              setType('odor')
            }}
            className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            citrus
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery('vanillin')
              setType('chemical')
            }}
            className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
          >
            vanillin
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery('floral')
              setType('odor')
            }}
            className="text-sm bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg hover:bg-pink-100 transition-colors"
          >
            floral
          </button>
        </div>
      )}
    </form>
  )
}