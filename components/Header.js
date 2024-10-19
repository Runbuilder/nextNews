import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import LoginPopup from './LoginPopup'
import { Button } from "@/components/ui/button"

export default function Header() {
  const [loading, setLoading] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <>
      <header className="flex justify-between items-center px-5 bg-gray-100">
        <div className="flex items-center">
          {user && (
            <div className="flex items-center">
              <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" />
              <span className="font-bold">{user.user_metadata.full_name}</span>
            </div>
          )}
        </div>
        <div>
          {user ? (
            <Button onClick={handleLogout} variant="outline">로그아웃</Button>
          ) : (
            <Button 
              onClick={() => setIsPopupOpen(true)} 
              disabled={loading}
              variant="default"
            >
              로그인
            </Button>
          )}
        </div>
      </header>
      {isPopupOpen && <LoginPopup onClose={() => setIsPopupOpen(false)} />}
    </>
  )
}
