import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onWin: () => void
  onBack: () => void
}

const W = 360
const H = 620
const BASKET_W = 70

interface Item { id: number; x: number; y: number; type: 'good'|'bad'; emoji: string; speed: number }
const GOOD_ITEMS = ['🍖','🍎','🍊','🍇','🥤','🍰','🍗','🍹']
const BAD_ITEMS = ['🤢','💣','🛢']
let itemId = 0

function spawnItem(): Item {
  const isBad = Math.random() < 0.28
  const pool = isBad ? BAD_ITEMS : GOOD_ITEMS
  return {
    id: itemId++,
    x: 20 + Math.random() * (W - 40),
    y: -40,
    type: isBad ? 'bad' : 'good',
    emoji: pool[Math.floor(Math.random() * pool.length)],
    speed: 2.5 + Math.random() * 1.5,
  }
}

export default function MiniGame3Feast({ onWin, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    basketX: W / 2,
    items: [] as Item[],
    caught: 0,
    missed: 0,
    frame: 0,
    spawnTimer: 0,
    alive: true,
    won: false,
    combo: 0,
  })
  const [phase, setPhase] = useState<'intro'|'playing'|'dead'|'won'>('intro')
  const [caught, setCaught] = useState(0)
  const [missed, setMissed] = useState(0)
  const [combo, setCombo] = useState(0)
  const WIN_SCORE = 20
  const MAX_MISS = 5
  const rafRef = useRef<number>(0)
  const [reaction, setReaction] = useState<string|null>(null)

  const FUNNY = ["🤣 Nice catch!", "😂 More food!", "😋 Yum yum!", "🎉 That's the spirit!", "🍖 MEAT! MEAT!"]

  const start = useCallback(() => {
    const s = stateRef.current
    s.basketX = W/2; s.items = []; s.caught = 0; s.missed = 0
    s.frame = 0; s.spawnTimer = 0; s.alive = true; s.won = false; s.combo = 0
    setCaught(0); setMissed(0); setCombo(0); setPhase('playing')
  }, [])

  useEffect(() => {
    if (phase !== 'playing') { cancelAnimationFrame(rafRef.current); return }
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    function tick() {
      const s = stateRef.current
      if (!s.alive || s.won) return
      s.frame++

      s.spawnTimer++
      if (s.spawnTimer > 55) { s.items.push(spawnItem()); s.spawnTimer = 0 }

      // Move items down
      const toRemove: number[] = []
      s.items.forEach(item => {
        item.y += item.speed
        if (item.y > H - 60) {
          const caught = Math.abs(item.x - s.basketX) < BASKET_W/2 + 10
          if (caught) {
            if (item.type === 'good') {
              s.caught++; s.combo++
              setCaught(s.caught)
              setCombo(s.combo)
              if (s.combo % 3 === 0) setReaction(FUNNY[Math.floor(Math.random()*FUNNY.length)])
              setTimeout(() => setReaction(null), 1000)
              if (s.caught >= WIN_SCORE) { s.won = true; setPhase('won') }
            } else {
              s.combo = 0; s.missed++
              setMissed(s.missed)
              setCombo(0)
              setReaction('😱 That was BAD!')
              setTimeout(() => setReaction(null), 800)
              if (s.missed >= MAX_MISS) { s.alive = false; setPhase('dead') }
            }
          } else if (item.type === 'good') {
            s.missed++; setMissed(s.missed)
            if (s.missed >= MAX_MISS) { s.alive = false; setPhase('dead') }
          }
          toRemove.push(item.id)
        }
      })
      s.items = s.items.filter(i => !toRemove.includes(i.id))

      // Draw
      ctx.clearRect(0,0,W,H)

      // BG
      const grad = ctx.createLinearGradient(0,0,0,H)
      grad.addColorStop(0,'#7c2d12'); grad.addColorStop(0.5,'#9a3412'); grad.addColorStop(1,'#c2410c')
      ctx.fillStyle = grad; ctx.fillRect(0,0,W,H)

      // Table line
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      ctx.fillRect(0, H-60, W, 4)

      // Items
      s.items.forEach(item => {
        ctx.font = '36px serif'; ctx.textAlign = 'center'
        ctx.fillText(item.emoji, item.x, item.y)
      })

      // Basket
      ctx.fillStyle = '#92400e'
      ctx.beginPath()
      ctx.roundRect(s.basketX - BASKET_W/2, H-55, BASKET_W, 40, 8)
      ctx.fill()
      ctx.font = '30px serif'; ctx.textAlign='center'
      ctx.fillText('🧺', s.basketX, H-28)

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase])

  function handleMove(clientX: number) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const scaleX = W / rect.width
    stateRef.current.basketX = Math.max(BASKET_W/2, Math.min(W - BASKET_W/2, (clientX - rect.left) * scaleX))
  }

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background:'#7c2d12' }}>

      {phase === 'playing' && (
        <div className="relative z-20 flex justify-between items-center px-4 pt-3 pb-2"
          style={{background:'rgba(0,0,0,0.4)'}}>
          <button onClick={onBack} className="text-white text-sm border border-white/30 rounded-full px-3 py-1 bg-transparent cursor-pointer">← Map</button>
          <div className="text-center">
            <p className="text-yellow-300 font-bold text-sm">🍖 {caught}/{WIN_SCORE}</p>
            {combo >= 3 && <p className="text-orange-300 text-xs">🔥 x{combo} Combo!</p>}
          </div>
          <div className="flex">
            {Array.from({length:MAX_MISS}).map((_,i) => <span key={i} className="text-sm">{i<missed?'❌':'✅'}</span>)}
          </div>
        </div>
      )}

      {reaction && (
        <motion.div className="absolute top-20 left-0 right-0 text-center z-30 pointer-events-none"
          initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
          <span className="bg-black/60 rounded-full px-4 py-2 text-white text-sm font-bold">{reaction}</span>
        </motion.div>
      )}

      <canvas ref={canvasRef} width={W} height={H}
        className="w-full max-h-full object-contain"
        style={{display:phase==='playing'?'block':'none', touchAction:'none'}}
        onMouseMove={e => handleMove(e.clientX)}
        onTouchMove={e => handleMove(e.touches[0].clientX)}
      />

      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-30"
            style={{background:'linear-gradient(180deg,#7c2d12,#9a3412)'}}>
            <div className="text-7xl mb-4">🍖</div>
            <h2 className="text-2xl font-black text-white mb-2" style={{fontFamily:'Georgia,serif'}}>Captain's Feast!</h2>
            <p className="text-orange-300 text-sm mb-2">Bolt says:</p>
            <div className="bg-orange-900/60 rounded-2xl px-5 py-3 mb-6 border border-orange-400/30">
              <p className="text-white italic text-sm">"HAHAHAHA! Even I could catch food better than you... probably. Catch {WIN_SCORE} good items before you miss {MAX_MISS}! Don't catch the bad stuff!"</p>
            </div>
            <p className="text-yellow-200 text-xs mb-6">Drag or slide to move basket left/right</p>
            <motion.button whileTap={{scale:0.95}} onClick={start}
              className="px-10 py-4 rounded-full font-black text-white text-lg border-0 cursor-pointer"
              style={{background:'linear-gradient(135deg,#f97316,#ef4444)', boxShadow:'0 4px 20px rgba(249,115,22,0.5)'}}>
              🍖 Start Feast!
            </motion.button>
            <button onClick={onBack} className="mt-4 text-orange-300 text-sm bg-transparent border-0 cursor-pointer">← Back to Map</button>
          </motion.div>
        )}
        {phase === 'dead' && (
          <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-30"
            style={{background:'rgba(0,0,0,0.85)'}}>
            <div className="text-6xl mb-4">😭</div>
            <h2 className="text-2xl font-black text-white mb-2">Feast Ruined!</h2>
            <p className="text-gray-300 text-sm mb-6">Caught: {caught}/{WIN_SCORE}</p>
            <motion.button whileTap={{scale:0.95}} onClick={start}
              className="px-8 py-3 rounded-full font-bold text-white border-0 cursor-pointer mb-3"
              style={{background:'linear-gradient(135deg,#f97316,#ef4444)'}}>Try Again</motion.button>
            <button onClick={onBack} className="text-orange-300 text-sm bg-transparent border-0 cursor-pointer">← Back to Map</button>
          </motion.div>
        )}
        {phase === 'won' && (
          <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-30"
            style={{background:'linear-gradient(180deg,#1a0a00,#7c2d12)'}}>
            <motion.div animate={{rotate:[0,10,-10,0],scale:[1,1.1,1]}} transition={{duration:0.5,repeat:3}} className="text-6xl mb-4">🍖</motion.div>
            <h2 className="text-2xl font-black text-yellow-300 mb-2" style={{fontFamily:'Georgia,serif'}}>Feast Token!</h2>
            <p className="text-white text-sm mb-4">Bolt is laughing (impressed).</p>
            <div className="bg-orange-900/50 border border-orange-400/40 rounded-2xl px-5 py-3 mb-6">
              <p className="text-orange-200 italic text-sm">"BAHAHA! Not bad at all! Here, take the token... and save some meat for me!"</p>
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
