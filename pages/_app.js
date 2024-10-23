import "@/styles/globals.css";
import React from 'react';
import { createGlobalStyle, keyframes } from 'styled-components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Header'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const Footer = styled.footer`
  padding: 20px;
  text-align: center;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradient} 15s ease infinite;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  a {
    color: #ffffff;
    margin: 0 10px;
    font-size: 24px;
    transition: color 0.3s ease;

    &:hover {
      color: #cccccc;
    }
  }
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const VisitorStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
  font-size: 14px;
`;

const StatItem = styled.span`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 15px;
`;

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [visitorStats, setVisitorStats] = useState({
    totalCount: 0,
    todayCount: 0,
    weekCount: 0,
    currentVisitors: 0
  })

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    const fetchAndUpdateVisitorStats = async () => {
      // 세션 스토리지에서 방문 기록 확인
      const lastVisit = sessionStorage.getItem('lastVisit')
      const now = new Date()
      const today = now.toDateString()

      if (lastVisit !== today) {
        // 오늘 첫 방문인 경우에만 카운트 증가
        const { data, error } = await supabase
          .from('visitor_stats')
          .select('*')
          .single()

        if (error) {
          console.error('방문자 통계 조회 오류:', error)
          return
        }

        const lastUpdated = new Date(data.last_updated)

        // 날짜가 변경되었다면 오늘 카운트 초기화
        if (now.toDateString() !== lastUpdated.toDateString()) {
          data.today_count = 0
        }

        // 주가 변경되었다면 이번 주 카운트 초기화
        if (now.getDay() < lastUpdated.getDay()) {
          data.week_count = 0
        }

        const newStats = {
          totalCount: data.total_count + 1,
          todayCount: data.today_count + 1,
          weekCount: data.week_count + 1,
          currentVisitors: data.current_visitors + 1
        }

        setVisitorStats(newStats)

        const { error: updateError } = await supabase
          .from('visitor_stats')
          .update({
            total_count: newStats.totalCount,
            today_count: newStats.todayCount,
            week_count: newStats.weekCount,
            current_visitors: newStats.currentVisitors,
            last_updated: now.toISOString()
          })
          .eq('id', 1)

        if (updateError) {
          console.error('방문자 통계 업데이트 오류:', updateError)
        }

        // 방문 기록 업데이트
        sessionStorage.setItem('lastVisit', today)
      } else {
        // 이미 방문한 경우 기존 통계만 가져오기
        const { data, error } = await supabase
          .from('visitor_stats')
          .select('*')
          .single()

        if (error) {
          console.error('방문자 통계 조회 오류:', error)
          return
        }

        setVisitorStats({
          totalCount: data.total_count,
          todayCount: data.today_count,
          weekCount: data.week_count,
          currentVisitors: data.current_visitors
        })
      }
    }

    fetchAndUpdateVisitorStats()

    // 페이지를 떠날 때 현재 접속자 수 감소
    const decreaseCurrentVisitors = async () => {
      await supabase
        .from('visitor_stats')
        .update({ current_visitors: visitorStats.currentVisitors - 1 })
        .eq('id', 1)
    }

    window.addEventListener('beforeunload', decreaseCurrentVisitors)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('beforeunload', decreaseCurrentVisitors)
    }
  }, [])

  return (
    <Layout>
      <GlobalStyle />
      <Header user={user} />
      <Component {...pageProps} user={user} />
      <Footer>
        <p style={{ margin: 0, textAlign: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>© 2024 RunBuild. All rights reserved.</span>
          <a href="https://www.youtube.com/@runbuild" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </p>
        <VisitorStats>
          <StatItem>누적: {visitorStats.totalCount}</StatItem>
          <StatItem>오늘: {visitorStats.todayCount}</StatItem>
          <StatItem>이번 주: {visitorStats.weekCount}</StatItem>
          <StatItem>현재: {visitorStats.currentVisitors}</StatItem>
        </VisitorStats>
      </Footer>
    </Layout>
  )
}

export default MyApp
