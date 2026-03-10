export interface Region {
  id: string
  name: string
  description: string
  difficulty: string
  features: string[]
  image?: string
  connections?: string[]
}

export const regions: Region[] = [
  {
    id: 'mystery-lake',
    name: 'Mystery Lake',
    description: 'A frozen lake surrounded by forests and buildings. One of the first regions players encounter.',
    difficulty: 'Easy',
    features: [
      'Camp Office',
      'Trapper\'s Homestead',
      'Forestry Lookout',
      'Rik\'s Hut',
      'Fishing Huts',
      'Dam'
    ],
    connections: ['Mountain Town', 'Forlorn Muskeg', 'Crumbling Highway']
  },
  {
    id: 'coastal-highway',
    name: 'Coastal Highway',
    description: 'A scenic coastal road with abandoned buildings and a fishing village.',
    difficulty: 'Easy',
    features: [
      'Quonset Gas Station',
      'Murphy\'s Law',
      'Fisherman\'s Paradise',
      'Aggravating Straits',
      'Community Hall',
      'Misanthrope\'s Homestead'
    ],
    connections: ['Desolation Point', 'Pleasant Valley', 'Crumbling Highway']
  },
  {
    id: 'pleasant-valley',
    name: 'Pleasant Valley',
    description: 'A rural farming community with vast open fields and scattered buildings.',
    difficulty: 'Easy',
    features: [
      'Farmstead',
      'Community Center',
      'Skeletal Cave',
      'Orchard',
      'Trapper\'s Cabin',
      'Burned Ridge Cave'
    ],
    connections: ['Coastal Highway', 'Mountain Town', 'Crumbling Highway']
  },
  {
    id: 'mountain-town',
    name: 'Mountain Town',
    description: 'An abandoned mining town nestled in the mountains.',
    difficulty: 'Medium',
    features: [
      'Milton Town',
      'Milton Pharmacy',
      'Grey Mother\'s House',
      'Old Schoolhouse',
      'Waterfront Caves',
      'Climbing Area to Mountain Town'
    ],
    connections: ['Mystery Lake', 'Pleasant Valley', 'Hushed River Valley']
  },
  {
    id: 'broken-railroad',
    name: 'Broken Railroad',
    description: 'A railroad yard with industrial facilities and hidden locations.',
    difficulty: 'Medium',
    features: [
      'Maintenance Yard',
      'Old Spence Family Homestead',
      'Railyard',
      'Forestry Lookout',
      'Cave',
      'Hunting Lodge'
    ],
    connections: ['Forlorn Muskeg', 'Mountain Town']
  },
  {
    id: 'forlorn-muskeg',
    name: 'Forlorn Muskeg',
    description: 'A frozen marshland with sparse shelter and harsh conditions.',
    difficulty: 'Hard',
    features: [
      'Forlorn Muskeg Cave',
      'Poacher\'s Camp',
      'Ice Fishing',
      'Collapsed Tunnel',
      'Stone Church',
      'Hunter\'s Lodge'
    ],
    connections: ['Mystery Lake', 'Broken Railroad', 'Sundered Pass']
  },
  {
    id: 'desolation-point',
    name: 'Desolation Point',
    description: 'An isolated region with industrial remnants and lighthouse.',
    difficulty: 'Hard',
    features: [
      'Hibernia Processing',
      'Lighthouse',
      'Whaling Station',
      'Crashed Ship',
      'Riken',
      'Workshop'
    ],
    connections: ['Coastal Highway']
  },
  {
    id: 'timberwolf-mountain',
    name: 'Timberwolf Mountain',
    description: 'A towering mountain with an abandoned research station at its peak.',
    difficulty: 'Hard',
    features: [
      'Research Station',
      'Mountain Summit',
      'Caves',
      'Deer Clearing',
      'Plane Crash Site',
      'Climbing Route'
    ],
    connections: ['Mountain Town', 'Pleasant Valley']
  },
  {
    id: 'ash-canyon',
    name: 'Ash Canyon',
    description: 'A deep canyon with gold rush era mining operations.',
    difficulty: 'Hard',
    features: [
      'Gold Mine',
      'Climbing Park',
      'Foreman\'s Retreat',
      'Bunker',
      'Canyon Cave',
      'Rope Bridges'
    ],
    connections: ['Timberwolf Mountain']
  },
  {
    id: 'bleak-inlet',
    name: 'Bleak Inlet',
    description: 'A coastal region with an old cannery and wind farms.',
    difficulty: 'Hard',
    features: [
      'Old Cannery',
      'Wildlife Reserve',
      'Lighthouse',
      'Wind Farm',
      'Pond',
      'Cliff Hanger'
    ],
    connections: ['Forlorn Muskeg', 'Sundered Pass']
  },
  {
    id: 'hushed-river-valley',
    name: 'Hushed River Valley',
    description: 'A pristine valley with hot springs and abundant wildlife.',
    difficulty: 'Medium',
    features: [
      'Hot Springs',
      'Forest Caves',
      'Bunker',
      'River Valley',
      'Deer Hammock',
      'Bear Rock'
    ],
    connections: ['Mountain Town']
  },
  {
    id: 'sundered-pass',
    name: 'Sundered Pass',
    description: 'A high mountain pass connecting various regions.',
    difficulty: 'Hard',
    features: [
      'Engine Railcars',
      'Summit',
      'Caves',
      'Climbing Routes',
      'Old Mine',
      'Bridges'
    ],
    connections: ['Forlorn Muskeg', 'Bleak Inlet', 'Zone of Contamination']
  },
  {
    id: 'forsaken-airfield',
    name: 'Forsaken Airfield',
    description: 'An abandoned military airfield with hangars and facilities.',
    difficulty: 'Medium',
    features: [
      'Airfield Hangars',
      'Control Tower',
      'Underground Bunker',
      'Sleeping Cars',
      'Frozen Creek',
      'Caves'
    ],
    connections: ['Zone of Contamination']
  },
  {
    id: 'blackrock',
    name: 'Blackrock',
    description: 'A former prison complex with industrial facilities.',
    difficulty: 'Hard',
    features: [
      'Blackrock Prison',
      'Industrial Zone',
      'Warden\'s Office',
      'Cells',
      'Underground Tunnels',
      'Radio Tower'
    ],
    connections: ['Forsaken Airfield', 'Zone of Contamination']
  },
  {
    id: 'zone-of-contamination',
    name: 'Zone of Contamination',
    description: 'A mysterious region with hazardous environmental conditions.',
    difficulty: 'Hard',
    features: [
      'Contaminated Zone',
      'Research Facilities',
      'Abandoned Equipment',
      'Hazmat Suits Required',
      'Caves',
      'Industrial Remains'
    ],
    connections: ['Sundered Pass', 'Forsaken Airfield', 'Blackrock']
  },
  {
    id: 'transfer-pass',
    name: 'Transfer Pass',
    description: 'A mountain pass region added in the Tales from the Far Territory DLC.',
    difficulty: 'Hard',
    features: [
      'Railway Tunnels',
      'Mountain Summits',
      'Ice Climbing Areas',
      'Supply Caches',
      'Abandoned Camps',
      'Mountain Huts'
    ],
    connections: ['Sundered Pass', 'Hushed River Valley']
  }
]
