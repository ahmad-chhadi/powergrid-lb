// Each schedule is 24 characters, one per hour starting at 00:00.
// E = state grid (EDL), G = generator, S = solar, - = no power.
// Sample data for demonstration purposes.

export const SOURCES = {
  E: { key: 'E', name: 'State grid', short: 'EDL', color: 'bg-grid', text: 'text-grid' },
  G: { key: 'G', name: 'Generator', short: 'Gen', color: 'bg-gen', text: 'text-gen' },
  S: { key: 'S', name: 'Solar', short: 'Solar', color: 'bg-solar', text: 'text-solar' },
  '-': { key: '-', name: 'No power', short: 'Off', color: 'hatch bg-white', text: 'text-cut' },
}

export const areas = [
  {
    id: 'nabatieh',
    name: 'Nabatieh',
    district: 'South Lebanon',
    schedule: 'GGGGGGEEEESSSSSSGGGGGG--',
    note: 'Generator switches off 22:00–00:00 for maintenance.',
  },
  {
    id: 'beirut',
    name: 'Beirut',
    district: 'Beirut',
    schedule: 'GGGGEEEEGGSSSSSSEEEEGGGG',
    note: 'Grid supply is longer in Beirut administrative areas.',
  },
  {
    id: 'saida',
    name: 'Saida',
    district: 'South Lebanon',
    schedule: '-GGGGGGEEESSSSSSGGGGGGGG',
    note: 'Short generator gap after midnight.',
  },
  {
    id: 'tyre',
    name: 'Tyre',
    district: 'South Lebanon',
    schedule: 'GGGG--GGEESSSSSSSGGGGGGG',
    note: 'Grid arrives mid-morning on most days.',
  },
  {
    id: 'tripoli',
    name: 'Tripoli',
    district: 'North Lebanon',
    schedule: 'GGGGGEEEEGGSSSSSGGEEGGG-',
    note: 'Two grid windows: morning and early evening.',
  },
  {
    id: 'zahle',
    name: 'Zahle',
    district: 'Bekaa',
    schedule: 'GGGGGGGGEESSSSSSSGGGGGGG',
    note: 'Strong sun hours make solar the main daytime source.',
  },
]

export const getArea = (id) => areas.find((a) => a.id === id)