import "@/styles/globals.css";
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Header'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      <Header user={user} />
      <Component {...pageProps} user={user} />
    </>
  )
}

export default MyApp
