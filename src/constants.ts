import type { CrewMember } from './types'

export const CREW: CrewMember[] = [
  { emoji: '🏴‍☠️', name: 'Captain Vance', role: 'Captain', color: '#ef4444', quote: "Adventure calls, Mark Jay! Let's go!" },
  { emoji: '⚔️', name: 'Ryoku', role: 'Swordsman', color: '#3b82f6', quote: 'Strength is earned, never given.' },
  { emoji: '🧭', name: 'Sera', role: 'Navigator', color: '#f59e0b', quote: "I've charted the course. Trust me." },
  { emoji: '🎯', name: 'Bolt', role: 'Sniper', color: '#10b981', quote: "Ha! Even I can't miss from here!" },
  { emoji: '🍳', name: 'Sanji-kai', role: 'Cook', color: '#f97316', quote: 'Eat well, fight better!' },
  { emoji: '🩺', name: 'Doc Mira', role: 'Doctor', color: '#8b5cf6', quote: "I'll keep you fighting fit!" },
  { emoji: '📜', name: 'Rhea', role: 'Archaeologist', color: '#ec4899', quote: 'Every ruin holds a secret.' },
  { emoji: '🔨', name: 'Stein', role: 'Shipwright', color: '#78716c', quote: "Ship's holding! Now get moving!" },
  { emoji: '🎻', name: 'Lyra', role: 'Musician', color: '#06b6d4', quote: '♪ Every hero needs a theme! ♪' },
  { emoji: '🌊', name: 'Tidus', role: 'Helmsman', color: '#0ea5e9', quote: 'The sea bows to those with courage.' },
]

export const RELICS = [
  { key: 'compass' as const, emoji: '🧭', name: "Navigator's Compass", stage: 1, color: '#f59e0b' },
  { key: 'crest' as const, emoji: '⚔️', name: "Swordsman's Crest", stage: 2, color: '#3b82f6' },
  { key: 'feast' as const, emoji: '🍖', name: 'Feast Token', stage: 3, color: '#ef4444' },
  { key: 'fruit' as const, emoji: '🍎', name: 'Legendary Fruit Emblem', stage: 4, color: '#8b5cf6' },
]
