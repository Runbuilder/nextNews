import { useState, useEffect } from 'react'
import { useRouter } from 'next/router' // Next.js의 useRouter 임포트
import { supabase } from '../lib/supabaseClient'
import LoginPopup from './LoginPopup'
import { Button } from "@/components/ui/button"

export default function Header() {
  const [loading, setLoading] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter() // useRouter 훅 사용
  const [isOnPostsPage, setIsOnPostsPage] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Current session:', session) // 세션 정보 출력
      setUser(session?.user ?? null)
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      console.log('Auth state changed:', session) // 인증 상태 변경 시 출력
      setUser(session?.user ?? null)
    })

    // 현재 페이지가 /posts인지 확인
    setIsOnPostsPage(router.pathname === '/posts')

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router.pathname])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      alert(error.message)
    }
  }

  const handleNavigation = () => {
    if (isOnPostsPage) {
      router.push('/') // 메인 페이지로 이동
    } else {
      router.push('/posts') // 게시판 페이지로 이동
    }
  }

  return (
    <>
      <header className="flex justify-between items-center px-5 bg-gray-100 pt-5">
        <div className="flex items-center">
          <Button onClick={handleNavigation} variant="default">
            {isOnPostsPage ? 'HOME' : 'COMMUNITY'}
          </Button>
        </div>
        <div>
          {user && (
            <div className="flex items-center">
              <img src={user.user_metadata.avatar_url} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" />
              <span className="font-bold">{user.user_metadata.full_name}</span>
            </div>
          )}
          {user ? (
            <Button onClick={handleLogout} variant="default">로그아웃</Button>
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
