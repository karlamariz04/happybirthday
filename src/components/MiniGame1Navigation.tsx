import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onWin: () => void
  onBack: () => void
}

interface Obstacle { x: number; y: number; type: 'rock'|'whirlpool'|'wave'|'monster'; w: number; h: number }
interface Coin { x: number; y: number; collected: boolean }

const W = 360
const H = 640
const SHIP_W = 36
const SHIP_H = 36
const SPEED = 3
const OBS_SPEED = 2.2

function randomObstacle(y: number): Obstacle {
  const types: Obstacle['type'][] = ['rock','whirlpool','wave','monster']
  const type = types[Math.floor(Math.random() * types.length)]
  return { x: Math.random() * (W - 50) + 10, y, type, w: 38, h: 38 }
}

export default function MiniGame1Navigation({ onWin, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    shipX: W / 2,
    shipY: H - 100,
    obstacles: [] as Obstacle[],
    coins: [] as Coin[],
    score: 0,
    hp: 3,
    alive: true,
    won: false,
    frame: 0,
    spawnTimer: 0,
    coinTimer: 0,
    targetX: W / 2,
  })
  const [phase, setPhase] = useState<'intro'|'playing'|'dead'|'won'>('intro')
  const [displayScore, setDisplayScore] = useState(0)
  const [displayHp, setDisplayHp] = useState(3)
  const rafRef = useRef<number>(0)
  const touchRef = useRef<number | null>(null)

  const EMOJIS: Record<string, string> = { rock:'🪨', whirlpool:'🌀', wave:'🌊', monster:'🐙' }

  const startGame = useCallback(() => {
    const s = stateRef.current
    s.shipX = W / 2; s.shipY = H - 100; s.obstacles = []; s.coins = []
    s.score = 0; s.hp = 3; s.alive = true; s.won = false; s.frame = 0
    s.spawnTimer = 0; s.coinTimer = 0; s.targetX = W / 2
    setPhase('playing')
    setDisplayScore(0); setDisplayHp(3)
  }, [])

  useEffect(() => {
    if (phase !== 'playing') { cancelAnimationFrame(rafRef.current); return }
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    function tick() {
      const s = stateRef.current
      if (!s.alive || s.won) return
      s.frame++

      // Move ship toward touch target
      const dx = s.targetX - s.shipX
      if (Math.abs(dx) > 2) s.shipX += Math.sign(dx) * SPEED

      // Spawn obstacles
      s.spawnTimer++
      if (s.spawnTimer > 60) { s.obstacles.push(randomObstacle(-50)); s.spawnTimer = 0 }

      // Spawn coins
      s.coinTimer++
      if (s.coinTimer > 90) {
        s.coins.push({ x: Math.random() * (W - 40) + 20, y: -30, collected: false })
        s.coinTimer = 0
      }

      // Move obstacles
      s.obstacles = s.obstacles.filter(o => o.y < H + 60)
      s.obstacles.forEach(o => { o.y += OBS_SPEED + s.score * 0.002 })

      // Move coins
      s.coins = s.coins.filter(c => c.y < H + 40)
      s.coins.forEach(c => { c.y += OBS_SPEED })

      // Collisions
      s.obstacles.forEach(o => {
        if (Math.abs(o.x - s.shipX) < (o.w/2 + SHIP_W/2 - 8) && Math.abs(o.y - s.shipY) < (o.h/2 + SHIP_H/2 - 8)) {
          o.y = H + 100
          s.hp = Math.max(0, s.hp - 1)
          if (s.hp === 0) { s.alive = false; setPhase('dead') }
          setDisplayHp(s.hp)
        }
      })
      s.coins.forEach(c => {
        if (!c.collected && Math.abs(c.x - s.shipX) < 30 && Math.abs(c.y - s.shipY) < 30) {
          c.collected = true; s.score += 10; setDisplayScore(s.score)
        }
      })
      s.score += 0.02

      // Win condition
      if (s.score >= 200) { s.won = true; setPhase('won') }

      // Draw
      ctx.clearRect(0, 0, W, H)

      // Ocean bg
      const grad = ctx.createLinearGradient(0,0,0,H)
      grad.addColorStop(0,'#0277bd'); grad.addColorStop(1,'#01579b')
      ctx.fillStyle = grad; ctx.fillRect(0,0,W,H)

      // Waves
      for (let i=0; i<5; i++) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255,255,255,${0.05+i*0.02})`
        ctx.lineWidth = 2
        const yWave = ((s.frame*1.5 + i*130) % (H+50)) - 25
        ctx.moveTo(0, yWave); ctx.lineTo(W, yWave)
        ctx.stroke()
      }

      // Coins
      s.coins.filter(c=>!c.collected).forEach(c => {
        ctx.font = '22px serif'; ctx.textAlign='center'
        ctx.fillText('🪙', c.x, c.y)
      })

      // Obstacles
      s.obstacles.forEach(o => {
        ctx.font = `${o.w}px serif`; ctx.textAlign='center'
        ctx.fillText(EMOJIS[o.type], o.x, o.y + o.h/2)
      })

      // Ship
      ctx.font = '36px serif'; ctx.textAlign='center'
      ctx.fillText('⛵', s.shipX, s.shipY)

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase])

  function handleTouch(e: React.TouchEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const scaleX = W / rect.width
    const touch = e.touches[0]
    stateRef.current.targetX = (touch.clientX - rect.left) * scaleX
    touchRef.current = touch.identifier
  }

  function handleTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const scaleX = W / rect.width
    const touch = Array.from(e.touches).find(t => t.identifier === touchRef.current) || e.touches[0]
    stateRef.current.targetX = (touch.clientX - rect.left) * scaleX
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    const scaleX = W / rect.width
    stateRef.current.targetX = (e.clientX - rect.left) * scaleX
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#01579b' }}>

      {/* HUD */}
      {phase === 'playing' && (
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-4 pt-3 pb-2"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          <button onClick={onBack} className="text-white text-sm border border-white/30 rounded-full px-3 py-1 bg-transparent cursor-pointer">← Map</button>
          <div className="flex gap-1">{Array.from({length:3}).map((_,i) => (
            <span key={i} className={i < displayHp ? 'text-red-400' : 'text-gray-600'}>❤️</span>
          ))}</div>
          <span className="text-yellow-300 font-bold text-sm">⭐ {Math.floor(displayScore)}</span>
        </div>
      )}

      <canvas
        ref={canvasRef} width={W} height={H}
        className="w-full max-h-full object-contain"
        onTouchStart={handleTouch}
        onTouchMove={handleTouchMove}
        onMouseMove={handleMouseMove}
        style={{ display: phase === 'playing' ? 'block' : 'none', touchAction:'none' }}
      />

      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-30"
            style={{ background: 'linear-gradient(180deg, #01579b, #0277bd)' }}>
            <div className="text-7xl mb-4">🌊</div>
            <h2 className="text-2xl font-black text-white mb-2" style={{fontFamily:'Georgia,serif'}}>Grand Line Navigation</h2>
            <p className="text-blue-200 text-sm mb-2">Sera says:</p>
            <div className="bg-blue-900/60 rounded-2xl px-5 py-3 mb-6 border border-blue-400/30">
              <p className="text-white italic text-sm">"The Grand Line is treacherous, Mark Jay! Move left and right to dodge obstacles and collect coins. Score 200 to earn the Compass!"</p>
            </div>
            <p className="text-yellow-200 text-xs mb-6">Drag or tap to steer the ship</p>
            <motion.button whileTap={{scale:0.95}}
              onClick={startGame}
              className="px-10 py-4 rounded-full font-black text-white text-lg border-0 cursor-pointer"
              style={{ background:'linear-gradient(135deg,#f59e0b,#ef4444)', boxShadow:'0 4px 20px rgba(245,158,11,0.5)' }}>
              ⛵ Navigate!
            </motion.button>
            <button onClick={onBack} className="mt-4 text-blue-300 text-sm bg-transparent border-0 cursor-pointer">← Back to Map</button>
          </motion.div>
        )}

        {phase === 'dead' && (
          <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-30"
            style={{ background:'rgba(0,0,0,0.8)' }}>
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-2xl font-black text-white mb-2">Wrecked!</h2>
            <p className="text-gray-300 text-sm mb-6">Score: {Math.floor(displayScore)}</p>
            <motion.button whileTap={{scale:0.95}} onClick={startGame}
              className="px-8 py-3 rounded-full font-bold text-white border-0 cursor-pointer mb-3"
              style={{background:'linear-gradient(135deg,#f59e0b,#ef4444)'}}>
              Try Again
            </motion.button>
            <button onClick={onBack} className="text-blue-300 text-sm bg-transparent border-0 cursor-pointer">← Back to Map</button>
          </motion.div>
        )}

        {phase === 'won' && (
          <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-30"
            style={{ background:'linear-gradient(180deg,#0a1628,#01579b)' }}>
            <motion.div animate={{rotate:[0,10,-10,0],scale:[1,1.1,1]}} transition={{duration:0.5,repeat:3}} className="text-6xl mb-4">🧭</motion.div>
            <h2 className="text-2xl font-black text-yellow-300 mb-2" style={{fontFamily:'Georgia,serif'}}>Navigator's Compass!</h2>
            <p className="text-white text-sm mb-4">Relic collected! Sera is proud of you!</p>
            <div className="bg-yellow-500/20 border border-yellow-400/40 rounded-2xl px-5 py-3 mb-6">
              <p className="text-yellow-200 italic text-sm">"Mark Jay, you sail like a true navigator! The compass is yours!"</p>
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
