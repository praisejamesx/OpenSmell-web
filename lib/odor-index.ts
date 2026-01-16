import odorIndex from '@/public/odor_search_index.json'

export interface Chemical {
  cid: number
  name: string
  smiles: string
  descriptors: string[]
  sources: string[]
}

// Load the data
const chemicals: Chemical[] = odorIndex

export function searchByOdor(odorTerms: string[]): Chemical[] {
  if (!odorTerms.length) return []
  
  return chemicals.filter(chemical => {
    // For each search term, check if any descriptor contains it
    return odorTerms.every(term => 
      chemical.descriptors.some(descriptor => 
        descriptor.toLowerCase().includes(term.toLowerCase())
      )
    )
  })
}

export function searchByChemical(query: string): Chemical[] {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return []
  
  return chemicals.filter(chemical => {
    // Search in CID
    if (chemical.cid.toString().includes(normalizedQuery.replace('cid_', ''))) {
      return true
    }
    
    // Search in name
    if (chemical.name.toLowerCase().includes(normalizedQuery)) {
      return true
    }
    
    // Search in SMILES (partial match)
    if (chemical.smiles.toLowerCase().includes(normalizedQuery)) {
      return true
    }
    
    // Search in descriptors
    if (chemical.descriptors.some(d => d.toLowerCase().includes(normalizedQuery))) {
      return true
    }
    
    return false
  })
}

export function getChemicalByCID(cid: number): Chemical | undefined {
  return chemicals.find(chemical => chemical.cid === cid)
}

export function getAllChemicals(): Chemical[] {
  return chemicals
}

export function getDescriptorStats() {
  const descriptorCounts: Record<string, number> = {}
  
  chemicals.forEach(chemical => {
    chemical.descriptors.forEach(desc => {
      descriptorCounts[desc] = (descriptorCounts[desc] || 0) + 1
    })
  })
  
  return {
    totalDescriptors: Object.keys(descriptorCounts).length,
    descriptorCounts,
    topDescriptors: Object.entries(descriptorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([desc, count]) => ({ desc, count }))
  }
}