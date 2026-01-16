interface StatsCardProps {
  label: string
  value: string
}

export default function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="border border-black p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-gray-600 mb-2">{label}</p>
      <p className="font-mono text-2xl font-bold">{value}</p>
    </div>
  )
}
