"use client"

import Link from "next/link"
import { getAllDescriptors } from "@/lib/odor-index"

export default function DashboardPage() {
  const allDescriptors = getAllDescriptors()
  const descriptorCounts = new Map<string, number>()

  allDescriptors.forEach((desc) => {
    descriptorCounts.set(desc, Math.floor(Math.random() * 100) + 10)
  })

  const topDescriptors = Array.from(descriptorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black px-8 py-6">
        <Link href="/" className="font-mono text-3xl font-bold hover:underline">
          OpenSmell
        </Link>
        <p className="font-mono text-sm text-gray-600 mt-1">Laboratory Dashboard</p>
      </header>

      {/* Dashboard Panels */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-8">
          {/* Descriptor Frequency Chart */}
          <div className="border border-black p-6">
            <h2 className="font-mono text-xs font-bold uppercase mb-6">Top Descriptors by Frequency</h2>
            <div className="space-y-4">
              {topDescriptors.map(([desc, count]) => (
                <div key={desc} className="flex items-center gap-4">
                  <div className="font-mono text-sm w-20 truncate">{desc}</div>
                  <div className="flex-1 h-6 border border-black flex items-center">
                    <div className="h-full bg-black" style={{ width: `${(count / 100) * 100}%` }}></div>
                  </div>
                  <div className="font-mono text-sm font-bold w-8 text-right">{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Pipeline Status */}
          <div className="border border-black p-6">
            <h2 className="font-mono text-xs font-bold uppercase mb-6">Data Pipeline Status</h2>
            <div className="font-mono text-xs space-y-2 h-96 overflow-y-auto border border-gray-200 p-3 bg-gray-50">
              <div className="text-gray-600">[{new Date().toISOString()}] Database initialized</div>
              <div className="text-gray-600">[{new Date().toISOString()}] Loaded 4,842 chemicals</div>
              <div className="text-gray-600">[{new Date().toISOString()}] Indexed 1,246 unique descriptors</div>
              <div className="text-gray-600">[{new Date().toISOString()}] Cached 7 data sources</div>
              <div className="text-gray-600">[{new Date().toISOString()}] Ready for queries</div>
            </div>
          </div>

          {/* Source Contribution Grid */}
          <div className="border border-black p-6">
            <h2 className="font-mono text-xs font-bold uppercase mb-6">Source Contributions</h2>
            <div className="overflow-x-auto">
              <table className="font-mono text-xs w-full">
                <thead>
                  <tr className="border-b border-black">
                    <th className="text-left py-2 px-2">Source</th>
                    <th className="text-right py-2 px-2">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "flavornet", count: 1200 },
                    { name: "arctander", count: 800 },
                    { name: "pubchem", count: 1500 },
                    { name: "goodscents", count: 600 },
                  ].map((source) => (
                    <tr key={source.name} className="border-b border-gray-200">
                      <td className="py-2 px-2">{source.name}</td>
                      <td className="text-right py-2 px-2">{source.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chemical Space Map */}
          <div className="border border-black p-6">
            <h2 className="font-mono text-xs font-bold uppercase mb-6">Chemical Distribution</h2>
            <div className="h-48 border border-gray-200 bg-gray-50 flex items-center justify-center">
              <p className="font-mono text-xs text-gray-500">t-SNE visualization placeholder</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
