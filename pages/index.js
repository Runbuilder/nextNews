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

// ... (이전의 styled-components 정의들은 그대로 유지)

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
  .sort((a, b) => b.좋아요 - a.좋아요)
  .slice(0, 3);

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

export async function getServerSideProps() {
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