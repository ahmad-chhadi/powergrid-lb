// Each schedule is 24 characters, one per hour starting at 00:00.
// E = state grid (EDL), G = generator, S = solar, - = no power.
// Sample data for demonstration purposes.

export const SOURCES = {
  E: { key: 'E', name: 'State grid', color: 'bg-grid' },
  G: { key: 'G', name: 'Generator', color: 'bg-gen' },
  S: { key: 'S', name: 'Solar', color: 'bg-solar' },
  '-': { key: '-', name: 'No power', color: 'hatch bg-white' },
}

export const areas = [
  {
    id: 'nabatieh',
    name: 'Nabatieh',
    schedule: 'GGGGGGEEEESSSSSSGGGGGG--',
    note: 'Generator switches off 22:00–00:00 for maintenance.',
  },
  {
    id: 'beirut',
    name: 'Beirut',
    schedule: 'GGGGEEEEGGSSSSSSEEEEGGGG',
    note: 'Grid supply is longer in Beirut administrative areas.',
  },
  {
    id: 'saida',
    name: 'Saida',
    schedule: '-GGGGGGEEESSSSSSGGGGGGGG',
    note: 'Short generator gap after midnight.',
  },
  {
    id: 'tyre',
    name: 'Tyre',
    schedule: 'GGGG--GGEESSSSSSSGGGGGGG',
    note: 'Grid arrives mid-morning on most days.',
  },
  {
    id: 'tripoli',
    name: 'Tripoli',
    schedule: 'GGGGGEEEEGGSSSSSGGEEGGG-',
    note: 'Two grid windows: morning and early evening.',
  },
  {
    id: 'zahle',
    name: 'Zahle',
    schedule: 'GGGGGGGGEESSSSSSSGGGGGGG',
    note: 'Strong sun hours make solar the main daytime source.',
  },
]

export const getArea = (id) => areas.find((a) => a.id === id)
