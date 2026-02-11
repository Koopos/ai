export interface Pet {
  id: string;
  owner: string;
  name: string;
  uri: string;
  strength: number;
  agility: number;
  intelligence: number;
  rarity: number; // 1=普通, 2=稀有, 3=史诗, 4=传说
  level: number;
  experience: number;
  hunger: number;
  happiness: number;
  birthTime: number;
  lastFedTime: number;
  isAlive: boolean;
  breedCount: number;
  parent1?: string;
  parent2?: string;
}

export interface AttributeBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

export interface PetCardProps {
  pet: Pet;
  onFeed: () => void;
  onTrain: (attribute: 'strength' | 'agility' | 'intelligence') => void;
  getRarityColor: (rarity: number) => string;
  getRarityName: (rarity: number) => string;
}
