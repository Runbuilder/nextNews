import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from '../components/Card';
import StockPrediction from '../components/StockPrediction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faUser, faComment, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import HeroSection from '../components/HeroSection';
import LoginPopup from '../components/LoginPopup';
import { supabase } from '../lib/supabaseClient'; // Supabase 클라이언트 import

// 전역 스타일 정의
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => (theme === 'dark' ? '#333' : '#fff')};
    color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#333')};
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const MainContent = styled.div`
  flex: 1 0 auto;
  padding-bottom: 80px; // Footer 높이만큼 패딩 추가
  text-align: center;
`;


const VideoBackground = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translateX(-50%) translateY(-50%);
  z-index: -1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const Header = styled.h1`
  font-size: 2.8em;
  margin: 0;
  color: white;
  font-weight: 700;
`;

const SubHeader = styled.p`
  font-size: 1.2em;
  margin: 10px 0;
  color: white;
`;

const Button = styled.button`
  background-color: #ff4136;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1.3em;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  &:hover {
    background-color: #E7261F;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
  }
`;

const PostsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  gap: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#333333')};
  margin-top: 30px;
  margin-bottom: 1px;
  font-size: 2.1em;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
`;

const ThemeSwitch = styled.button`
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: ${({ theme }) => (theme === 'light' ? '#333' : '#fff')};
  color: ${({ theme }) => (theme === 'light' ? '#fff' : '#333')};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin: 20px auto;
`;


const App = ({ featuredPosts = [], error = null }) => {
  const [sortedPosts, setSortedPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [showPrediction, setShowPrediction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [showLoginPopup, setShowLoginPopup] = useState(false); // 로그인 팝업 상태 추가

  useEffect(() => {
    const sorted = [...featuredPosts].sort((a, b) => new Date(b.날짜) - new Date(a.날짜));
    setSortedPosts(sorted);
    setDisplayedPosts(sorted.slice(0, 10));
    setHasMore(sorted.length > 10);
  }, [featuredPosts]);

  const handleButtonClick = () => {
    setShowPrediction(true);
  };

  const handleClosePrediction = () => {
    setShowPrediction(false);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const openLoginPopup = () => {
    setShowLoginPopup(true); // 로그인 팝업 열기
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false); // 로그인 팝업 닫기
  };

  // const recommendedPosts = sortedPosts
  //   .filter(post => post.추천 === true)
  //   .sort((a, b) => new Date(b.날짜) - new Date(a.날짜));
  const recommendedPosts = sortedPosts
  .sort((a, b) => b.좋아요 - a.좋아요)  // '좋아요' 숫자를 기준으로 내림차순 정렬
  .slice(0, 3);  // 상위 3개만 선택
    

  const fetchMoreData = () => {
    if (displayedPosts.length >= sortedPosts.length) {
      setHasMore(false);
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedPosts(prevPosts => [
        ...prevPosts,
        ...sortedPosts.slice(prevPosts.length, prevPosts.length + 10)
      ]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <Layout>
      <GlobalStyle theme={theme} />
      <MainContent>
        <HeroSection onButtonClick={handleButtonClick} />
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
        <SectionTitle theme={theme}>Featured Posts</SectionTitle>
        <PostsContainer>
          {recommendedPosts.length > 0 ? (
            recommendedPosts.map((post, index) => (
              <Card 
                key={index}
                id={post.id}
                image={post.이모지}
                title={post.제목}
                date={post.날짜}
                content={post.내용}
                source={post.출처}
                category={post.카테고리}
                backgroundColor={post.색상}
                theme={theme}
                views={post.조회수}
                likes={post.좋아요}
              />
            ))
          ) : (
            <p>추천 뉴스가 없습니다.</p>
          )}
        </PostsContainer>
        <SectionTitle theme={theme}>Most Recent</SectionTitle>
        <InfiniteScroll
          dataLength={displayedPosts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={isLoading && <LoadingSpinner />}
          scrollThreshold={0.9}
        >
          <PostsContainer>
            {displayedPosts.map((post, index) => (
              <Card 
                key={index}
                id={post.id}
                image={post.이모지}
                title={post.제목}
                date={post.날짜}
                content={post.내용}
                source={post.출처}
                category={post.카테고리}
                backgroundColor={post.색상}
                theme={theme}
                views={post.조회수}
                likes={post.좋아요}
              />
            ))}
          </PostsContainer>
        </InfiniteScroll>
      </MainContent>
      <ThemeSwitch theme={theme} onClick={toggleTheme}>
        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
      </ThemeSwitch>
      {showPrediction && (
        <Overlay>
          <StockPrediction onClose={handleClosePrediction} theme={theme} />
        </Overlay>
      )}
      {showLoginPopup && <LoginPopup onClose={closeLoginPopup} theme={theme} />}
    </Layout>
  );
};

export async function getServerSideProps() {
  try {
    const { data, error } = await supabase
      .from('news1')
      .select('*')
      .order('날짜', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log("Fetched data:", data); // 서버 콘솔에 로그 출력

    return {
      props: {
        featuredPosts: data || [],
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        featuredPosts: [],
        error: error.message,
      },
    };
  }
}

export default App;
