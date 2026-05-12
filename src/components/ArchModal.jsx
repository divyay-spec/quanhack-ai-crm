export function ArchModal({ onClose }) {
  const steps = [
    { num: 1, label: 'Lead upload',                  note: 'CSV · paste text · manual form entry',                  bg: '#E6F1FB', text: '#0C447C', border: '#185FA5' },
    { num: 2, label: 'Data validation',              note: 'Dedup · field normalisation · completeness check',       bg: '#F1EFE8', text: '#444441', border: '#888780' },
    { num: 3, label: 'AI enrichment engine',         note: 'ICP score · meeting readiness · priority · summary',     bg: '#EEEDFE', text: '#3C3489', border: '#534AB7' },
    { num: 4, label: 'CRM database storage',         note: 'Lead records · pipeline status · audit trail',           bg: '#E1F5EE', text: '#085041', border: '#0F6E56' },
    { num: 5, label: 'Personalised email generation',note: 'Claude drafts cold emails per lead context',             bg: '#FAEEDA', text: '#633806', border: '#854F0B' },
    { num: 6, label: 'Dashboard + lead tracking',    note: 'Metrics · pipeline view · search & filter · scores',     bg: '#E1F5EE', text: '#085041', border: '#0F6E56' },
    { num: 7, label: 'Automated follow-up engine',   note: 'Smart timing · sentiment analysis · next-action recs',   bg: '#FAECE7', text: '#712B13', border: '#993C1D' },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 14, padding: '1.5rem', width: 460,
        maxHeight: '88vh', overflowY: 'auto', border: '0.5px solid #c8c6be',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>Workflow architecture</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 18, color: '#73726c' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i}>
              <div style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '10px 12px', borderRadius: 8,
                background: s.bg, border: `0.5px solid ${s.border}`,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6, background: '#fff',
                  border: `0.5px solid ${s.border}`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 12, fontWeight: 500, color: s.text, flexShrink: 0,
                }}>
                  {s.num}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: s.text }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: s.border, marginTop: 2 }}>{s.note}</div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3px 0', fontSize: 13, color: '#888780' }}>↓</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem', padding: '8px 12px', background: '#f1efe8', borderRadius: 8, fontSize: 11, color: '#73726c' }}>
          ↑ Stage 7 feeds back into Stage 4 when follow-up generates a new interaction
        </div>
      </div>
    </div>
  )
}
