import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onStart: () => void
}

export default function SplashScreen({ onStart }: Props) {
  const [showButton, setShowButton] = useState(false)
  const [waves, setWaves] = useState<number[]>([])

  useEffect(() => {
    setWaves([0, 1, 2, 3, 4])
    const t = setTimeout(() => setShowButton(true), 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #0c1445 0%, #1a237e 30%, #0d47a1 60%, #1565c0 80%, #0288d1 100%)' }}>

      {/* Stars */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Moon */}
      <motion.div
        className="absolute top-8 right-10 w-16 h-16 rounded-full"
        style={{ background: 'radial-gradient(circle at 35% 35%, #fffde7, #fff9c4)', boxShadow: '0 0 30px rgba(255,245,157,0.6)' }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Ship silhouette */}
      <motion.div
        className="absolute text-7xl select-none"
        style={{ bottom: '22%', left: '10%' }}
        animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ⛵
      </motion.div>

      {/* Waves */}
      {waves.map((w) => (
        <motion.div
          key={w}
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: 80 + w * 20,
            background: `rgba(2, 136, 209, ${0.15 + w * 0.05})`,
            borderRadius: '50% 50% 0 0 / 20px 20px 0 0',
          }}
          animate={{ x: [0, w % 2 === 0 ? 30 : -30, 0] }}
          transition={{ duration: 3 + w * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Ocean floor */}
      <div className="absolute bottom-0 left-0 right-0 h-16"
        style={{ background: 'linear-gradient(180deg, #01579b, #014f86)' }} />

      {/* Title block */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center" style={{ marginBottom: '10%' }}>
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, delay: 0.2 }}
          className="text-6xl mb-3"
        >
          🏴‍☠️
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-3xl font-black leading-tight text-white drop-shadow-lg"
          style={{ textShadow: '0 2px 20px rgba(255,200,0,0.8), 0 0 40px rgba(255,200,0,0.4)', fontFamily: 'Georgia, serif' }}
        >
          THE GRAND VOYAGE
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-2xl font-black text-yellow-300 drop-shadow-lg"
          style={{ textShadow: '0 2px 15px rgba(255,200,0,0.9)', fontFamily: 'Georgia, serif' }}
        >
          OF MARK JAY
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="text-blue-200 text-sm mt-3 italic"
        >
          "Every great sailor has one unforgettable adventure.<br />Today... yours begins."
        </motion.p>

        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: [1, 1.04, 1] }}
              exit={{ opacity: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="mt-8 px-10 py-4 rounded-full text-lg font-black text-white cursor-pointer border-0 outline-none"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                boxShadow: '0 4px 30px rgba(245,158,11,0.6), 0 0 0 3px rgba(255,255,255,0.2)',
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ⚓ Set Sail!
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
