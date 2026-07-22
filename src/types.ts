export type Screen =
  | 'splash'
  | 'map'
  | 'mini1'
  | 'mini2'
  | 'mini3'
  | 'mini4'
  | 'finalIsland'
  | 'birthdayReveal'

export interface GameState {
  screen: Screen
  relics: {
    compass: boolean
    crest: boolean
    feast: boolean
    fruit: boolean
  }
  score: number
}

export interface CrewMember {
  emoji: string
  name: string
  role: string
  color: string
  quote: string
}
