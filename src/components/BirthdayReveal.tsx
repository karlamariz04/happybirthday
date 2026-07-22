import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onRestart: () => void
}

const CREW = [
  { emoji: '🏴‍☠️', name: 'Vance' },
  { emoji: '⚔️', name: 'Ryoku' },
  { emoji: '🧭', name: 'Sera' },
  { emoji: '🎯', name: 'Bolt' },
  { emoji: '🍳', name: 'Sanji-kai' },
  { emoji: '🩺', name: 'Doc Mira' },
  { emoji: '📜', name: 'Rhea' },
  { emoji: '🔨', name: 'Stein' },
  { emoji: '🎻', name: 'Lyra' },
  { emoji: '🌊', name: 'Tidus' },
]

export default function BirthdayReveal({ onRestart }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timings = [0, 1200, 2800, 4500, 6500]
    const timers = timings.map((t, i) => setTimeout(() => setStep(i), t))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 40%, #2d1b69 100%)' }}>

      {/* Confetti layer */}
      {step >= 2 && [...Array(25)].map((_,i) => (
        <motion.div key={i} className="absolute text-xl pointer-events-none"
          initial={{y:-30, x:`${Math.random()*100}%`, opacity:1, rotate:0}}
          animate={{y:'110vh', rotate:720, opacity:[1,1,0]}}
          transition={{duration:4+Math.random()*3, delay:Math.random()*3, repeat:Infinity}}>
          {['🌸','🎊','🎉','⭐','💛','🌟','❤️','🎈'][i%8]}
        </motion.div>
      ))}

      {/* Fireworks */}
      {step >= 2 && [...Array(8)].map((_,i) => (
        <motion.div key={`fw${i}`} className="absolute pointer-events-none"
          style={{left:`${10+i*12}%`, top:`${5+i%3*15}%`}}
          animate={{scale:[0,1.5,0], opacity:[0,1,0]}}
          transition={{duration:1, delay:i*0.3, repeat:Infinity, repeatDelay:1}}>
          <span className="text-4xl">{'🎆🎇✨🌟💫⭐🎆🎇'[i]}</span>
        </motion.div>
      ))}

      {/* Golden glow */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div className="absolute inset-0 pointer-events-none"
            initial={{opacity:0}} animate={{opacity:[0,0.3,0.1]}}
            transition={{duration:2}}
            style={{background:'radial-gradient(ellipse at center, rgba(255,215,0,0.3) 0%, transparent 70%)'}} />
        )}
      </AnimatePresence>

      {/* Chest opening animation */}
      <AnimatePresence>
        {step === 0 && (
          <motion.div key="chest-closed" initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:2}}
            className="relative z-10 flex flex-col items-center">
            <motion.div className="text-9xl" animate={{y:[0,-10,0]}} transition={{duration:1.5,repeat:Infinity}}>📦</motion.div>
            <p className="text-yellow-300 text-sm mt-4 animate-pulse">Opening...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Golden light burst */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div key="burst" initial={{scale:0,opacity:1}} animate={{scale:8,opacity:0}}
            transition={{duration:1.2}}
            className="absolute z-20 w-40 h-40 rounded-full"
            style={{background:'radial-gradient(circle, rgba(255,215,0,0.9), rgba(255,200,0,0.4), transparent)'}} />
        )}
      </AnimatePresence>

      {/* Birthday message */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div key="message" initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
            className="relative z-10 flex flex-col items-center px-6 text-center overflow-y-auto max-h-full pb-8">

            <motion.div className="text-6xl mb-3"
              animate={{scale:[1,1.1,1],rotate:[-3,3,-3]}}
              transition={{duration:1.5,repeat:Infinity}}>
              🎂
            </motion.div>

            <motion.h1
              className="text-3xl font-black text-yellow-300 mb-1"
              style={{fontFamily:'Georgia,serif', textShadow:'0 0 30px rgba(255,215,0,0.8)'}}
              animate={{opacity:[0.8,1,0.8]}}
              transition={{duration:1,repeat:Infinity}}>
              🎉 Happy Birthday,
            </motion.h1>
            <motion.h1
              className="text-3xl font-black mb-4"
              style={{fontFamily:'Georgia,serif', color:'#ff6b9d', textShadow:'0 0 20px rgba(255,107,157,0.8)'}}
              animate={{opacity:[0.8,1,0.8]}}
              transition={{duration:1,repeat:Infinity,delay:0.5}}>
              my Mj! ❤️
            </motion.h1>

            {step >= 3 && (
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                className="bg-white/10 backdrop-blur-sm rounded-3xl px-6 py-5 border border-white/20 mb-5 max-w-sm">
                <p className="text-white text-sm leading-relaxed mb-3">
                  Every wave you've crossed, every challenge you've conquered, and every adventure you've embraced has led you here.
                </p>
                <p className="text-white text-sm leading-relaxed mb-3">
                  Today, the greatest treasure isn't hidden beneath the sea.
                </p>
                <p className="text-yellow-300 text-sm font-bold leading-relaxed mb-3">
                  It's celebrating <span className="text-pink-300">you</span>.
                </p>
                <p className="text-white text-sm leading-relaxed mb-3">
                  Thank you for being such an incredible person.
                </p>
                <p className="text-blue-200 text-sm leading-relaxed mb-3">
                  May your life always be filled with adventure, courage, happiness, and dreams that come true.
                </p>
                <p className="text-white text-sm leading-relaxed">
                  Wishing you calm seas, favorable winds, and endless blessings.
                </p>
              </motion.div>
            )}

            {step >= 4 && (
              <motion.div initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}}
                transition={{type:'spring', damping:12}}
                className="mb-5">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl px-8 py-5 text-center border-4 border-yellow-300"
                  style={{boxShadow:'0 0 40px rgba(251,191,36,0.6)'}}>
                  <div className="text-4xl mb-2">🎁</div>
                  <p className="text-white font-black text-lg" style={{fontFamily:'Georgia,serif'}}>
                    Happy Birthday,<br />my Mj! ❤️
                  </p>
                  <p className="text-yellow-100 text-xs mt-2 italic">
                    "The greatest treasure was this adventure with you."
                  </p>
                </div>
              </motion.div>
            )}

            {/* Crew celebration */}
            {step >= 4 && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
                className="mb-5">
                <p className="text-blue-300 text-xs mb-3">The whole crew celebrates with you!</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {CREW.map((c,i) => (
                    <motion.div key={c.name}
                      initial={{scale:0,y:20}}
                      animate={{scale:1,y:0}}
                      transition={{delay:i*0.08, type:'spring'}}
                      className="flex flex-col items-center">
                      <motion.span className="text-3xl"
                        animate={{y:[0,-6,0]}}
                        transition={{duration:1.5+i*0.1, repeat:Infinity}}>
                        {c.emoji}
                      </motion.span>
                      <span className="text-white text-xs">{c.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step >= 4 && (
              <motion.button
                initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}}
                whileTap={{scale:0.95}}
                onClick={onRestart}
                className="px-8 py-3 rounded-full text-sm font-bold text-blue-200 border border-blue-400/40 bg-transparent cursor-pointer">
                🏴‍☠️ Sail Again
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
