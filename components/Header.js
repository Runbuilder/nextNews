import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Header({ user }) {
  const [loading, setLoading] = useState(false)

  const handleLogin = async (provider) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <h1>내 웹사이트</h1>
      <div>
        {user ? (
          <button onClick={handleLogout}>로그아웃</button>
        ) : (
          <>
            <button onClick={() => handleLogin('google')} disabled={loading}>
              Google 로그인
            </button>
            <button onClick={() => handleLogin('kakao')} disabled={loading} style={{ marginLeft: '10px' }}>
              Kakao 로그인
            </button>
          </>
        )}
      </div>
    </header>
  )
}

