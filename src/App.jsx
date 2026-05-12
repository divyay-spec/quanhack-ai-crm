import { useState, useRef } from 'react'
import { LeadCard } from './components/LeadCard.jsx'
import { LeadDetail } from './components/LeadDetail.jsx'
import { AddLeadModal } from './components/AddLeadModal.jsx'
import { ArchModal } from './components/ArchModal.jsx'
import { PipelineBar } from './components/ui.jsx'
import { callClaudeJSON } from './utils/claude.js'
import { SAMPLE_LEADS, STATUSES, STATUS_COLORS } from './data/sampleLeads.js'

export default function App() {
  const [leads, setLeads] = useState(SAMPLE_LEADS)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showArch, setShowArch] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [parsing, setParsing] = useState(false)
  const fileRef = useRef()

  /* ── Lead update helper ─────────────────────────────── */
  const updateLead = (updated) => {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l))
    if (selected?.id === updated.id) setSelected(updated)
  }

  /* ── AI Enrichment ──────────────────────────────────── */
  const enrichLead = async (lead) => {
    updateLead({ ...lead, loading: true })
    try {
      const data = await callClaudeJSON(
        `Lead: ${lead.name}, ${lead.title} at ${lead.company}.
         Industry: ${lead.industry}. Size: ${lead.size} employees. Location: ${lead.location}.
         Return JSON:
         {
           "score": <0-100 ICP fit integer>,
           "meetingScore": <0-100 meeting readiness integer>,
           "priority": "Hot|Warm|Cold",
           "summary": "<2-3 sentence prospect intelligence: pain points, buying signals, ICP fit>",
           "followUp": "<1 sentence smart follow-up recommendation with timing and channel>"
         }`,
        'You are a B2B sales intelligence AI. Return ONLY valid JSON, no markdown, no explanation.'
      )
      updateLead({
        ...lead,
        loading: false,
        score: data.score,
        meetingScore: data.meetingScore,
        priority: data.priority || 'Warm',
        summary: data.summary,
        followUp: data.followUp,
      })
    } catch {
      updateLead({
        ...lead,
        loading: false,
        score: 60,
        meetingScore: 50,
        priority: 'Warm',
        summary: 'AI enrichment failed. Please try again.',
        followUp: 'Follow up in 3–5 business days via email.',
      })
    }
  }

  const enrichAll = () =>
    leads.filter(l => !l.score && !l.loading).forEach(enrichLead)

  /* ── CSV import ─────────────────────────────────────── */
  const handleCSV = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''))
    const newLeads = lines.slice(1).map((line, i) => {
      const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const obj = {}
      headers.forEach((h, idx) => { obj[h] = vals[idx] || '' })
      return {
        id: Date.now() + i,
        name: obj.name || '',
        title: obj.title || '',
        company: obj.company || '',
        email: obj.email || '',
        phone: obj.phone || '',
        industry: obj.industry || '',
        size: obj.size || '11-50',
        location: obj.location || '',
        status: 'New',
        score: null,
        priority: '—',
        meetingScore: null,
        followUp: null,
        summary: null,
        email_draft: null,
        sentimentLabel: null,
        sentimentNote: null,
        loading: false,
      }
    }).filter(l => l.name || l.company)
    setLeads(prev => [...prev, ...newLeads])
    e.target.value = ''
  }

  /* ── Paste-text import ──────────────────────────────── */
  const parseAndImport = async () => {
    if (!pasteText.trim()) return
    setParsing(true)
    try {
      const arr = await callClaudeJSON(
        `Extract structured lead data from this text. Return a JSON array.
         Each object must have: name, title, company, email, phone, industry, size, location.
         Use empty string for missing fields.\n\n${pasteText}`,
        'Return ONLY a valid JSON array. No markdown, no explanation.'
      )
      const newLeads = arr.map((l, i) => ({
        ...l,
        id: Date.now() + i,
        status: 'New',
        score: null,
        priority: '—',
        meetingScore: null,
        followUp: null,
        summary: null,
        email_draft: null,
        sentimentLabel: null,
        sentimentNote: null,
        loading: false,
        size: l.size || '11-50',
      }))
      setLeads(prev => [...prev, ...newLeads])
      setPasteText('')
    } catch (err) {
      console.error('Parse error:', err)
    }
    setParsing(false)
  }

  /* ── Filter + search ────────────────────────────────── */
  const filtered = leads.filter(l => {
    const matchStatus = filter === 'All' || l.status === filter
    const q = search.toLowerCase()
    const matchSearch = !search ||
      l.name.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      l.industry?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  /* ── Stats ──────────────────────────────────────────── */
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    hot: leads.filter(l => l.priority === 'Hot').length,
    enriched: leads.filter(l => l.score !== null).length,
    won: leads.filter(l => l.status === 'Won').length,
  }

  /* ── Styles ─────────────────────────────────────────── */
  const s = {
    wrap:     { maxWidth: 900, margin: '0 auto', padding: '1.5rem 1rem', fontFamily: 'inherit' },
    metricRow:{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap' },
    metric:   { background: '#f1efe8', borderRadius: 8, padding: '10px 12px', flex: 1, minWidth: 100 },
    metLbl:   { fontSize: 11, color: '#73726c', marginBottom: 5 },
    metVal:   { fontSize: 20, fontWeight: 500 },
    importBox:{ background: '#f1efe8', borderRadius: 8, padding: '12px 14px', marginBottom: '1.25rem' },
    toolbar:  { display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' },
    grid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px,1fr))', gap: 10 },
    empty:    { textAlign: 'center', padding: '3rem 0', color: '#888780' },
  }

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: '#E6F1FB', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🚀</span>
            AI Lead CRM
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#73726c' }}>
            Import · enrich · score · email · follow-up · track
          </p>
        </div>
        <button onClick={() => setShowArch(true)} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
          🗺 View architecture
        </button>
      </div>

      {/* Metrics */}
      <div style={s.metricRow}>
        {[
          ['👥', 'Total leads', stats.total, '#378ADD'],
          ['⭐', 'New', stats.new, '#BA7517'],
          ['🔥', 'Hot leads', stats.hot, '#D85A30'],
          ['✦', 'Enriched', stats.enriched, '#7F77DD'],
          ['🏆', 'Won', stats.won, '#1D9E75'],
        ].map(([icon, label, value, color]) => (
          <div key={label} style={s.metric}>
            <div style={{ ...s.metLbl, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>{icon}</span>{label}
            </div>
            <div style={{ ...s.metVal, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: 11, color: '#73726c', marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
          <span>Pipeline distribution</span>
          <span style={{ display: 'flex', gap: 10 }}>
            {STATUSES.map(s => (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[s].dot }} />
                <span style={{ fontSize: 10 }}>{s}</span>
              </span>
            ))}
          </span>
        </div>
        <PipelineBar leads={leads} />
      </div>

      {/* Import strip */}
      <div style={s.importBox}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#73726c', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Lead upload
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => fileRef.current.click()} style={{ fontSize: 12 }}>
            📥 Import CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSV} />
          <input
            value={pasteText}
            onChange={e => setPasteText(e.target.value)}
            placeholder="Paste any lead info, LinkedIn bio, or raw text…"
            style={{ flex: 1, minWidth: 180, fontSize: 12 }}
          />
          <button
            onClick={parseAndImport}
            disabled={parsing || !pasteText.trim()}
            style={{ fontSize: 12, background: '#EEEDFE', color: '#3C3489', borderColor: '#534AB7' }}
          >
            {parsing ? '⟳ Parsing…' : 'Parse & import ↗'}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, company, industry…"
          style={{ flex: 1, minWidth: 160, fontSize: 12 }}
        />
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {['All', ...STATUSES].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                fontSize: 11, padding: '4px 9px',
                background: filter === status ? '#f1efe8' : 'none',
                fontWeight: filter === status ? 500 : 400,
                borderColor: filter === status ? '#a8a6a0' : '#d3d1c7',
              }}
            >
              {status}
            </button>
          ))}
        </div>
        <button onClick={enrichAll} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          ✦ Enrich all
        </button>
        <button
          onClick={() => setShowAdd(true)}
          style={{ fontSize: 12, background: '#E6F1FB', color: '#0C447C', borderColor: '#185FA5' }}
        >
          + Add lead
        </button>
      </div>

      {/* Lead grid */}
      {filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>😶</div>
          <div style={{ fontSize: 13 }}>No leads match this filter</div>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEnrich={() => enrichLead(lead)}
              onOpen={() => setSelected(lead)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAdd    && <AddLeadModal onClose={() => setShowAdd(false)}  onAdd={l => setLeads(p => [...p, l])} />}
      {selected   && <LeadDetail  lead={selected} onClose={() => setSelected(null)} onUpdate={updateLead} />}
      {showArch   && <ArchModal   onClose={() => setShowArch(false)} />}
    </div>
  )
}
