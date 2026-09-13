export default function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <div style={{
        width: 36,
        height: 36,
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#6b7280', marginTop: 12 }}>Cargando...</p>
    </div>
  )
}
