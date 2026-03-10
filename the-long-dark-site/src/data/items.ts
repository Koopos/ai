export interface Item {
  id: string
  name: string
  category: 'Food' | 'Drink' | 'Tool' | 'Clothing' | 'First Aid' | 'Material' | 'Fire Starting'
  description: string
  weight: number
  condition?: number
  stackable: boolean
  maxStack?: number
  image?: string
}

export const items: Item[] = [
  // Food
  {
    id: 'canned-food',
    name: 'Canned Food',
    category: 'Food',
    description: 'Various canned goods that provide good calories and last indefinitely.',
    weight: 0.5,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'energy-bar',
    name: 'Energy Bar',
    category: 'Food',
    description: 'Lightweight, high-calorie food bar. Good for emergency rations.',
    weight: 0.1,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'deer-meat',
    name: 'Deer Meat',
    category: 'Food',
    description: 'Raw meat from a deer. Must be cooked before eating.',
    weight: 1.0,
    condition: 100,
    stackable: true,
    maxStack: 5
  },
  {
    id: 'wolf-meat',
    name: 'Wolf Meat',
    category: 'Food',
    description: 'Raw meat from a wolf. Must be cooked before eating.',
    weight: 1.0,
    condition: 100,
    stackable: true,
    maxStack: 5
  },
  {
    id: 'bear-meat',
    name: 'Bear Meat',
    category: 'Food',
    description: 'Raw meat from a bear. Must be cooked before eating.',
    weight: 1.0,
    condition: 100,
    stackable: true,
    maxStack: 5
  },
  // Drink
  {
    id: 'water',
    name: 'Water',
    category: 'Drink',
    description: 'Clean drinking water. Essential for survival.',
    weight: 1.0,
    stackable: true,
    maxStack: 5
  },
  {
    id: 'soda',
    name: 'Soda',
    category: 'Drink',
    description: 'Carbonated beverages. Provides hydration and some calories.',
    weight: 0.5,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'canned-coffee',
    name: 'Canned Coffee',
    category: 'Drink',
    description: 'Provides warmth and caffeine.',
    weight: 0.5,
    stackable: true,
    maxStack: 10
  },
  // Tools
  {
    id: 'hunting-knife',
    name: 'Hunting Knife',
    category: 'Tool',
    description: 'Essential for harvesting carcasses and crafting.',
    weight: 0.5,
    condition: 100,
    stackable: false
  },
  {
    id: 'hatchet',
    name: 'Hatchet',
    category: 'Tool',
    description: 'Used for breaking down furniture and harvesting wood.',
    weight: 1.0,
    condition: 100,
    stackable: false
  },
  {
    id: 'hacksaw',
    name: 'Hacksaw',
    category: 'Tool',
    description: 'Used for harvesting metal and breaking down metal objects.',
    weight: 0.75,
    condition: 100,
    stackable: false
  },
  {
    id: 'bow',
    name: 'Bow',
    category: 'Tool',
    description: 'Silent ranged weapon for hunting. Requires arrows.',
    weight: 1.0,
    condition: 100,
    stackable: false
  },
  {
    id: 'rifle',
    name: 'Hunting Rifle',
    category: 'Tool',
    description: 'Powerful ranged weapon. Requires hunting rifle ammunition.',
    weight: 3.5,
    condition: 100,
    stackable: false
  },
  {
    id: 'revolver',
    name: 'Revolver',
    category: 'Tool',
    description: 'Handgun for self-defense. Requires revolver ammunition.',
    weight: 1.5,
    condition: 100,
    stackable: false
  },
  {
    id: 'flare-gun',
    name: 'Flare Gun',
    category: 'Tool',
    description: 'Emergency signaling device. Can deter predators.',
    weight: 1.0,
    condition: 100,
    stackable: false
  },
  // Clothing
  {
    id: 'wool-earwrap',
    name: 'Wool Ear Wrap',
    category: 'Clothing',
    description: 'Provides basic head warmth and wind protection.',
    weight: 0.1,
    condition: 100,
    stackable: false
  },
  {
    id: 'wool-mittens',
    name: 'Wool Mittens',
    category: 'Clothing',
    description: 'Provides basic hand warmth and wind protection.',
    weight: 0.15,
    condition: 100,
    stackable: false
  },
  {
    id: 'wool-scarf',
    name: 'Wool Scarf',
    category: 'Clothing',
    description: 'Provides basic neck warmth and wind protection.',
    weight: 0.2,
    condition: 100,
    stackable: false
  },
  {
    id: 'long-underwear',
    name: 'Long Underwear',
    category: 'Clothing',
    description: 'Base layer that provides warmth and reduces wind chill.',
    weight: 0.25,
    condition: 100,
    stackable: false
  },
  {
    id: 'combat-boots',
    name: 'Combat Boots',
    category: 'Clothing',
    description: 'Durable boots with good warmth and protection.',
    weight: 1.0,
    condition: 100,
    stackable: false
  },
  {
    id: 'work-boots',
    name: 'Work Boots',
    category: 'Clothing',
    description: 'Basic boots with moderate protection.',
    weight: 0.75,
    condition: 100,
    stackable: false
  },
  {
    id: 'expedition-parka',
    name: 'Expedition Parka',
    category: 'Clothing',
    description: 'Heavy-duty coat with excellent warmth and protection.',
    weight: 2.0,
    condition: 100,
    stackable: false
  },
  // First Aid
  {
    id: 'bandage',
    name: 'Bandage',
    category: 'First Aid',
    description: 'Used to treat blood loss.',
    weight: 0.05,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'antibiotic',
    name: 'Antibiotic',
    category: 'First Aid',
    description: 'Used to treat infections.',
    weight: 0.1,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'painkillers',
    name: 'Painkillers',
    category: 'First Aid',
    description: 'Reduces pain and restores some condition.',
    weight: 0.1,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'first-aid-kit',
    name: 'First Aid Kit',
    category: 'First Aid',
    description: 'Comprehensive medical supplies for treating various conditions.',
    weight: 0.5,
    stackable: true,
    maxStack: 5
  },
  {
    id: 'old-bandage',
    name: 'Old Bandage',
    category: 'First Aid',
    description: 'Used bandage. Can be sterilized with disinfectant.',
    weight: 0.05,
    stackable: true,
    maxStack: 10
  },
  // Materials
  {
    id: 'wood',
    name: 'Wood',
    category: 'Material',
    description: 'Used for fires and crafting.',
    weight: 0.5,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'cloth',
    name: 'Cloth',
    category: 'Material',
    description: 'Used for crafting and repairs.',
    weight: 0.1,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'paper',
    name: 'Paper',
    category: 'Material',
    description: 'Used for starting fires.',
    weight: 0.05,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'coal',
    name: 'Coal',
    category: 'Material',
    description: 'Long-burning fuel for fires.',
    weight: 1.0,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'gut',
    name: 'Gut',
    category: 'Material',
    description: 'Harvested from wildlife. Used for crafting.',
    weight: 0.5,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'leather',
    name: 'Leather',
    category: 'Material',
    description: 'Harvested from wildlife. Used for crafting and repairs.',
    weight: 0.5,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'steel',
    name: 'Steel',
    category: 'Material',
    description: 'Salvaged metal. Used for crafting and repairs.',
    weight: 1.0,
    stackable: true,
    maxStack: 20
  },
  // Fire Starting
  {
    id: 'matches',
    name: 'Matches',
    category: 'Fire Starting',
    description: 'Basic fire starter. Single use per match.',
    weight: 0.05,
    stackable: true,
    maxStack: 20
  },
  {
    id: 'fire-striker',
    name: 'Fire Striker',
    category: 'Fire Starting',
    description: 'Reusable fire starting tool.',
    weight: 0.2,
    condition: 100,
    stackable: false
  },
  {
    id: 'magnifying-lens',
    name: 'Magnifying Lens',
    category: 'Fire Starting',
    description: 'Starts fires using sunlight during the day.',
    weight: 0.1,
    stackable: false
  },
  {
    id: 'flare',
    name: 'Flare',
    category: 'Fire Starting',
    description: 'Emergency light and heat source. Deters predators.',
    weight: 0.2,
    stackable: true,
    maxStack: 10
  },
  {
    id: 'torch',
    name: 'Torch',
    category: 'Fire Starting',
    description: 'Provides light and heat. Can deter predators.',
    weight: 0.5,
    condition: 100,
    stackable: false
  }
]
