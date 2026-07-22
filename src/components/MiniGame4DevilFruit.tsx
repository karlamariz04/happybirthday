import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onWin: () => void
  onBack: () => void
}

const FRUITS = [
  { name: 'Stretch Fruit', emoji: '🫐', color: '#8b5cf6', power: 'Stretch', powerEmoji: '🤸', description: 'Your arms can stretch 100 meters!' },
  { name: 'Flame Fruit', emoji: '🍑', color: '#ef4444', power: 'Fire', powerEmoji: '🔥', description: 'Your body ignites with eternal flame!' },
  { name: 'Ice Fruit', emoji: '🍈', color: '#06b6d4', power: 'Ice', powerEmoji: '❄️', description: 'You can freeze anything you touch!' },
  { name: 'Thunder Fruit', emoji: '🍋', color: '#eab308', power: 'Lightning', powerEmoji: '⚡', description: 'Lightning courses through your veins!' },
  { name: 'Wind Fruit', emoji: '🍏', color: '#10b981', power: 'Wind', powerEmoji: '🌪️', description: 'You command the very winds!' },
  { name: 'Speed Fruit', emoji: '🍓', color: '#f97316', power: 'Super Speed', powerEmoji: '💨', description: 'You move faster than the eye can see!' },
]

type PuzzleStep = 'chooseFruit' | 'gainPower' | 'puzzle' | 'solved'

interface Puzzle {
  question: string
  options: string[]
  answer: number
  hint: string
}

const PUZZLES: Puzzle[] = [
  { question: "A chest with 3 locks. You have 2 keys. How many keys are still needed?", options: ['1','2','3','0'], answer: 0, hint: '3 - 2 = ?' },
  { question: "The ancient door shows: 🌊 + 🌊 + ⚓ = 11. If 🌊 = 4, what is ⚓?", options: ['2','3','4','5'], answer: 1, hint: '4+4+?=11' },
  { question: "4 relics for the treasure. You have collected 3. How many remain?", options: ['0','1','2','3'], answer: 1, hint: '4-3=?' },
  { question: "A pirate map shows N→5→E→3→S→5→W→?. How far west to return to start?", options: ['2','3','4','5'], answer: 1, hint: 'You must return to the x origin!' },
]

export default function MiniGame4DevilFruit({ onWin, onBack }: Props) {
  const [phase, setPhase] = useState<'intro'|PuzzleStep|'won'>('intro')
  const [selectedFruit, setSelectedFruit] = useState<typeof FRUITS[0]|null>(null)
  const [puzzle] = useState(() => PUZZLES[Math.floor(Math.random() * PUZZLES.length)])
  const [answered, setAnswered] = useState<number|null>(null)
  const [attempts, setAttempts] = useState(0)

  function chooseFruit(fruit: typeof FRUITS[0]) {
    setSelectedFruit(fruit)
    setPhase('gainPower')
    setTimeout(() => setPhase('puzzle'), 2500)
  }

  function answerPuzzle(idx: number) {
    setAnswered(idx)
    if (idx === puzzle.answer) {
      setTimeout(() => setPhase('solved'), 800)
    } else {
      setAttempts(a => a + 1)
      setTimeout(() => setAnswered(null), 800)
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #1a0533 0%, #2d1b69 50%, #4c1d95 100%)' }}>

      {/* Floating orbs */}
      {[...Array(8)].map((_,i) => (
        <motion.div key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ width: 20+i*10, height: 20+i*10, left:`${10+i*12}%`, top:`${10+i*11}%`,
            background:`radial-gradient(circle, ${['#8b5cf6','#ec4899','#06b6d4','#f59e0b'][i%4]}44, transparent)` }}
          animate={{ y:[0,-20,0], opacity:[0.3,0.7,0.3] }}
          transition={{ duration: 3+i*0.5, repeat: Infinity, delay: i*0.3 }}
        />
      ))}

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="relative z-10 flex flex-col items-center px-6 text-center w-full">
            <div className="text-6xl mb-4">🍎</div>
            <h2 className="text-2xl font-black text-white mb-2" style={{fontFamily:'Georgia,serif'}}>Devil Fruit Mystery</h2>
            <p className="text-purple-300 text-sm mb-2">Rhea says:</p>
            <div className="bg-purple-900/60 rounded-2xl px-5 py-3 mb-6 border border-purple-400/30">
              <p className="text-white italic text-sm">"These ancient fruits grant incredible powers, Mark Jay. Choose one wisely — then use your power to solve the ancient puzzle and claim the final relic!"</p>
            </div>
            <motion.button whileTap={{scale:0.95}} onClick={() => setPhase('chooseFruit')}
              className="px-10 py-4 rounded-full font-black text-white text-lg border-0 cursor-pointer"
              style={{background:'linear-gradient(135deg,#8b5cf6,#ec4899)', boxShadow:'0 4px 20px rgba(139,92,246,0.5)'}}>
              🍎 Discover the Fruits!
            </motion.button>
            <button onClick={onBack} className="mt-4 text-purple-300 text-sm bg-transparent border-0 cursor-pointer">← Back to Map</button>
          </motion.div>
        )}

        {phase === 'chooseFruit' && (
          <motion.div key="chooseFruit" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-30}}
            className="relative z-10 flex flex-col items-center px-4 w-full">
            <h2 className="text-xl font-black text-white mb-1" style={{fontFamily:'Georgia,serif'}}>Choose Your Fruit</h2>
            <p className="text-purple-300 text-xs mb-5">Each grants a legendary power</p>
            <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
              {FRUITS.map(fruit => (
                <motion.button key={fruit.name}
                  whileTap={{scale:0.9}}
                  onClick={() => chooseFruit(fruit)}
                  className="flex flex-col items-center py-4 px-2 rounded-2xl border-2 cursor-pointer bg-transparent outline-none"
                  style={{borderColor: fruit.color+'66', background: fruit.color+'22'}}
                  animate={{y:[0,-4,0]}}
                  transition={{duration:2+Math.random(), repeat:Infinity}}>
                  <span className="text-4xl mb-1">{fruit.emoji}</span>
                  <span className="text-white text-xs font-bold leading-tight text-center">{fruit.power}</span>
                  <span className="text-2xl mt-1">{fruit.powerEmoji}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'gainPower' && selectedFruit && (
          <motion.div key="gainPower" initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
            className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.div
              animate={{scale:[1,1.3,1], rotate:[0,360]}}
              transition={{duration:2, repeat:1}}
              className="text-8xl mb-6"
            >{selectedFruit.emoji}</motion.div>
            <motion.div animate={{opacity:[0,1]}} transition={{delay:0.5}}>
              <div className="text-5xl mb-3">{selectedFruit.powerEmoji}</div>
              <h2 className="text-2xl font-black mb-2" style={{color: selectedFruit.color, fontFamily:'Georgia,serif'}}>
                {selectedFruit.power} Power!
              </h2>
              <p className="text-white text-sm">{selectedFruit.description}</p>
              <p className="text-purple-300 text-xs mt-3">Use your power to solve the ancient puzzle...</p>
            </motion.div>
          </motion.div>
        )}

        {phase === 'puzzle' && selectedFruit && (
          <motion.div key="puzzle" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="relative z-10 flex flex-col items-center px-6 w-full text-center">
            <div className="text-4xl mb-3">{selectedFruit.powerEmoji}</div>
            <h3 className="text-lg font-black text-white mb-1" style={{fontFamily:'Georgia,serif'}}>Ancient Puzzle</h3>
            <p className="text-purple-300 text-xs mb-4">Rhea: "Use your {selectedFruit.power} power to see the answer!"</p>
            <div className="bg-purple-900/60 rounded-2xl px-5 py-4 mb-6 border border-purple-400/40 w-full max-w-sm">
              <p className="text-white font-bold text-sm leading-relaxed">{puzzle.question}</p>
              {attempts >= 2 && <p className="text-yellow-300 text-xs mt-2 italic">Hint: {puzzle.hint}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {puzzle.options.map((opt, idx) => (
                <motion.button key={idx}
                  whileTap={{scale:0.9}}
                  onClick={() => answerPuzzle(idx)}
                  disabled={answered !== null}
                  className="py-4 rounded-2xl text-xl font-black border-2 cursor-pointer outline-none"
                  style={{
                    background: answered === idx
                      ? (idx === puzzle.answer ? '#16a34a' : '#dc2626')
                      : selectedFruit.color + '22',
                    borderColor: answered === idx
                      ? (idx === puzzle.answer ? '#22c55e' : '#ef4444')
                      : selectedFruit.color + '66',
                    color: 'white',
                  }}>
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'solved' && (
          <motion.div key="solved" initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
            className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.div animate={{rotate:[0,15,-15,0],scale:[1,1.2,1]}} transition={{duration:0.5,repeat:3}} className="text-6xl mb-4">🍎</motion.div>
            <h2 className="text-2xl font-black text-yellow-300 mb-2" style={{fontFamily:'Georgia,serif'}}>Legendary Fruit Emblem!</h2>
            <p className="text-white text-sm mb-4">The ancient seal glows with your chosen power.</p>
            <div className="bg-purple-900/50 border border-purple-400/40 rounded-2xl px-5 py-3 mb-6">
              <p className="text-purple-200 italic text-sm">"Remarkable, Mark Jay! The {selectedFruit?.power} power revealed the truth. The Emblem is yours!"</p>
            </div>
            <motion.button whileTap={{scale:0.95}} onClick={onWin}
              className="px-10 py-4 rounded-full font-black text-white text-lg border-0 cursor-pointer"
              style={{background:'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow:'0 4px 20px rgba(34,197,94,0.5)'}}>
              ✅ Claim Relic
            </motion.button>
          </motion.div>
        )}

        {phase === 'won' && (
          <motion.div key="won" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="relative z-10 flex flex-col items-center px-6 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-black text-yellow-300 mb-4">All relics collected!</h2>
            <motion.button whileTap={{scale:0.95}} onClick={onWin}
              className="px-10 py-4 rounded-full font-black text-white text-lg border-0 cursor-pointer"
              style={{background:'linear-gradient(135deg,#22c55e,#16a34a)'}}>
              ✅ Continue
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
