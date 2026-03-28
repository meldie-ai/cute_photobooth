export type LayoutType = 'classic-strip' | 'wide-strip' | 'grid-2x2' | 'grid-2x3' | 'single' | 'triptych';

export type ThemeType = 
  | 'classic-white' 
  | 'black-film' 
  | 'pastel-pink' 
  | 'retro-yellow' 
  | 'dark-moody' 
  | 'party-confetti' 
  | 'botanical' 
  | 'minimal'
  | 'cat-ears'
  | 'dog-paws'
  | 'bunny'
  | 'panda'
  | 'frog';

export type FilterType = 
  | 'none' 
  | 'bw' 
  | 'warm' 
  | 'cool' 
  | 'faded' 
  | 'vivid' 
  | 'soft-focus' 
  | 'noir';

/** Corner sticker overlays (canvas-drawn), matching the vanilla cute photobooth */
export type StickerFrameType = 'none' | 'flower' | 'star' | 'heart';

/** One-tap filters shown on capture (Normal / B&W / Warm / Cool) */
export const QUICK_FILTER_IDS: FilterType[] = ['none', 'bw', 'warm', 'cool'];

export const STICKER_FRAME_OPTIONS: { id: StickerFrameType; label: string; emoji: string }[] = [
  { id: 'none', label: 'No stickers', emoji: '✨' },
  { id: 'flower', label: 'Flower', emoji: '🌸' },
  { id: 'star', label: 'Stars', emoji: '⭐' },
  { id: 'heart', label: 'Hearts', emoji: '💖' },
];

export type CountdownDuration = 3 | 5 | 10;

export interface Layout {
  id: LayoutType;
  name: string;
  description: string;
  cols: number;
  rows: number;
  slots: number;
}

export interface Theme {
  id: ThemeType;
  name: string;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  borderWidth: number;
  hasCornerDecor: boolean;
  cornerDecorType?: 'hearts' | 'leaves' | 'scalloped' | 'rule' | 'cat' | 'dog' | 'bunny' | 'panda' | 'frog';
  labelStyle?: 'kodak' | 'date' | 'none';
  isAnimalTheme?: boolean;
}

export interface Filter {
  id: FilterType;
  name: string;
  cssFilter: string;
}

export interface Sticker {
  id: string;
  content: string;
  x: number;
  y: number;
  size: number;
}

export const STICKERS = {
  symbols: ['★', '♥', '✦', '✿', '☁', '✌'],
  text: ['LOL', 'BFF', 'CUTE', 'OMG', 'XOXO'],
  seasonal: ['☃', '☀', '🎃', '🎄'],
};

export const LAYOUTS: Layout[] = [
  { id: 'classic-strip', name: 'Classic Strip', description: '4 shots vertical (1×4)', cols: 1, rows: 4, slots: 4 },
  { id: 'wide-strip', name: 'Wide Strip', description: '3 shots vertical (1×3)', cols: 1, rows: 3, slots: 3 },
  { id: 'grid-2x2', name: 'Grid 2×2', description: '4 shots in a grid', cols: 2, rows: 2, slots: 4 },
  { id: 'grid-2x3', name: 'Grid 2×3', description: '6 shots in a grid', cols: 2, rows: 3, slots: 6 },
  { id: 'single', name: 'Single Frame', description: '1 large shot', cols: 1, rows: 1, slots: 1 },
  { id: 'triptych', name: 'Triptych', description: '3 shots horizontal (3×1)', cols: 3, rows: 1, slots: 3 },
];

export const THEMES: Theme[] = [
  { 
    id: 'classic-white', 
    name: 'Classic White', 
    borderColor: '#ffffff', 
    backgroundColor: '#ffffff', 
    textColor: '#333333',
    borderWidth: 20,
    hasCornerDecor: false,
    labelStyle: 'date'
  },
  { 
    id: 'black-film', 
    name: 'Black Film', 
    borderColor: '#1a1a1a', 
    backgroundColor: '#1a1a1a', 
    textColor: '#f5a623',
    borderWidth: 24,
    hasCornerDecor: false,
    labelStyle: 'kodak'
  },
  { 
    id: 'pastel-pink', 
    name: 'Pastel Pink', 
    borderColor: '#ffd1dc', 
    backgroundColor: '#fff0f3', 
    textColor: '#d4768f',
    borderWidth: 18,
    hasCornerDecor: true,
    cornerDecorType: 'hearts',
    labelStyle: 'date'
  },
  { 
    id: 'retro-yellow', 
    name: 'Retro Yellow', 
    borderColor: '#ffd93d', 
    backgroundColor: '#fff8e1', 
    textColor: '#8b6914',
    borderWidth: 18,
    hasCornerDecor: true,
    cornerDecorType: 'scalloped',
    labelStyle: 'date'
  },
  { 
    id: 'dark-moody', 
    name: 'Dark Moody', 
    borderColor: '#2d2d2d', 
    backgroundColor: '#1a1a1a', 
    textColor: '#888888',
    borderWidth: 16,
    hasCornerDecor: true,
    cornerDecorType: 'rule',
    labelStyle: 'date'
  },
  { 
    id: 'party-confetti', 
    name: 'Party Confetti', 
    borderColor: '#ff6b6b', 
    backgroundColor: '#ffffff', 
    textColor: '#ff6b6b',
    borderWidth: 20,
    hasCornerDecor: false,
    labelStyle: 'date'
  },
  { 
    id: 'botanical', 
    name: 'Botanical', 
    borderColor: '#e8f5e9', 
    backgroundColor: '#fafafa', 
    textColor: '#4a7c59',
    borderWidth: 22,
    hasCornerDecor: true,
    cornerDecorType: 'leaves',
    labelStyle: 'date'
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    borderColor: '#f5f5f5', 
    backgroundColor: '#ffffff', 
    textColor: '#cccccc',
    borderWidth: 40,
    hasCornerDecor: false,
    labelStyle: 'none'
  },
  // Animal themes
  { 
    id: 'cat-ears', 
    name: 'Cat Ears', 
    borderColor: '#ffd1dc', 
    backgroundColor: '#fff5f7', 
    textColor: '#d4768f',
    borderWidth: 24,
    hasCornerDecor: true,
    cornerDecorType: 'cat',
    labelStyle: 'date',
    isAnimalTheme: true
  },
  { 
    id: 'dog-paws', 
    name: 'Dog Paws', 
    borderColor: '#d4a574', 
    backgroundColor: '#fdf6ee', 
    textColor: '#8b5a2b',
    borderWidth: 24,
    hasCornerDecor: true,
    cornerDecorType: 'dog',
    labelStyle: 'date',
    isAnimalTheme: true
  },
  { 
    id: 'bunny', 
    name: 'Bunny', 
    borderColor: '#e6d5f2', 
    backgroundColor: '#faf5ff', 
    textColor: '#9b7bb8',
    borderWidth: 24,
    hasCornerDecor: true,
    cornerDecorType: 'bunny',
    labelStyle: 'date',
    isAnimalTheme: true
  },
  { 
    id: 'panda', 
    name: 'Panda', 
    borderColor: '#e0e0e0', 
    backgroundColor: '#ffffff', 
    textColor: '#333333',
    borderWidth: 24,
    hasCornerDecor: true,
    cornerDecorType: 'panda',
    labelStyle: 'date',
    isAnimalTheme: true
  },
  { 
    id: 'frog', 
    name: 'Frog', 
    borderColor: '#90ee90', 
    backgroundColor: '#f0fff0', 
    textColor: '#228b22',
    borderWidth: 24,
    hasCornerDecor: true,
    cornerDecorType: 'frog',
    labelStyle: 'date',
    isAnimalTheme: true
  },
];

export const FILTERS: Filter[] = [
  { id: 'none', name: 'None', cssFilter: 'none' },
  { id: 'bw', name: 'B&W', cssFilter: 'grayscale(100%)' },
  { id: 'warm', name: 'Warm', cssFilter: 'sepia(30%) saturate(120%)' },
  { id: 'cool', name: 'Cool', cssFilter: 'saturate(90%) hue-rotate(10deg) brightness(105%)' },
  { id: 'faded', name: 'Faded', cssFilter: 'contrast(90%) brightness(110%) saturate(80%)' },
  { id: 'vivid', name: 'Vivid', cssFilter: 'saturate(150%) contrast(110%)' },
  { id: 'soft-focus', name: 'Soft Focus', cssFilter: 'blur(0.5px) brightness(105%)' },
  { id: 'noir', name: 'Noir', cssFilter: 'grayscale(100%) contrast(130%)' },
];
