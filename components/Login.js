import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async (provider) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({ provider })
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={() => handleLogin('google')}
        disabled={loading}
      >
        {loading ? '로그인 중...' : 'Google로 로그인'}
      </button>
      <button
        onClick={() => handleLogin('kakao')}
        disabled={loading}
      >
        {loading ? '로그인 중...' : 'Kakao로 로그인'}
      </button>
    </div>
  )
}
