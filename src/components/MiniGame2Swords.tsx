import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onWin: () => void
  onBack: () => void
}

type Target = { id: number; x: number; y: number; type: 'good'|'bad'; emoji: string; visible: boolean; hit: boolean }
const GOOD = ['🎋','🛢','🍊','🎯','🍉','🪵']
const BAD = ['💣','🐣','🐰']

let idCounter = 0

function randomTarget(): Target {
  const isBad = Math.random() < 0.25
  const pool = isBad ? BAD : GOOD
  return {
    id: idCounter++,
    x: 15 + Math.random() * 70,
    y: 20 + Math.random() * 60,
    type: isBad ? 'bad' : 'good',
    emoji: pool[Math.floor(Math.random() * pool.length)],
    visible: true,
    hit: false,
  }
}

export default function MiniGame2Swords({ onWin, onBack }: Props) {
  const [phase, setPhase] = useState<'intro'|'playing'|'dead'|'won'>('intro')
  const [targets, setTargets] = useState<Target[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [hp, setHp] = useState(3)
  const [slash, setSlash] = useState<{x:number,y:number,id:number}|null>(null)
  const [flash, setFlash] = useState<string|null>(null)

  const WIN_SCORE = 15

  const spawnTarget = useCallback(() => {
    setTargets(prev => [...prev.filter(t=>t.visible).slice(-6), randomTarget()])
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    const interval = setInterval(spawnTarget, 1200)
    return () => clearInterval(interval)
  }, [phase, spawnTarget])

  // auto-remove targets after 2.5s
  useEffect(() => {
    if (phase !== 'playing') return
    const interval = setInterval(() => {
      setTargets(prev => prev.map(t => {
        if (!t.visible || t.hit) return t
        return t
      }).filter(t => t.visible))
    }, 500)
    return () => clearInterval(interval)
  }, [phase])

  function hitTarget(t: Target, e: React.MouseEvent|React.TouchEvent) {
    e.stopPropagation()
    if (!t.visible || t.hit || phase !== 'playing') return

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    let cx = rect.left + rect.width/2, cy = rect.top + rect.height/2
    if ('touches' in e) { cx = e.touches[0]?.clientX ?? cx; cy = e.touches[0]?.clientY ?? cy }

    setSlash({ x: cx, y: cy, id: Date.now() })
    setTargets(prev => prev.map(x => x.id === t.id ? {...x, hit: true, visible: false} : x))

    if (t.type === 'bad') {
      setCombo(0)
      setHp(prev => {
        const next = Math.max(0, prev - 1)
        if (next === 0) setPhase('dead')
        return next
      })
      setFlash('red')
      setTimeout(() => setFlash(null), 300)
    } else {
      const newCombo = combo + 1
      setCombo(newCombo)
      const pts = newCombo >= 3 ? 3 : 1
      setScore(prev => {
        const next = prev + pts
        if (next >= WIN_SCORE) setPhase('won')
        return next
      })
      setFlash(newCombo >= 3 ? 'gold' : null)
      setTimeout(() => setFlash(null), 200)
    }
  }

  const start = () => { setPhase('playing'); setScore(0); setCombo(0); setHp(3); setTargets([]) }

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>

      {flash && (
        <div className="absolute inset-0 z-50 pointer-events-none"
          style={{ background: flash==='red'?'rgba(239,68,68,0.3)':flash==='gold'?'rgba(234,179,8,0.3)':'transparent' }} />
      )}

      {slash && (
        <motion.div key={slash.id}
          className="fixed z-50 pointer-events-none text-4xl"
          style={{ left: slash.x - 30, top: slash.y - 30 }}
          initial={{ opacity:1, scale:0.5, rotate:-45 }}
          animate={{ opacity:0, scale:2, rotate:45 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => setSlash(null)}>
          ⚡
        </motion.div>
      )}

      {/* HUD */}
      {phase === 'playing' && (
        <div className="relative z-20 flex justify-between items-center px-4 pt-3 pb-2"
          style={{ background:'rgba(0,0,0,0.5)' }}>
          <button onClick={onBack} className="text-white text-sm border border-white/30 rounded-full px-3 py-1 bg-transparent cursor-pointer">← Map</button>
          <div>
            <div className="flex justify-center gap-1">{Array.from({length:3}).map((_,i) => <span key={i}>{i<hp?'❤️':'🖤'}</span>)}</div>
            {combo >= 3 && <p className="text-yellow-300 text-xs text-center animate-bounce">🔥 COMBO x{combo}!</p>}
          </div>
          <span className="text-yellow-300 font-bold">{score}/{WIN_SCORE}</span>
        </div>
      )}

      {/* Game arena */}
      {phase === 'playing' && (
        <div className="relative flex-1 w-full" style={{ touchAction:'none' }}>
          {/* Dojo background lines */}
          {[25,50,75].map(p => (
            <div key={p} className="absolute left-0 right-0 border-b border-white/5" style={{top:`${p}%`}} />
          ))}
          <AnimatePresence>
            {targets.filter(t=>t.visible&&!t.hit).map(t => (
              <motion.button
                key={t.id}
                className="absolute flex items-center justify-center border-0 bg-transparent cursor-pointer outline-none"
                style={{ left:`${t.x}%`, top:`${t.y}%`, transform:'translate(-50%,-50%)' }}
                initial={{ scale:0, rotate:-30 }}
                animate={{ scale:1, rotate:0 }}
                exit={{ scale:0, rotate:30 }}
                transition={{ type:'spring', damping:15 }}
                onMouseDown={e => hitTarget(t, e)}
                onTouchStart={e => hitTarget(t, e)}
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2"
                    style={{
                      background: t.type==='bad' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)',
                      borderColor: t.type==='bad' ? '#ef4444' : 'rgba(255,255,255,0.3)',
                    }}>
                    {t.emoji}
                  </div>
                  {t.type==='bad' && (
                    <div className="absolute -top-1 -right-1 text-xs bg-red-500 rounded-full px-1 font-bold text-white">✗</div>
                  )}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Progress */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="h-2 rounded-full bg-white/10">
              <motion.div className="h-full rounded-full" style={{background:'linear-gradient(90deg,#3b82f6,#60a5fa)', width:`${(score/WIN_SCORE)*100}%`}} animate={{width:`${(score/WIN_SCORE)*100}%`}} transition={{duration:0.3}} />
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-30">
            <div className="text-7xl mb-4">⚔️</div>
            <h2 className="text-2xl font-black text-white mb-2" style={{fontFamily:'Georgia,serif'}}>Three Sword Slash</h2>
            <p className="text-blue-300 text-sm mb-2">Ryoku says:</p>
            <div className="bg-blue-900/60 rounded-2xl px-5 py-3 mb-6 border border-blue-400/30">
              <p className="text-white italic text-sm">"Tap the targets to slash them, Mark Jay. But avoid the bombs and friendly creatures — or face my disappointment."</p>
            </div>
            <p className="text-yellow-200 text-xs mb-6">Slash {WIN_SCORE} targets • Avoid 💣🐣🐰 • Build combos for bonus!</p>
            <motion.button whileTap={{scale:0.95}} onClick={start}
              className="px-10 py-4 rounded-full font-black text-white text-lg border-0 cursor-pointer"
              style={{background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', boxShadow:'0 4px 20px rgba(59,130,246,0.5)'}}>
              ⚔️ Begin Training!
            </motion.button>
            <button onClick={onBack} className="mt-4 text-blue-300 text-sm bg-transparent border-0 cursor-pointer">← Back to Map</button>
          </motion.div>
        )}

        {phase === 'dead' && (
          <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-30"
            style={{background:'rgba(0,0,0,0.85)'}}>
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-black text-white mb-2">Training Failed!</h2>
            <p className="text-gray-300 text-sm mb-6">Score: {score}/{WIN_SCORE}</p>
            <motion.button whileTap={{scale:0.95}} onClick={start}
              className="px-8 py-3 rounded-full font-bold text-white border-0 cursor-pointer mb-3"
              style={{background:'linear-gradient(135deg,#3b82f6,#1d4ed8)'}}>
              Try Again
            </motion.button>
            <button onClick={onBack} className="text-blue-300 text-sm bg-transparent border-0 cursor-pointer">← Back to Map</button>
          </motion.div>
        )}

        {phase === 'won' && (
          <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-30"
            style={{background:'linear-gradient(180deg,#0a1628,#1a237e)'}}>
            <motion.div animate={{rotate:[0,15,-15,0]}} transition={{duration:0.4,repeat:3}} className="text-6xl mb-4">⚔️</motion.div>
            <h2 className="text-2xl font-black text-yellow-300 mb-2" style={{fontFamily:'Georgia,serif'}}>Swordsman's Crest!</h2>
            <p className="text-white text-sm mb-4">Ryoku nods slowly. You have earned it.</p>
            <div className="bg-blue-900/50 border border-blue-400/40 rounded-2xl px-5 py-3 mb-6">
              <p className="text-blue-200 italic text-sm">"...Not bad. The crest is yours."</p>
            </div>
            <motion.button whileTap={{scale:0.95}} onClick={onWin}
              className="px-10 py-4 rounded-full font-black text-white text-lg border-0 cursor-pointer"
              style={{background:'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow:'0 4px 20px rgba(34,197,94,0.5)'}}>
              ✅ Claim Relic
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
