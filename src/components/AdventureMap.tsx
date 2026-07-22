import { motion } from 'framer-motion'
import type { GameState, Screen } from '../types'
import { RELICS } from '../constants'

interface Props {
  gameState: GameState
  onNavigate: (screen: Screen) => void
}

const ISLANDS = [
  { id: 'mini1', label: 'Grand Line', emoji: '🌊', x: 18, y: 65, screen: 'mini1' as Screen, relicKey: 'compass', locked: false },
  { id: 'mini2', label: 'Sword Isle', emoji: '⚔️', x: 42, y: 40, screen: 'mini2' as Screen, relicKey: 'crest', locked: true },
  { id: 'mini3', label: "Feast Cove", emoji: '🍖', x: 68, y: 60, screen: 'mini3' as Screen, relicKey: 'feast', locked: true },
  { id: 'mini4', label: 'Fruit Isle', emoji: '🍎', x: 78, y: 25, screen: 'mini4' as Screen, relicKey: 'fruit', locked: true },
  { id: 'final', label: 'Treasure Island', emoji: '🏝', x: 50, y: 15, screen: 'finalIsland' as Screen, relicKey: null, locked: true },
]

export default function AdventureMap({ gameState, onNavigate }: Props) {
  const relicsCollected = Object.values(gameState.relics).filter(Boolean).length
  const allRelics = relicsCollected === 4

  function isIslandUnlocked(island: typeof ISLANDS[0]) {
    if (!island.locked) return true
    if (island.id === 'mini2') return gameState.relics.compass
    if (island.id === 'mini3') return gameState.relics.crest
    if (island.id === 'mini4') return gameState.relics.feast
    if (island.id === 'final') return allRelics
    return false
  }

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(180deg, #0277bd 0%, #0288d1 40%, #039be5 70%, #29b6f6 100%)' }}>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h2 className="text-white font-black text-lg" style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            🗺 Grand Ocean Map
          </h2>
          <p className="text-blue-200 text-xs">Navigator: Mark Jay</p>
        </div>
        <div className="flex gap-1">
          {RELICS.map(r => (
            <div key={r.key}
              className="w-8 h-8 rounded-full flex items-center justify-center text-lg border-2"
              style={{
                background: gameState.relics[r.key] ? r.color : 'rgba(0,0,0,0.3)',
                borderColor: gameState.relics[r.key] ? r.color : 'rgba(255,255,255,0.2)',
                boxShadow: gameState.relics[r.key] ? `0 0 12px ${r.color}` : 'none',
              }}
            >
              {gameState.relics[r.key] ? r.emoji : '🔒'}
            </div>
          ))}
        </div>
      </div>

      {/* Map area */}
      <div className="relative flex-1 mx-3 mb-3 rounded-2xl overflow-hidden"
        style={{ border: '2px solid rgba(255,255,255,0.2)', background: 'linear-gradient(135deg, #006994 0%, #0077a8 50%, #0288d1 100%)' }}>

        {/* Animated waves */}
        {[0,1,2].map(i => (
          <motion.div key={i}
            className="absolute left-0 right-0"
            style={{ bottom: i * 25, height: 3, background: `rgba(255,255,255,${0.05 + i*0.03})`, borderRadius: 2 }}
            animate={{ x: [0, i%2===0 ? 20:-20, 0], scaleX: [1,1.05,1] }}
            transition={{ duration: 3+i, repeat: Infinity }}
          />
        ))}

        {/* Clouds */}
        {[{x:10,y:8},{x:55,y:5},{x:80,y:12}].map((c,i) => (
          <motion.div key={i}
            className="absolute text-4xl select-none"
            style={{ left:`${c.x}%`, top:`${c.y}%`, opacity: 0.7 }}
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 6+i*2, repeat: Infinity }}
          >☁️</motion.div>
        ))}

        {/* Sea monster */}
        <motion.div className="absolute text-3xl select-none" style={{ left:'30%', bottom:'30%' }}
          animate={{ y:[0,-8,0], rotate:[-5,5,-5] }}
          transition={{ duration: 3, repeat: Infinity }}>🐉</motion.div>

        {/* Route lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents:'none' }}>
          <line x1="18%" y1="65%" x2="42%" y2="40%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="42%" y1="40%" x2="68%" y2="60%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="68%" y1="60%" x2="78%" y2="25%" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="6 4" />
          <line x1="78%" y1="25%" x2="50%" y2="15%" stroke="rgba(255,215,0,0.6)" strokeWidth="2" strokeDasharray="6 4" />
        </svg>

        {/* Islands */}
        {ISLANDS.map(island => {
          const unlocked = isIslandUnlocked(island)
          const relicDone = island.relicKey ? gameState.relics[island.relicKey as keyof GameState['relics']] : false
          return (
            <motion.button
              key={island.id}
              className="absolute flex flex-col items-center cursor-pointer border-0 bg-transparent outline-none"
              style={{ left: `${island.x}%`, top: `${island.y}%`, transform: 'translate(-50%,-50%)' }}
              whileTap={unlocked ? { scale: 0.9 } : {}}
              animate={unlocked && !relicDone ? { y:[0,-4,0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              onClick={() => unlocked && onNavigate(island.screen)}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl border-3"
                  style={{
                    background: unlocked ? (relicDone ? 'rgba(34,197,94,0.8)' : 'rgba(245,158,11,0.85)') : 'rgba(0,0,0,0.4)',
                    borderColor: unlocked ? (relicDone ? '#22c55e' : '#f59e0b') : 'rgba(255,255,255,0.2)',
                    border: '3px solid',
                    boxShadow: unlocked ? `0 0 20px ${relicDone ? '#22c55e' : '#f59e0b'}88` : 'none',
                  }}>
                  {relicDone ? '✅' : unlocked ? island.emoji : '🔒'}
                </div>
                {unlocked && !relicDone && (
                  <motion.div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500"
                    animate={{ scale:[1,1.3,1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                )}
              </div>
              <span className="text-white text-xs font-bold mt-1 text-center leading-tight"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)', maxWidth: 60 }}>
                {island.label}
              </span>
            </motion.button>
          )
        })}

        {/* Pirate ship (player marker) */}
        <motion.div className="absolute text-3xl select-none" style={{ left:'8%', bottom:'55%' }}
          animate={{ y:[0,-6,0], rotate:[-2,2,-2] }}
          transition={{ duration: 2, repeat: Infinity }}>
          ⛵
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="mx-3 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-blue-200 text-xs">Voyage Progress</span>
          <span className="text-yellow-300 text-xs font-bold">{relicsCollected}/4 Relics</span>
        </div>
        <div className="h-2 rounded-full bg-blue-900">
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)', width: `${(relicsCollected/4)*100}%` }}
            animate={{ width: `${(relicsCollected/4)*100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}
