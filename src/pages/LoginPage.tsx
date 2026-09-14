import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import type { LoginResponse } from '../types'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const sessionExpired = sessionStorage.getItem('sessionExpired')
  sessionStorage.removeItem('sessionExpired')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await client.post<LoginResponse>('/api/auth/login', {
        username,
        password,
      })
      localStorage.setItem('token', data.token)
      navigate('/employees')
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '100px auto', padding: 24 }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        {sessionExpired && (
          <p style={{ color: '#b45309', background: '#fef9c3', padding: '8px 12px', borderRadius: 6, marginBottom: 8 }}>
            Tu sesión expiró. Inicia sesión nuevamente.
          </p>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 8 }}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
