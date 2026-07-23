import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GameState, Screen } from './types'
import SplashScreen from './components/SplashScreen'
import AdventureMap from './components/AdventureMap'
import MiniGame1Navigation from './components/MiniGame1Navigation'
import MiniGame2Swords from './components/MiniGame2Swords'
import MiniGame3Feast from './components/MiniGame3Feast'
import MiniGame4DevilFruit from './components/MiniGame4DevilFruit'
import FinalIsland from './components/FinalIsland'
import BirthdayReveal from './components/BirthdayReveal'
import CrewCharacters from './components/CrewCharacters'

const INITIAL_STATE: GameState = {
  screen: 'splash',
  relics: { compass: false, crest: false, feast: false, fruit: false },
  score: 0,
}

function loadState(): GameState {
  try {
    const saved = localStorage.getItem('markjay-voyage')
    if (saved) return { ...INITIAL_STATE, ...JSON.parse(saved) }
  } catch {}
  return INITIAL_STATE
}

function saveState(s: GameState) {
  try { localStorage.setItem('markjay-voyage', JSON.stringify(s)) } catch {}
}

const PAGE_VARIANTS = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(loadState)

  useEffect(() => { saveState(gameState) }, [gameState])

  const navigate = useCallback((screen: Screen) => {
    setGameState(prev => ({ ...prev, screen }))
  }, [])

  const collectRelic = useCallback((key: keyof GameState['relics']) => {
    setGameState(prev => {
      const next = { ...prev, relics: { ...prev.relics, [key]: true }, screen: 'map' as Screen }
      return next
    })
  }, [])

  const restart = useCallback(() => {
    const fresh = INITIAL_STATE
    saveState(fresh)
    setGameState(fresh)
  }, [])

  const screen = gameState.screen

  return (
    <div style={{ width: '100vw', minHeight: '100vh', height: '100%', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)' }}>
      {/* Mobile-portrait container */}
      <div style={{
        width: '100%',
        minHeight: '100%',
        height: '100%',
        maxWidth: 430,
        maxHeight: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#000',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            variants={PAGE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {screen === 'splash' && (
              <>
                <SplashScreen onStart={() => navigate('map')} />
                <CrewCharacters scene="splash" />
              </>
            )}
            {screen === 'map' && (
              <>
                <AdventureMap gameState={gameState} onNavigate={navigate} />
                <CrewCharacters scene="map" />
              </>
            )}
            {screen === 'mini1' && (
              <>
                <MiniGame1Navigation
                  onWin={() => collectRelic('compass')}
                  onBack={() => navigate('map')}
                />
                <CrewCharacters scene="mini1" />
              </>
            )}
            {screen === 'mini2' && (
              <>
                <MiniGame2Swords
                  onWin={() => collectRelic('crest')}
                  onBack={() => navigate('map')}
                />
                <CrewCharacters scene="mini2" />
              </>
            )}
            {screen === 'mini3' && (
              <>
                <MiniGame3Feast
                  onWin={() => collectRelic('feast')}
                  onBack={() => navigate('map')}
                />
                <CrewCharacters scene="mini3" />
              </>
            )}
            {screen === 'mini4' && (
              <>
                <MiniGame4DevilFruit
                  onWin={() => collectRelic('fruit')}
                  onBack={() => navigate('map')}
                />
                <CrewCharacters scene="mini4" />
              </>
            )}
            {screen === 'finalIsland' && (
              <>
                <FinalIsland
                  gameState={gameState}
                  onReveal={() => navigate('birthdayReveal')}
                  onBack={() => navigate('map')}
                />
                <CrewCharacters scene="final" />
              </>
            )}
            {screen === 'birthdayReveal' && (
              <>
                <BirthdayReveal onRestart={restart} />
                <CrewCharacters scene="birthday" />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
