"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, Zap, Brain, Mail, Github, MessageSquare, Coffee, ChevronRight } from "lucide-react"

export default function Home() {
  const [recentSearches, setRecentSearches] = useState<
    Array<{ query: string; timestamp: Date; type: "odor" | "chemical" }>
  >([])
  const [hydrated, setHydrated] = useState(false)
  const searchSectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fix hydration error
  useEffect(() => {
    setHydrated(true)
  }, [])

  const handleSearch = useCallback((query: string, type: "odor" | "chemical") => {
    if (query.trim()) {
      setRecentSearches((prev) => [{ query, timestamp: new Date(), type }, ...prev.slice(0, 9)])
    }
  }, [])

  const handleSearchSubmit = (query: string, type: "odor" | "chemical") => {
    if (!query.trim()) return
    
    // Track the search
    handleSearch(query, type)
    
    // Navigate to search results page
    const encodedQuery = encodeURIComponent(query.trim())
    router.push(`/search?type=${type}&q=${encodedQuery}`)
  }

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation with Logo */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 no-underline">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/logo.jpg"
                alt="OpenSmell"
                fill
                className="object-contain rounded-lg"
                priority
                sizes="40px"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">OpenSmell</h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <button 
              onClick={scrollToSearch}
              className="text-gray-700 hover:text-black transition-colors"
            >
              Search
            </button>
            <Link 
              href="/hairy-nose" 
              className="text-gray-700 hover:text-black transition-colors"
              prefetch={false}
            >
              Hairy-Nose
            </Link>
            <Link 
              href="/contribute" 
              className="text-gray-700 hover:text-black transition-colors"
              prefetch={false}
            >
              Contribute
            </Link>
            <a 
              href="https://discord.gg/CGER3tHxbH" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-gray-700 hover:text-black transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Community</span>
            </a>
            <a 
              href="https://selar.com/showlove/judahx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Coffee className="w-4 h-4" />
              <span>Donate</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section with Vision */}
      <main className="px-4 py-8 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero - Vision Statement */}
          <div className="text-center mb-16">
            <div className="relative mb-8">
              {/* Simple molecular animation using CSS only */}
              <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="relative h-full w-full">
                  <div className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-blue-300 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/3 right-1/4 w-6 h-6 border-2 border-purple-300 rounded-full animate-pulse delay-300"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-10 h-10 border-2 border-green-300 rounded-full animate-pulse delay-700"></div>
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                The final frontier of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">sensory data</span>
              </h1>
              
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                We've digitized sight, sound, and touch. <span className="font-semibold">Smell remains the last untamed sense. </span> 
                OpenSmell is building the infrastructure to capture, index, and understand olfaction.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://discord.gg/CGER3tHxbH" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all hover:scale-105"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Join the Community
                </a>
                <button 
                  onClick={scrollToSearch}
                  className="inline-flex items-center justify-center border-2 border-gray-300 px-6 py-3 rounded-lg hover:border-black transition-colors"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Explore Scent Search
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                <div className="text-2xl font-bold text-gray-900">5,000+</div>
                <div className="text-sm text-gray-600">Chemicals indexed</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border border-green-100">
                <div className="text-2xl font-bold text-gray-900">1,200+</div>
                <div className="text-sm text-gray-600">Odor descriptors</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
                <div className="text-2xl font-bold text-gray-900">7+</div>
                <div className="text-sm text-gray-600">Data sources</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-xl border border-orange-100">
                <div className="text-2xl font-bold text-gray-900">Growing</div>
                <div className="text-sm text-gray-600">Community</div>
              </div>
            </div>
          </div>

          {/* Search Interface - FIXED */}
          <div ref={searchSectionRef} className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Search for Scents</h2>
              <p className="text-gray-600">Instant access to thousands of chemical-odor relationships</p>
            </div>
            
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
                      placeholder="citrus, floral, woody, aldehydic..."
                      className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e.currentTarget.value, 'odor')}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder*="citrus"]') as HTMLInputElement
                        handleSearchSubmit(input?.value || 'citrus', 'odor')
                      }}
                      className="bg-blue-600 text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleSearchSubmit('citrus', 'odor')}
                      className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      citrus
                    </button>
                    <button 
                      onClick={() => handleSearchSubmit('floral', 'odor')}
                      className="text-sm bg-pink-50 text-pink-700 px-3 py-1.5 rounded-lg hover:bg-pink-100 transition-colors"
                    >
                      floral
                    </button>
                    <button 
                      onClick={() => handleSearchSubmit('woody', 'odor')}
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
                      placeholder="vanillin, limonene, CID_440917..."
                      className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e.currentTarget.value, 'chemical')}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder*="vanillin"]') as HTMLInputElement
                        handleSearchSubmit(input?.value || 'vanillin', 'chemical')
                      }}
                      className="bg-green-600 text-white px-4 py-3 rounded-r-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleSearchSubmit('vanillin', 'chemical')}
                      className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      vanillin
                    </button>
                    <button 
                      onClick={() => handleSearchSubmit('limonene', 'chemical')}
                      className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      limonene
                    </button>
                    <button 
                      onClick={() => handleSearchSubmit('benzaldehyde', 'chemical')}
                      className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      benzaldehyde
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Vision Roadmap - Updated with chemical identification */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Our Vision</h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              From chemical sensors to olfactory intelligence
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold mr-3">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Scent Search Engine</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Search thousands of chemicals by odor, or find what any compound smells like. 
                  The foundation for digital olfaction.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <span>Live Now</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
              
              {/* Step 2 - Hairy-Nose with chemical identification */}
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg font-bold mr-3">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Hairy-Nose</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Affordable e-nose that identifies unknown chemicals by matching sensor 
                  patterns against our database. Smell the physical world and know what's in it.
                </p>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <Zap className="w-4 h-4 mr-1" />
                  <span>In Development</span>
                </div>
              </div>
              
              {/* Step 3 - SmeLLM */}
              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-bold mr-3">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">SmeLLM</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  AI trained on olfactory data. Predict smells from molecular structures, 
                  generate novel fragrance molecules, and understand scent scientifically.
                </p>
                <div className="flex items-center text-purple-600 text-sm font-medium">
                  <Brain className="w-4 h-4 mr-1" />
                  <span>Research Phase</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 sm:p-12 text-center border border-blue-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Join the mission to digitize smell
              </h2>
              <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
                We're building an open platform where researchers, perfumers, hardware hackers, 
                and AI engineers can collaborate on the final frontier of sensory data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://discord.gg/CGER3tHxbH" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all hover:scale-105"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Join Discord Community
                </a>
                <a 
                  href="https://github.com/opensmell" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition-colors"
                >
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                </a>
                <a 
                  href="https://selar.com/showlove/judahx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-black transition-colors"
                >
                  <Coffee className="w-5 h-5 mr-2" />
                  Support the Project
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-100 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/logo.jpg"
                      alt="OpenSmell"
                      fill
                      className="object-contain rounded"
                      sizes="32px"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">OpenSmell</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 max-w-md">
                  An open-source initiative to map, understand, and digitize olfaction.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <a 
                  href="https://github.com/opensmell" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://discord.gg/CGER3tHxbH" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label="Discord"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:contact@opensmell.org" 
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-600">
              <p>© {new Date().getFullYear()} OpenSmell. Data updated weekly.</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}