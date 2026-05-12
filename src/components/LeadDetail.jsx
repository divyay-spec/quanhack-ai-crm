import { useState } from 'react'
import { Avatar, Chip, ScoreRing } from './ui.jsx'
import { callClaude, callClaudeJSON } from '../utils/claude.js'
import { STATUS_COLORS, PRIORITY_COLORS, SENTIMENT_COLORS, STATUSES } from '../data/sampleLeads.js'

export function LeadDetail({ lead, onClose, onUpdate }) {
  const [tab, setTab] = useState('intel')
  const [busy, setBusy] = useState(false)
  const [sentimentInput, setSentimentInput] = useState('')

  const generateEmail = async () => {
    setBusy(true)
    try {
      const text = await callClaude(
        `Write a cold outreach email to ${lead.name}, ${lead.title} at ${lead.company}. Industry: ${lead.industry}. Size: ${lead.size} employees. Location: ${lead.location}. ICP score: ${lead.score}/100. Priority: ${lead.priority}. Keep under 150 words. Include a Subject: line. Value-first, not salesy.`,
        'You are a world-class B2B sales copywriter. Return ONLY the email: Subject: line, blank line, then body. No markdown, no explanation.'
      )
      onUpdate({ ...lead, email_draft: text })
      setTab('email')
    } catch (err) { console.error(err) }
    setBusy(false)
  }

  const analyzeSentiment = async () => {
    if (!sentimentInput.trim()) return
    setBusy(true)
    try {
      const data = await callClaudeJSON(
        `Analyze the sentiment of this reply and return JSON only: {"label":"Positive|Neutral|Negative|Objection","note":"<1 sentence sales insight + recommended next action>"}. Email: "${sentimentInput}"`,
        'You are a B2B sales coach. Return ONLY valid JSON, no markdown.'
      )
      onUpdate({ ...lead, sentimentLabel: data.label, sentimentNote: data.note })
      setSentimentInput('')
    } catch (err) { console.error(err) }
    setBusy(false)
  }

  const sentColors = SENTIMENT_COLORS[lead.sentimentLabel] || PRIORITY_COLORS['—']
  const TABS = ['intel', 'email', 'sentiment', 'details']

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 14, width: 560, maxHeight: '88vh',
        overflowY: 'auto', border: '0.5px solid #c8c6be', display: 'flex', flexDirection: 'column',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '0.5px solid #e0dfd8', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avatar name={lead.name} size={44} />
            <div>
              <div style={{ fontWeight: 500, fontSize: 15 }}>{lead.name}</div>
              <div style={{ fontSize: 12, color: '#73726c' }}>{lead.title} · {lead.company}</div>
              <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap' }}>
                <Chip label={lead.status} colors={STATUS_COLORS[lead.status]} />
                {lead.priority !== '—' && <Chip label={lead.priority} colors={PRIORITY_COLORS[lead.priority]} />}
                {lead.sentimentLabel && <Chip label={lead.sentimentLabel} colors={sentColors} />}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <ScoreRing value={lead.score} label="ICP" color="#378ADD" />
              <ScoreRing value={lead.meetingScore} label="Ready" color="#1D9E75" />
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 17, color: '#73726c' }}>✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '0.5px solid #e0dfd8', flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, background: 'none', border: 'none',
              borderBottom: tab === t ? '2px solid #1a1a18' : '2px solid transparent',
              padding: '9px 4px', cursor: 'pointer', fontSize: 12,
              fontWeight: tab === t ? 500 : 400,
              color: tab === t ? '#1a1a18' : '#73726c',
              textTransform: 'capitalize', borderRadius: 0,
            }}>
              {t === 'intel' ? 'AI Intel' : t === 'email' ? 'Cold Email' : t === 'sentiment' ? 'Sentiment' : t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: '1.25rem 1.5rem', flex: 1, overflowY: 'auto' }}>

          {tab === 'intel' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {lead.summary ? (
                <>
                  <div style={{ background: '#f8f7f4', borderRadius: 8, padding: '1rem', fontSize: 13, lineHeight: 1.7, color: '#5f5e5a' }}>
                    {lead.summary}
                  </div>
                  {lead.followUp && (
                    <div style={{ background: '#FAEEDA', border: '0.5px solid #BA7517', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span>💡</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: '#633806', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Follow-up recommendation</div>
                        <div style={{ fontSize: 12, color: '#633806', lineHeight: 1.6 }}>{lead.followUp}</div>
                      </div>
                    </div>
                  )}
                  {!lead.email_draft && (
                    <button onClick={generateEmail} disabled={busy} style={{ fontSize: 12, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {busy ? '⟳ Generating…' : '✉ Generate cold email'}
                    </button>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888780' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✦</div>
                  <div style={{ fontSize: 13 }}>Run AI enrichment on this lead to see intel here.</div>
                </div>
              )}
            </div>
          )}

          {tab === 'email' && (
            <div>
              {lead.email_draft ? (
                <>
                  <div style={{ background: '#f8f7f4', borderRadius: 8, padding: '1rem', fontSize: 12, lineHeight: 1.9, whiteSpace: 'pre-wrap', color: '#5f5e5a', fontFamily: 'monospace' }}>
                    {lead.email_draft}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                    <button onClick={generateEmail} disabled={busy} style={{ fontSize: 12 }}>⟳ Regenerate</button>
                    <button onClick={() => navigator.clipboard?.writeText(lead.email_draft)} style={{ fontSize: 12 }}>⎘ Copy</button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: 28, color: '#888780', marginBottom: 10 }}>✉</div>
                  <button onClick={generateEmail} disabled={busy} style={{ fontSize: 12 }}>
                    {busy ? '⟳ Generating…' : 'Generate cold email'}
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'sentiment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, color: '#73726c', lineHeight: 1.6 }}>
                Paste a reply you received from this lead. Claude will analyze the sentiment and suggest your next move.
              </div>
              <textarea
                value={sentimentInput}
                onChange={e => setSentimentInput(e.target.value)}
                placeholder="Paste their reply here…"
                style={{ width: '100%', boxSizing: 'border-box', minHeight: 100, fontSize: 12, resize: 'vertical' }}
              />
              <button onClick={analyzeSentiment} disabled={busy || !sentimentInput.trim()} style={{ fontSize: 12, alignSelf: 'flex-start' }}>
                {busy ? '⟳ Analyzing…' : 'Analyze sentiment ↗'}
              </button>
              {lead.sentimentLabel && (
                <div style={{ background: sentColors.bg, border: `0.5px solid ${sentColors.dot}`, borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <Chip label={lead.sentimentLabel} colors={sentColors} />
                    <span style={{ fontSize: 11, color: '#888780' }}>sentiment detected</span>
                  </div>
                  <div style={{ fontSize: 13, color: sentColors.text, lineHeight: 1.6 }}>{lead.sentimentNote}</div>
                </div>
              )}
            </div>
          )}

          {tab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                ['✉', 'Email', lead.email],
                ['📞', 'Phone', lead.phone],
                ['🏢', 'Company', lead.company],
                ['💼', 'Industry', lead.industry],
                ['👥', 'Company size', lead.size],
                ['📍', 'Location', lead.location],
              ].map(([icon, lbl, val]) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid #e0dfd8' }}>
                  <span style={{ fontSize: 14, width: 20 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: '#73726c', width: 96 }}>{lbl}</span>
                  <span style={{ fontSize: 13 }}>{val || '—'}</span>
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: '#73726c', marginBottom: 8 }}>Update status</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => onUpdate({ ...lead, status: s })} style={{
                      fontSize: 11, padding: '4px 10px',
                      background: lead.status === s ? STATUS_COLORS[s].bg : 'none',
                      color: lead.status === s ? STATUS_COLORS[s].text : '#73726c',
                      borderColor: lead.status === s ? STATUS_COLORS[s].dot : '#d3d1c7',
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
