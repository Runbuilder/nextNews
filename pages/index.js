import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import Card from '../components/Card';
import StockPrediction from '../components/StockPrediction';
import moneyImage from '@/public/money.jpg'; // 이미지 경로를 정확히 지정해주세요
import LoadingSpinner from '../components/LoadingSpinner';

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    // background-color: #E0FFFF; // 파스텔 계열의 푸른색
    
  background: linear-gradient(115deg,#2980B9, #6DD5FA,#FFFFFF);
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
  }

  #__next {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
`;

const MainContent = styled.div`
  flex: 1 0 auto;
  padding: 20px;
  text-align: center;
`;

const HeroSection = styled.div`
  background-image: url(${moneyImage.src});
  background-size: cover;
  background-position: center;
  padding: 50px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: white; // 모든 텍스트 색상을 ���색으로 변경
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5); // 텍트 가독성을 위한 그림자 추가
`;

const Header = styled.h1`
  font-size: 3.5em;
  margin: 0;
  color: white;
  font-weight: 700;
`;

const SubHeader = styled.p`
  font-size: 1.2em;
  margin: 10px 0;
  color: white; // 명시적으로 흰색 지정
`;

const Button = styled.button`
  background-color: #FF4136;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 15px 30px;
  cursor: pointer;
  font-size: 1.2em;
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
  gap: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-top: 60px;
  margin-bottom: 30px;
  font-size: 2.1em;
  font-weight: 700;
`;

const Footer = styled.footer`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  text-align: center;
  flex-shrink: 0;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.2em;
  color: #666;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const App = ({ featuredPosts = [], error = null }) => {
  const [sortedPosts, setSortedPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [showPrediction, setShowPrediction] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const sorted = [...featuredPosts].sort((a, b) => new Date(b.날짜) - new Date(a.날짜));
    setSortedPosts(sorted);
    setDisplayedPosts(sorted.slice(0, 10)); // 초기에 더 많은 포스트를 표시
    setHasMore(sorted.length > 10);
  }, [featuredPosts]);

  const handleButtonClick = () => {
    setShowPrediction(true);
  };

  const handleClosePrediction = () => {
    setShowPrediction(false);
  };

  // 추천 뉴스도 날짜순으로 정렬
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
    <>
      <GlobalStyle />
      <MainContent>
        <HeroSection>
          <Header>Rich News</Header>
          <SubHeader>AI-Selected Latest Economic News</SubHeader>
          <Button onClick={handleButtonClick}>주가 예측하기</Button>
        </HeroSection>
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
        <SectionTitle>Featured Posts</SectionTitle>
        <PostsContainer>
          {recommendedPosts.length > 0 ? (
            recommendedPosts.map((post, index) => (
              <Card 
                key={index}
                image={post.이모지}
                title={post.제목}
                date={post.날짜}
                content={post.내용}
                source={post.출처}
                category={post.카테고리}
                backgroundColor={post.색상} // 새로 추가된 색상 정보
              />
            ))
          ) : (
            <p>추천 뉴스가 없습니다.</p>
          )}
        </PostsContainer>
        <SectionTitle>Most Recent</SectionTitle>
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
                image={post.이모지}
                title={post.제목}
                date={post.날짜}
                content={post.내용}
                source={post.출처}
                category={post.카테고리}
                backgroundColor={post.색상} // 새로 추가된 색상 정보
              />
            ))}
          </PostsContainer>
        </InfiniteScroll>
      </MainContent>
      <Footer>
        by Runbuilder
      </Footer>
      {showPrediction && (
        <Overlay>
          <StockPrediction onClose={handleClosePrediction} />
        </Overlay>
      )}
    </>
  );
};

export async function getStaticProps() {
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbw6X_4heyrpjFoxkImtzSYTZGu8Ued9Gn-vekIjbKgpwURLOL7dtrwflF9o_TukGwMU/exec';
  
  try {
    const res = await fetch(scriptUrl);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const text = await res.text();
    const data = JSON.parse(text);

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
