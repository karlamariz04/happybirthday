import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RELICS } from '../constants'
import type { GameState } from '../types'

interface Props {
  gameState: GameState
  onReveal: () => void
  onBack: () => void
}

const CREW_CELEBRATION = [
  { emoji: '🏴‍☠️', name: 'Vance', color: '#ef4444' },
  { emoji: '⚔️', name: 'Ryoku', color: '#3b82f6' },
  { emoji: '🧭', name: 'Sera', color: '#f59e0b' },
  { emoji: '🎯', name: 'Bolt', color: '#10b981' },
  { emoji: '🍳', name: 'Sanji-kai', color: '#f97316' },
]

export default function FinalIsland({ gameState, onReveal, onBack }: Props) {
  const [phase, setPhase] = useState<'approach'|'pedestals'|'shaking'|'beams'|'celebrate'>('approach')
  const [insertedRelics, setInsertedRelics] = useState<string[]>([])
  const [shaking, setShaking] = useState(false)


  function insertRelic(key: string) {
    if (insertedRelics.includes(key)) return
    setInsertedRelics(prev => {
      const next = [...prev, key]
      if (next.length === 4) {
        setTimeout(() => setPhase('shaking'), 600)
        setTimeout(() => setShaking(true), 600)
        setTimeout(() => { setShaking(false); setPhase('beams') }, 2500)
        setTimeout(() => setPhase('celebrate'), 4000)
      }
      return next
    })
  }

  useEffect(() => {
    if (phase === 'approach') {
      const t = setTimeout(() => setPhase('pedestals'), 2000)
      return () => clearTimeout(t)
    }
  }, [phase])

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #0c1445 0%, #1a237e 40%, #283593 70%, #1565c0 100%)' }}
      animate={shaking ? { x: [-4,4,-4,4,0], y: [-2,2,-2,2,0] } : {}}
      transition={{ duration: 0.3, repeat: shaking ? Infinity : 0 }}>

      {/* Stars */}
      {Array.from({length:30}).map((_,i) => (
        <motion.div key={i} className="absolute rounded-full bg-white"
          style={{ width: 2, height: 2, left:`${Math.random()*100}%`, top:`${Math.random()*40}%` }}
          animate={{opacity:[0.2,1,0.2]}} transition={{duration:1.5+Math.random()*2, repeat:Infinity, delay:Math.random()*2}} />
      ))}

      {/* Golden beams */}
      <AnimatePresence>
        {phase === 'beams' || phase === 'celebrate' ? (
          <>
            {[0,1,2,3,4,5,6,7].map(i => (
              <motion.div key={i}
                initial={{ scaleY:0, opacity:0 }}
                animate={{ scaleY:1, opacity:[0,0.8,0.4] }}
                transition={{ duration:0.5, delay:i*0.1 }}
                className="absolute bottom-1/3 pointer-events-none"
                style={{
                  width: 6, height: '60%',
                  background: 'linear-gradient(180deg, transparent, rgba(255,215,0,0.8), transparent)',
                  transformOrigin: 'bottom',
                  transform: `rotate(${i*45}deg)`,
                  left: '50%', marginLeft: -3,
                }} />
            ))}
          </>
        ) : null}
      </AnimatePresence>

      {/* Fireworks */}
      <AnimatePresence>
        {phase === 'celebrate' && (
          <>
            {[...Array(12)].map((_,i) => (
              <motion.div key={i}
                className="absolute text-2xl pointer-events-none"
                initial={{ scale:0, opacity:1, x:0, y:0 }}
                animate={{ scale:[0,1,0.5], opacity:[1,1,0], x: Math.cos(i/12*Math.PI*2)*120, y: Math.sin(i/12*Math.PI*2)*120 - 80 }}
                transition={{ duration:1.5, delay:i*0.1, repeat:Infinity, repeatDelay:1 }}
                style={{ left:'50%', top:'30%' }}>
                {['🎆','🎇','✨','🌟','💫','⭐'][i%6]}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {phase === 'celebrate' && (
          <>
            {[...Array(20)].map((_,i) => (
              <motion.div key={i}
                className="absolute text-lg pointer-events-none"
                initial={{ y:-20, x:`${Math.random()*100}%`, opacity:1, rotate:0 }}
                animate={{ y:'110vh', opacity:[1,1,0], rotate:360*3 }}
                transition={{ duration:3+Math.random()*2, delay:Math.random()*2, repeat:Infinity }}
                style={{ left:`${Math.random()*100}%`, top:0 }}>
                {['🌸','🎊','🎉','⭐','💛','🌟'][i%6]}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === 'approach' && (
          <motion.div key="approach" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.div className="text-7xl mb-4" animate={{y:[0,-10,0]}} transition={{duration:2,repeat:Infinity}}>🏝</motion.div>
            <h2 className="text-2xl font-black text-yellow-300" style={{fontFamily:'Georgia,serif'}}>Treasure Island!</h2>
            <p className="text-blue-200 text-sm mt-3">The legendary island rises from the mist...</p>
            <motion.div className="mt-4 flex gap-2" animate={{opacity:[0.5,1,0.5]}} transition={{duration:1.5,repeat:Infinity}}>
              <span className="text-white text-sm">Approaching</span>
              <span className="text-yellow-300">●●●</span>
            </motion.div>
          </motion.div>
        )}

        {phase === 'pedestals' && (
          <motion.div key="pedestals" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="relative z-10 flex flex-col items-center px-4 w-full text-center">

            {/* Treasure chest */}
            <motion.div className="text-8xl mb-4" animate={{y:[0,-6,0]}} transition={{duration:2,repeat:Infinity}}>
              🏛️
            </motion.div>
            <h2 className="text-xl font-black text-yellow-300 mb-1" style={{fontFamily:'Georgia,serif'}}>The Sacred Pedestals</h2>
            <p className="text-blue-200 text-xs mb-5">Insert the four relics to open the treasure!</p>

            {/* Pedestals */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-6">
              {RELICS.map(relic => {
                const inserted = insertedRelics.includes(relic.key)
                const hasRelic = gameState.relics[relic.key]
                return (
                  <motion.button key={relic.key}
                    whileTap={hasRelic && !inserted ? {scale:0.9} : {}}
                    onClick={() => hasRelic && insertRelic(relic.key)}
                    disabled={inserted || !hasRelic}
                    className="flex flex-col items-center py-4 px-3 rounded-2xl border-2 cursor-pointer outline-none"
                    style={{
                      background: inserted ? relic.color+'33' : 'rgba(255,255,255,0.05)',
                      borderColor: inserted ? relic.color : 'rgba(255,255,255,0.2)',
                      boxShadow: inserted ? `0 0 20px ${relic.color}66` : 'none',
                    }}
                    animate={inserted ? {scale:[1,1.05,1]} : {}}
                    transition={{duration:0.5}}>
                    <span className="text-3xl mb-1">{inserted ? relic.emoji : hasRelic ? relic.emoji : '🔒'}</span>
                    <span className="text-xs font-bold" style={{color: inserted ? relic.color : 'rgba(255,255,255,0.5)'}}>
                      {inserted ? '✅ Placed!' : hasRelic ? 'Tap to insert' : 'Missing'}
                    </span>
                    <span className="text-white text-xs mt-1 leading-tight text-center">{relic.name}</span>
                  </motion.button>
                )
              })}
            </div>

            <button onClick={onBack} className="text-blue-300 text-sm bg-transparent border-0 cursor-pointer">← Back to Map</button>
          </motion.div>
        )}

        {(phase === 'shaking' || phase === 'beams') && (
          <motion.div key="shaking" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.div className="text-8xl mb-4"
              animate={{scale:[1,1.1,1], rotate:[-2,2,-2]}}
              transition={{duration:0.3, repeat:Infinity}}>
              🏛️
            </motion.div>
            <h2 className="text-2xl font-black text-yellow-300 mb-2" style={{fontFamily:'Georgia,serif'}}>
              {phase === 'shaking' ? 'The Island Shakes!' : 'Golden Beams Rise!'}
            </h2>
            <motion.p className="text-white" animate={{opacity:[0.5,1,0.5]}} transition={{duration:0.5,repeat:Infinity}}>
              {phase === 'shaking' ? 'The ancient magic awakens...' : 'The treasure awaits Mark Jay...'}
            </motion.p>
          </motion.div>
        )}

        {phase === 'celebrate' && (
          <motion.div key="celebrate" initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
            className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.div className="text-8xl mb-4"
              animate={{scale:[1,1.2,1]}}
              transition={{duration:1, repeat:Infinity}}>
              🪙
            </motion.div>
            <h2 className="text-2xl font-black text-yellow-300 mb-2" style={{fontFamily:'Georgia,serif'}}>The Treasure Chest!</h2>
            <p className="text-white text-sm mb-4">The crew gathers around you, Mark Jay!</p>

            {/* Crew */}
            <div className="flex gap-2 justify-center mb-6">
              {CREW_CELEBRATION.map((c,i) => (
                <motion.div key={c.name}
                  initial={{scale:0, y:20}}
                  animate={{scale:1, y:0}}
                  transition={{delay:i*0.1, type:'spring'}}
                  className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl border-2"
                    style={{background:c.color+'33', borderColor:c.color}}>
                    {c.emoji}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button whileTap={{scale:0.95}} onClick={onReveal}
              className="px-10 py-4 rounded-full font-black text-black text-lg border-0 cursor-pointer"
              style={{background:'linear-gradient(135deg,#fbbf24,#f59e0b)', boxShadow:'0 4px 30px rgba(251,191,36,0.7)'}}
              animate={{scale:[1,1.05,1]}}
              transition={{duration:1,repeat:Infinity}}>
              🎁 Open the Treasure!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
