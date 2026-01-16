interface RecentSearchesProps {
  searches: Array<{
    query: string
    timestamp: Date
    type: "odor" | "chemical"
  }>
}

export default function RecentSearches({ searches }: RecentSearchesProps) {
  return (
    <div>
      <h3 className="font-mono text-sm font-bold uppercase tracking-wider mb-4">Recent Searches</h3>
      <div className="border border-black p-4 font-mono text-xs space-y-2 h-48 overflow-y-auto">
        {searches.length === 0 ? (
          <p className="text-gray-400">No recent searches</p>
        ) : (
          searches.map((search, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-2 last:border-b-0">
              <div className="text-gray-600">{search.timestamp.toLocaleTimeString()}</div>
              <div className="text-foreground truncate">
                [{search.type.toUpperCase()}] {search.query}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
