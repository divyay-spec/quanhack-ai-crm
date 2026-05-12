import { STATUS_COLORS, STATUSES } from '../data/sampleLeads.js'

const AVATAR_PALETTES = [
  ['#CECBF6', '#3C3489'], ['#9FE1CB', '#085041'], ['#F5C4B3', '#712B13'],
  ['#B5D4F4', '#0C447C'], ['#FAC775', '#633806'], ['#F4C0D1', '#72243E'],
]

export function Avatar({ name, size = 38 }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const [bg, fg] = AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 500, fontSize: size * 0.34, color: fg, flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

export function Chip({ label, colors, small = false }) {
  if (!label || label === '—') return null
  return (
    <span style={{
      background: colors.bg, color: colors.text,
      fontSize: small ? 10 : 11, fontWeight: 500,
      padding: small ? '2px 7px' : '3px 10px',
      borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: colors.dot, flexShrink: 0 }} />
      {label}
    </span>
  )
}

export function ScoreRing({ value, size = 44, label, color = '#378ADD' }) {
  if (value === null) return null
  const r = 16, circ = 2 * Math.PI * r, dash = (value / 100) * circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} fill="none" stroke="#e0dfd8" strokeWidth="3.5" />
        <circle cx="20" cy="20" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 20 20)" style={{ transition: 'stroke-dasharray .6s ease' }} />
        <text x="20" y="24" textAnchor="middle" fontSize="10" fontWeight="500" fill={color}>{value}</text>
      </svg>
      {label && (
        <span style={{ fontSize: 9, color: '#888780', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {label}
        </span>
      )}
    </div>
  )
}

export function PipelineBar({ leads }) {
  const total = leads.length || 1
  return (
    <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', height: 7, background: '#f1efe8' }}>
      {STATUSES.map(s => {
        const n = leads.filter(l => l.status === s).length
        return n > 0 ? (
          <div key={s} title={`${s}: ${n}`}
            style={{ width: `${(n / total) * 100}%`, background: STATUS_COLORS[s].dot, transition: 'width .4s' }} />
        ) : null
      })}
    </div>
  )
}

export function MetricCard({ icon, label, value, color }) {
  return (
    <div style={{ background: '#f1efe8', borderRadius: 8, padding: '10px 12px', flex: 1, minWidth: 100 }}>
      <div style={{ fontSize: 11, color: '#73726c', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 500, color }}>{value}</div>
    </div>
  )
}
