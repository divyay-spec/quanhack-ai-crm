import { Avatar, Chip, ScoreRing } from './ui.jsx'
import { STATUS_COLORS, PRIORITY_COLORS, SENTIMENT_COLORS } from '../data/sampleLeads.js'

export function LeadCard({ lead, onEnrich, onOpen }) {
  return (
    <div
      onClick={onOpen}
      style={{
        background: '#fff', border: '0.5px solid #d3d1c7',
        borderRadius: 12, padding: '1rem 1.125rem',
        display: 'flex', flexDirection: 'column', gap: 9,
        cursor: 'pointer', transition: 'border-color .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#a8a6a0'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#d3d1c7'}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
          <Avatar name={lead.name} size={34} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</div>
            <div style={{ fontSize: 11, color: '#73726c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.title}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          <Chip label={lead.status} colors={STATUS_COLORS[lead.status]} small />
          {lead.priority !== '—' && <Chip label={lead.priority} colors={PRIORITY_COLORS[lead.priority]} small />}
        </div>
      </div>

      {/* Company info */}
      <div style={{ fontSize: 11, color: '#73726c', display: 'flex', alignItems: 'center', gap: 5 }}>
        🏢 <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.company} · {lead.industry}</span>
      </div>
      <div style={{ fontSize: 11, color: '#73726c', display: 'flex', alignItems: 'center', gap: 5 }}>
        📍 {lead.location} · {lead.size} emp.
      </div>

      {/* Score rings */}
      {(lead.score !== null || lead.meetingScore !== null) && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <ScoreRing value={lead.score} size={40} label="ICP" color="#378ADD" />
          <ScoreRing value={lead.meetingScore} size={40} label="Ready" color="#1D9E75" />
          {lead.sentimentLabel && (
            <Chip label={lead.sentimentLabel} colors={SENTIMENT_COLORS[lead.sentimentLabel] || PRIORITY_COLORS['—']} small />
          )}
        </div>
      )}

      {/* Follow-up tip */}
      {lead.followUp && (
        <div style={{
          background: '#FAEEDA', borderRadius: 6, padding: '7px 9px',
          fontSize: 11, color: '#633806', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          💡 {lead.followUp}
        </div>
      )}

      {/* Enrich button */}
      <button
        onClick={e => { e.stopPropagation(); onEnrich() }}
        disabled={lead.loading}
        style={{ fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: 6 }}
      >
        {lead.loading
          ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span> Enriching…</>
          : <>✦ {lead.score ? 'Re-enrich' : 'Enrich with AI'}</>
        }
      </button>
    </div>
  )
}
