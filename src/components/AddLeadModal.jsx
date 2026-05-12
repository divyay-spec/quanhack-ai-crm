import { useState } from 'react'

const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+']

export function AddLeadModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', title: '', company: '', email: '',
    phone: '', industry: '', size: '11-50', location: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleAdd = () => {
    if (!form.name || !form.email) return
    onAdd({
      ...form,
      id: Date.now(),
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
    })
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 14, padding: '1.5rem',
        width: 460, border: '0.5px solid #c8c6be',
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Add new lead</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 17, color: '#73726c', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['name',     'Full name',  false],
            ['title',    'Job title',  false],
            ['company',  'Company',    true],
            ['email',    'Email',      true],
            ['phone',    'Phone',      false],
            ['industry', 'Industry',   false],
            ['location', 'Location',   false],
          ].map(([key, label, full]) => (
            <div key={key} style={{ gridColumn: full ? '1 / -1' : undefined }}>
              <label style={{ fontSize: 11, color: '#73726c', display: 'block', marginBottom: 3 }}>{label}</label>
              <input
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                placeholder={label}
                style={{ width: '100%', boxSizing: 'border-box', fontSize: 13 }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, color: '#73726c', display: 'block', marginBottom: 3 }}>Company size</label>
            <select value={form.size} onChange={e => set('size', e.target.value)} style={{ width: '100%', fontSize: 13 }}>
              {SIZES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: '1.25rem' }}>
          <button onClick={onClose} style={{ fontSize: 12 }}>Cancel</button>
          <button
            onClick={handleAdd}
            style={{ fontSize: 12, background: '#E6F1FB', color: '#0C447C', borderColor: '#185FA5' }}
          >
            Add lead
          </button>
        </div>
      </div>
    </div>
  )
}
