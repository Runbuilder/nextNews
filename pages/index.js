import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from '../components/Card';
import StockPrediction from '../components/StockPrediction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faUser, faComment, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';

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
  padding: 20px;
  padding-bottom: 80px; // Footer 높이만큼 패딩 추가
  text-align: center;
`;

const HeroSection = styled.div`
  position: relative;
  padding: 50px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  overflow: hidden;
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

const Footer = styled.footer`
  padding: 20px;
  text-align: center;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
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

  const recommendedPosts = sortedPosts
    .filter(post => post.추천 === true)
    .sort((a, b) => new Date(b.날짜) - new Date(a.날짜));

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
        <HeroSection>
          <VideoBackground autoPlay loop muted playsInline>
            <source src="/video.mp4" type="video/mp4" />
            브라우저가 비디오 태그를 지원하지 않습니다.
          </VideoBackground>
          <HeroContent>
            <Header>Rich <img src="/favicon.png" alt="favicon" style={{ width: '70px', height: '70px', verticalAlign: 'middle'  }} /> News</Header>
            <SubHeader>AI-Selected Latest Economic News</SubHeader>
            <Button onClick={handleButtonClick}>주 가 예 측</Button>
          </HeroContent>
        </HeroSection>
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
        <SectionTitle theme={theme}>Featured Posts</SectionTitle>
        <PostsContainer>
          {recommendedPosts.length > 0 ? (
            recommendedPosts.map((post, index) => (
              <Card 
                key={index}
                id={post.id} // 추가: 각 포스트의 고유 ID
                image={post.이모지}
                title={post.제목}
                date={post.날짜}
                content={post.내용}
                source={post.출처}
                category={post.카테고리}
                backgroundColor={post.색상}
                theme={theme}
                views={post.조회수} // 추가: 조회수
                likes={post.좋아요} // 추가: 좋아요 수
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
                id={post.id} // 추가: 각 포스트의 고유 ID
                image={post.이모지}
                title={post.제목}
                date={post.날짜}
                content={post.내용}
                source={post.출처}
                category={post.카테고리}
                backgroundColor={post.색상}
                theme={theme}
                views={post.조회수} // 추가: 조회수
                likes={post.좋아요} // 추가: 좋아요 수
              />
            ))}
          </PostsContainer>
        </InfiniteScroll>
      </MainContent>
      <Footer>
        <p style={{ margin: 0, textAlign: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>© 2024RunBuild</span>
        
          <a href="https://www.youtube.com/@runbuild" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
        </p>
      </Footer>
      <ThemeSwitch theme={theme} onClick={toggleTheme}>
        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
      </ThemeSwitch>
      {showPrediction && (
        <Overlay>
          <StockPrediction onClose={handleClosePrediction} theme={theme} />
        </Overlay>
      )}
    </Layout>
  );
};

export async function getStaticProps() {
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbxLtGd_RsGvsLrEvtDHsbaeEq7YnLzn8GzDV3UAQaEKESODls8UJQX70p-rJbKSfSXE/exec?action=getData';
  
  try {
    const res = await fetch(scriptUrl);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    console.log('원본 데이터:', JSON.stringify(data, null, 2));

    if (!Array.isArray(data)) {
      throw new Error('Received data is not an array');
    }

    const featuredPosts = data;

    return {
      props: {
        featuredPosts,
      },
    };
  } catch (error) {
    return {
      props: {
        featuredPosts: [],
        error: error.message,
      },
    };
  }
}

export default App;