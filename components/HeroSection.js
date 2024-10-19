import React from 'react';
import styled from 'styled-components';

const HeroSectionWrapper = styled.div`
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const Header = styled.h1`
  font-size: 2.8em;
  margin: 0;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

const SubHeader = styled.p`
  font-size: 1.2em;
  margin: 0;
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

const HeroSection = ({ onButtonClick }) => {
  return (
    <HeroSectionWrapper>
      <VideoBackground autoPlay loop muted playsInline>
        <source src="/video.mp4" type="video/mp4" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </VideoBackground>
      <HeroContent>
        <Header>
          Rich 
          <img src="/favicon.png" alt="favicon" style={{ width: '70px', height: '70px', margin: '0 10px' }} />
          News
        </Header>
      </HeroContent>
        <SubHeader>AI-Selected Latest Economic News</SubHeader>
        <div>
        </div>
        <Button onClick={onButtonClick}>주 가 예 측</Button>
    </HeroSectionWrapper>
  );
};

export default HeroSection;
