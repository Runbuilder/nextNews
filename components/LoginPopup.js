import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { supabase } from '../lib/supabaseClient'

export default function LoginPopup({ onClose, theme }) {
  const handleLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) throw error
      onClose() // 로그인 후 팝업 닫기
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-black bg-opacity-50' : 'bg-white bg-opacity-50'}`} style={{ zIndex: 2000 }}>
      <div className={`rounded-lg shadow-xl w-full max-w-md relative ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
          <Separator className="my-6" />
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleLogin('google')}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google로 로그인
            </Button>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90"
              onClick={() => handleLogin('kakao')}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2.25C6.61522 2.25 2.25 5.82 2.25 10.2C2.25 13.05 4.06478 15.54 6.79965 16.9172L5.67216 21.165C5.60405 21.3919 5.66371 21.6364 5.82986 21.8056C5.99601 21.9748 6.24276 22.0389 6.47111 21.9754L11.5746 20.1111C11.7159 20.1259 11.8578 20.1375 12 20.1375C17.3848 20.1375 21.75 16.5675 21.75 12.1875C21.75 7.80749 17.3848 4.2375 12 4.2375V2.25Z" fill="currentColor"/>
              </svg>
              Kakao로 로그인
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
