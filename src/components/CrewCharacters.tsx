import { motion } from 'framer-motion'
import { CREW } from '../constants'

type Scene = 'splash' | 'map' | 'mini1' | 'mini2' | 'mini3' | 'mini4' | 'final' | 'birthday'

const find = (role: string) => CREW.find(member => member.role.toLowerCase() === role.toLowerCase())

const bounce = { y: [0, -6, 0], transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }
const pulse = { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } }

export default function CrewCharacters({ scene }: { scene: Scene }) {
  const captain = find('Captain')
  const navigator = find('Navigator')
  const swordsman = find('Swordsman')
  const cook = find('Cook')
  const doctor = find('Doctor')
  const archaeologist = find('Archaeologist')
  const sniper = find('Sniper')
  const shipwright = find('Shipwright')
  const musician = find('Musician')
  const helmsman = find('Helmsman')

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {scene === 'splash' && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-6">
          <div className="relative w-full max-w-lg px-4 pt-6 pb-4 rounded-t-3xl border-t-4 border-white/20 bg-slate-900/40 backdrop-blur-sm shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-x-8 -top-5 h-10 rounded-full bg-slate-800/90 shadow-lg" />
            <div className="relative grid grid-cols-5 gap-2 text-center">
              {CREW.slice(0, 5).map((member, index) => (
                <motion.div key={member.name}
                  className="rounded-3xl bg-slate-950/90 border border-white/10 p-2"
                  animate={index % 2 === 0 ? bounce : { y: [0, -4, 0], transition: { duration: 2, repeat: Infinity } }}>
                  <div className="text-3xl mb-1">{member.emoji}</div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 leading-snug">{member.name}</div>
                </motion.div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-300">Your pirate crew stands ready, cheering you onward as the ship slices through the morning mist.</p>
          </div>
        </div>
      )}

      {scene === 'map' && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center px-4">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-slate-950/80 p-4 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)]">
            <div className="absolute left-4 top-3 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.6)] animate-pulse" />
            <div className="flex items-center justify-between gap-3 text-white text-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⛵</span>
                <span>Captain {captain?.name} leads, {navigator?.name} plots the route.</span>
              </div>
              <span className="rounded-full bg-slate-900/70 px-3 py-1">Crew On Deck</span>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {[captain, navigator, musician, cook, shipwright].map(member => member && (
                <motion.div key={member.name}
                  className="rounded-3xl bg-slate-900/90 border border-white/10 p-2 text-center"
                  animate={pulse}>
                  <div className="text-3xl">{member.emoji}</div>
                  <div className="text-[11px] text-slate-200">{member.role}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {scene === 'mini1' && (
        <div className="absolute inset-x-0 top-4 flex items-start justify-between px-4">
          <motion.div className="flex items-center gap-2 rounded-3xl bg-slate-950/85 border border-white/15 p-3 text-white shadow-[0_0_20px_rgba(0,0,0,0.35)]"
            animate={pulse}>
            <span className="text-3xl">{navigator?.emoji}</span>
            <div className="text-[11px] leading-tight">
              <div className="font-bold">{navigator?.name}</div>
              <div>"The next island is just ahead!"</div>
            </div>
          </motion.div>
          <motion.div className="flex items-center gap-2 rounded-3xl bg-slate-950/85 border border-white/15 p-3 text-white shadow-[0_0_20px_rgba(0,0,0,0.35)]"
            animate={{ y: [0, -4, 0], transition: { duration: 1.8, repeat: Infinity } }}>
            <span className="text-3xl">{captain?.emoji}</span>
            <div className="text-[11px] leading-tight">
              <div className="font-bold">{captain?.name}</div>
              <div>"Keep sailing strong!"</div>
            </div>
          </motion.div>
        </div>
      )}

      {scene === 'mini2' && (
        <div className="absolute inset-x-0 top-4 flex flex-col gap-3 px-4">
          <div className="flex items-center justify-between gap-2">
            <motion.div className="flex items-center gap-2 rounded-3xl bg-slate-950/90 border border-white/10 p-3 text-white"
              animate={bounce}>
              <span className="text-3xl">{swordsman?.emoji}</span>
              <div className="text-[11px] leading-tight">
                <div className="font-bold">{swordsman?.name}</div>
                <div>"Watch my technique!"</div>
              </div>
            </motion.div>
            <motion.div className="flex items-center gap-2 rounded-3xl bg-slate-950/90 border border-white/10 p-3 text-white"
              animate={pulse}>
              <span className="text-3xl">{captain?.emoji}</span>
              <div className="text-[11px] leading-tight">
                <div className="font-bold">{captain?.name}</div>
                <div>"Nice combo! Keep it up!"</div>
              </div>
            </motion.div>
          </div>
          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-1">
            {[navigator, sniper, doctor].map(member => member && (
              <motion.div key={member.name} className="flex flex-col items-center min-w-[70px] rounded-3xl bg-slate-950/90 border border-white/10 p-2 text-center text-white"
                animate={{ y: [0, -3, 0], transition: { duration: 1.6, repeat: Infinity } }}>
                <span className="text-2xl">{member.emoji}</span>
                <span className="text-[10px]">{member.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {scene === 'mini3' && (
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
          <div className="relative rounded-3xl border border-white/15 bg-slate-950/90 p-4 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-400 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-950">Feast Crew</div>
            <div className="grid grid-cols-2 gap-3 text-white text-xs">
              <motion.div className="rounded-3xl bg-slate-900/80 p-3"
                animate={bounce}>
                <div className="text-4xl">{captain?.emoji}</div>
                <div className="mt-1 font-bold">{captain?.name}</div>
                <div className="text-[10px]">Laughing as the food flies.</div>
              </motion.div>
              <motion.div className="rounded-3xl bg-slate-900/80 p-3"
                animate={pulse}>
                <div className="text-4xl">{cook?.emoji}</div>
                <div className="mt-1 font-bold">{cook?.name}</div>
                <div className="text-[10px]">Serving giant dishes.</div>
              </motion.div>
              <motion.div className="rounded-3xl bg-slate-900/80 p-3"
                animate={{ y: [0, -3, 0], transition: { duration: 1.8, repeat: Infinity } }}>
                <div className="text-4xl">{shipwright?.emoji}</div>
                <div className="mt-1 font-bold">{shipwright?.name}</div>
                <div className="text-[10px]">Fixing the banquet table.</div>
              </motion.div>
              <motion.div className="rounded-3xl bg-slate-900/80 p-3"
                animate={pulse}>
                <div className="text-4xl">{musician?.emoji}</div>
                <div className="mt-1 font-bold">{musician?.name}</div>
                <div className="text-[10px]">Playing the celebration tune.</div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {scene === 'mini4' && (
        <div className="absolute inset-x-0 top-4 px-4">
          <div className="grid grid-cols-3 gap-2 text-white text-[11px]">
            <motion.div className="rounded-3xl bg-slate-950/85 border border-white/15 p-3"
              animate={pulse}>
              <div className="text-3xl">{archaeologist?.emoji}</div>
              <div className="font-bold">{archaeologist?.name}</div>
              <div>Examining ruins.</div>
            </motion.div>
            <motion.div className="rounded-3xl bg-slate-950/85 border border-white/15 p-3"
              animate={bounce}>
              <div className="text-3xl">{doctor?.emoji}</div>
              <div className="font-bold">{doctor?.name}</div>
              <div>Studying glowing fruits.</div>
            </motion.div>
            <motion.div className="rounded-3xl bg-slate-950/85 border border-white/15 p-3"
              animate={pulse}>
              <div className="text-3xl">{captain?.emoji}</div>
              <div className="font-bold">{captain?.name}</div>
              <div>Discovering treasure with the crew.</div>
            </motion.div>
          </div>
        </div>
      )}

      {scene === 'final' && (
        <div className="absolute inset-x-0 bottom-4 flex flex-col items-center px-4">
          <div className="grid grid-cols-5 gap-2 rounded-3xl border border-white/10 bg-slate-950/85 p-3 text-center text-white shadow-[0_0_30px_rgba(0,0,0,0.4)]">
            {CREW.map((member, index) => (
              <motion.div key={member.name}
                className="rounded-3xl bg-slate-900/80 p-3"
                animate={{ y: [0, -4, 0], transition: { duration: 2, repeat: Infinity, delay: index * 0.08 } }}>
                <div className="text-3xl">{member.emoji}</div>
                <div className="text-[10px] mt-1 font-bold">{member.name}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 text-[11px] text-slate-300">The full crew gathers around the treasure, cheering Mark Jay onward.</div>
        </div>
      )}

      {scene === 'birthday' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-8">
          <div className="absolute inset-x-0 top-6 flex justify-center gap-3">
            {['🎆','🎇','✨','🌟'].map((icon, index) => (
              <motion.div key={index} className="text-3xl"
                animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}>
                {icon}
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-3 rounded-3xl border border-white/10 bg-slate-950/90 p-4 shadow-[0_0_40px_rgba(0,0,0,0.45)]">
            {CREW.map(member => (
              <motion.div key={member.name}
                className="flex flex-col items-center justify-between rounded-3xl bg-slate-900/80 p-3 text-center text-white"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: CREW.indexOf(member) * 0.07 }}>
                <div className="text-3xl mb-1">{member.emoji}</div>
                <div className="text-[10px] uppercase tracking-[0.15em]">{member.role}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 rounded-3xl bg-slate-950/70 border border-yellow-400/20 px-4 py-3 text-center text-[12px] text-slate-100 shadow-[0_0_20px_rgba(255,215,0,0.12)]">
            The crew celebrates with laughter, applause, and a grand sunset behind the ship.
          </div>
        </div>
      )}
    </div>
  )
}
