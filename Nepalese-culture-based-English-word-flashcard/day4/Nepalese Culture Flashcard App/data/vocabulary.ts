export interface VocabularyItem {
  id: string;
  english: string;
  nepali: string;
  nepaliRoman: string;
  meaning: string;
  category: string;
  imageQuery: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'daily-life',
    name: 'Daily Life',
    icon: '🏠',
    color: 'bg-blue-100 text-blue-800',
    description: 'Things we use every day'
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🥟',
    color: 'bg-red-100 text-red-800',
    description: 'Delicious Nepali foods'
  },
  {
    id: 'festivals',
    name: 'Festivals',
    icon: '🎉',
    color: 'bg-purple-100 text-purple-800',
    description: 'Special celebrations'
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🏔️',
    color: 'bg-green-100 text-green-800',
    description: 'Mountains and animals'
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: '🚌',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Ways to travel'
  }
];

export const vocabulary: VocabularyItem[] = [
  // Daily Life
  {
    id: 'doko',
    english: 'Basket',
    nepali: 'डोको',
    nepaliRoman: 'doko',
    meaning: 'A woven basket used to carry things',
    category: 'daily-life',
    imageQuery: 'nepal traditional basket woven'
  },
  {
    id: 'topi',
    english: 'Cap',
    nepali: 'टोपी',
    nepaliRoman: 'topi',
    meaning: 'Traditional Nepali hat worn by men',
    category: 'daily-life',
    imageQuery: 'nepal traditional topi hat'
  },
  {
    id: 'nanglo',
    english: 'Winnowing tray',
    nepali: 'नाङ्ग्लो',
    nepaliRoman: 'nanglo',
    meaning: 'Round tray used to clean rice',
    category: 'daily-life',
    imageQuery: 'nepal winnowing tray nanglo'
  },
  
  // Food & Drink
  {
    id: 'momo',
    english: 'Dumpling',
    nepali: 'मोमो',
    nepaliRoman: 'momo',
    meaning: 'Steamed dumplings with filling',
    category: 'food',
    imageQuery: 'nepal momo dumpling food'
  },
  {
    id: 'sel-roti',
    english: 'Ring bread',
    nepali: 'सेल रोटी',
    nepaliRoman: 'sel roti',
    meaning: 'Traditional ring-shaped sweet bread',
    category: 'food',
    imageQuery: 'nepal sel roti ring bread'
  },
  {
    id: 'chiya',
    english: 'Tea',
    nepali: 'चिया',
    nepaliRoman: 'chiya',
    meaning: 'Hot drink made with tea leaves',
    category: 'food',
    imageQuery: 'nepal tea chiya traditional'
  },
  
  // Festivals
  {
    id: 'tika',
    english: 'Blessing mark',
    nepali: 'टीका',
    nepaliRoman: 'tika',
    meaning: 'Colorful mark put on forehead for blessing',
    category: 'festivals',
    imageQuery: 'nepal tika blessing mark forehead'
  },
  {
    id: 'diya',
    english: 'Oil lamp',
    nepali: 'दिया',
    nepaliRoman: 'diya',
    meaning: 'Small clay lamp lit during festivals',
    category: 'festivals',
    imageQuery: 'nepal diya oil lamp clay'
  },
  
  // Nature
  {
    id: 'himal',
    english: 'Mountain',
    nepali: 'हिमाल',
    nepaliRoman: 'himal',
    meaning: 'Very tall mountain with snow',
    category: 'nature',
    imageQuery: 'nepal himalaya mountain snow'
  },
  {
    id: 'rhododendron',
    english: 'Rhododendron',
    nepali: 'लालीगुराँस',
    nepaliRoman: 'lali gurans',
    meaning: 'National flower of Nepal',
    category: 'nature',
    imageQuery: 'nepal rhododendron flower red'
  },
  
  // Transport
  {
    id: 'rickshaw',
    english: 'Rickshaw',
    nepali: 'रिक्सा',
    nepaliRoman: 'riksa',
    meaning: 'Three-wheeled vehicle for passengers',
    category: 'transport',
    imageQuery: 'nepal rickshaw three wheel vehicle'
  },
  {
    id: 'tempo',
    english: 'Shared taxi',
    nepali: 'टेम्पो',
    nepaliRoman: 'tempo',
    meaning: 'Small shared vehicle for many people',
    category: 'transport',
    imageQuery: 'nepal tempo shared taxi vehicle'
  }
];

export const getVocabularyByCategory = (categoryId: string): VocabularyItem[] => {
  return vocabulary.filter(item => item.category === categoryId);
};

export const badges = [
  { id: 'daily-explorer', name: 'Daily Explorer', icon: '🏠', description: 'Learned all daily life words!' },
  { id: 'food-master', name: 'Food Master', icon: '🥟', description: 'Mastered Nepali foods!' },
  { id: 'festival-friend', name: 'Festival Friend', icon: '🎉', description: 'Knows all festivals!' },
  { id: 'nature-lover', name: 'Nature Lover', icon: '🏔️', description: 'Explored nature words!' },
  { id: 'travel-buddy', name: 'Travel Buddy', icon: '🚌', description: 'Transport expert!' }
];