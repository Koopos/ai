export interface Wildlife {
  id: string
  name: string
  description: string
  dangerLevel: 'Low' | 'Medium' | 'High' | 'Extreme'
  behavior: string[]
  drops: string[]
  locations: string[]
  image?: string
}

export const wildlife: Wildlife[] = [
  {
    id: 'deer',
    name: 'Deer',
    description: 'A common herbivore found throughout the regions. Provides a steady source of food and materials.',
    dangerLevel: 'Low',
    behavior: [
      'Passive unless provoked',
      'Will flee if player gets too close',
      'Can be hunted with bow or rifle',
      'Commonly found in valleys and forests'
    ],
    drops: ['Venison', 'Deer Hide', 'Gut', 'Antlers'],
    locations: ['Mystery Lake', 'Pleasant Valley', 'Mountain Town', 'Coastal Highway']
  },
  {
    id: 'rabbit',
    name: 'Rabbit',
    description: 'Small, fast animals that can be caught with snares or hunted with a bow.',
    dangerLevel: 'Low',
    behavior: [
      'Very skittish',
      'Can be caught with snares',
      'Provides small amounts of food',
      'Found in various regions'
    ],
    drops: ['Rabbit Meat', 'Rabbit Pelt', 'Gut'],
    locations: ['Mystery Lake', 'Pleasant Valley', 'Mountain Town', 'Coastal Highway', 'All Regions']
  },
  {
    id: 'wolf',
    name: 'Wolf',
    description: 'Predatory canines that hunt in packs. One of the most dangerous wildlife encounters.',
    dangerLevel: 'High',
    behavior: [
      'Aggressive and territorial',
      'Hunts in packs',
      'Will stalk and chase the player',
      'Can be deterred with flares or torches',
      'Drawn to blood and cooked meat'
    ],
    drops: ['Wolf Meat', 'Wolf Pelt', 'Gut', 'Wolf Rib'],
    locations: ['All Regions', 'More common in certain areas like Mountain Town']
  },
  {
    id: 'timberwolf',
    name: 'Timberwolf',
    description: 'A more aggressive variant of wolf that hunts in larger packs.',
    dangerLevel: 'Extreme',
    behavior: [
      'Highly aggressive',
      'Hunts in large packs',
      'More persistent than regular wolves',
      'Found in specific regions'
    ],
    drops: ['Wolf Meat', 'Wolf Pelt', 'Gut'],
    locations: ['Bleak Inlet', 'Timberwolf Mountain']
  },
  {
    id: 'bear',
    name: 'Bear',
    description: 'Large, powerful predators that can be fatal if unprepared.',
    dangerLevel: 'Extreme',
    behavior: [
      'Territorial and aggressive',
      'Can charge from a distance',
      'Requires multiple hits to take down',
      'Will maul if it catches player',
      'Hibernates in caves during winter'
    ],
    drops: ['Bear Meat', 'Bear Hide', 'Gut', 'Bear Bedroll'],
    locations: ['Pleasant Valley', 'Coastal Highway', 'Mystery Lake', 'Hushed River Valley']
  },
  {
    id: 'moose',
    name: 'Moose',
    description: 'Large herbivores that are generally peaceful but can defend themselves.',
    dangerLevel: 'Medium',
    behavior: [
      'Generally passive',
      'Will charge if provoked',
      'Difficult to hunt',
      'Found in specific locations'
    ],
    drops: ['Moose Meat', 'Moose Hide', 'Gut', 'Moose Satchel'],
    locations: ['Pleasant Valley', 'Mystery Lake', 'Coastal Highway']
  },
  {
    id: 'ptarmigan',
    name: 'Ptarmigan',
    description: 'Small birds that can be hunted for small amounts of food.',
    dangerLevel: 'Low',
    behavior: [
      'Passive',
      'Will fly away if approached',
      'Can be hunted with stones or bow',
      'Found in various regions'
    ],
    drops: ['Ptarmigan Meat', 'Feathers'],
    locations: ['Mystery Lake', 'Pleasant Valley', 'Mountain Town', 'Coastal Highway']
  },
  {
    id: 'cougar',
    name: 'Cougar',
    description: 'A stealthy feline predator introduced in the Tales from the Far Territory DLC.',
    dangerLevel: 'Extreme',
    behavior: [
      'Extremely stealthy',
      'Ambush predator',
      'Difficult to detect',
      'Quick and powerful attacks',
      'Found in specific regions'
    ],
    drops: ['Cougar Meat', 'Cougar Pelt', 'Gut'],
    locations: ['Ash Canyon', 'Bleak Inlet', 'Sundered Pass']
  },
  {
    id: 'poisoned-wolf',
    name: 'Poisoned Wolf',
    description: 'A wolf affected by the mysterious contamination in certain regions.',
    dangerLevel: 'Extreme',
    behavior: [
      'Highly aggressive',
      'Unnatural behavior',
      'Meat is unsafe to eat',
      'Found in contaminated areas'
    ],
    drops: ['Inedible Meat', 'Wolf Pelt', 'Gut'],
    locations: ['Zone of Contamination', 'Blackrock']
  }
]
