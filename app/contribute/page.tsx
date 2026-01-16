"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"

export default function ContributePage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    chemicalName: "",
    cid: "",
    descriptors: "",
    source: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ chemicalName: "", cid: "", descriptors: "", source: "" })
      setSubmitted(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black px-8 py-6">
        <Link href="/" className="font-mono text-3xl font-bold hover:underline">
          OpenSmell
        </Link>
        <p className="font-mono text-sm text-gray-600 mt-1">Contribute Data</p>
      </header>

      {/* Content */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-8">
          {/* Submission Form */}
          <div className="border border-black p-6">
            <h2 className="font-mono text-xs font-bold uppercase mb-6">Submit Chemical-Odor Pair</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-xs block mb-2">Chemical Name</label>
                <input
                  type="text"
                  value={formData.chemicalName}
                  onChange={(e) => setFormData({ ...formData, chemicalName: e.target.value })}
                  placeholder="e.g. d-limonene"
                  className="w-full border border-black px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-xs block mb-2">PubChem CID</label>
                <input
                  type="text"
                  value={formData.cid}
                  onChange={(e) => setFormData({ ...formData, cid: e.target.value })}
                  placeholder="e.g. 440917"
                  className="w-full border border-black px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-xs block mb-2">Odor Descriptors (comma-separated)</label>
                <textarea
                  value={formData.descriptors}
                  onChange={(e) => setFormData({ ...formData, descriptors: e.target.value })}
                  placeholder="e.g. citrus, orange, fresh"
                  className="w-full border border-black px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black h-24"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-xs block mb-2">Data Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g. flavornet"
                  className="w-full border border-black px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-black text-white font-mono text-sm py-2 hover:bg-gray-800">
                Submit Entry
              </button>
              {submitted && <p className="font-mono text-xs text-green-600">Submission received. Thank you!</p>}
            </form>
          </div>

          {/* Submission Queue */}
          <div className="border border-black p-6">
            <h2 className="font-mono text-xs font-bold uppercase mb-6">Pending Submissions</h2>
            <div className="space-y-3">
              {[
                { chemical: "alpha-pinene", status: "reviewing", date: "2024-01-14" },
                { chemical: "eugenol", status: "approved", date: "2024-01-13" },
                { chemical: "geraniol", status: "reviewing", date: "2024-01-12" },
              ].map((entry, idx) => (
                <div key={idx} className="border border-black p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono font-bold text-sm">{entry.chemical}</p>
                      <p className="font-mono text-xs text-gray-600">{entry.date}</p>
                    </div>
                    <span
                      className={`font-mono text-xs px-2 py-1 border ${
                        entry.status === "approved"
                          ? "border-green-600 text-green-600"
                          : "border-yellow-600 text-yellow-600"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
