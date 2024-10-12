import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const CardContainer = styled.div`
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  background-color: ${props => props.$backgroundColor || '#FFFFFF'}; // 기본값으로 흰색 설정
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-3px) translateX(-3px) scale(1.05);
    box-shadow: 0 8px 15px rgba(0,0,0,0.2);
  }

  @media (min-width: 768px) {
    width: calc(50% - 20px);
  }

  @media (min-width: 1024px) {
    width: calc(25% - 20px);
  }
`;

const CategoryTag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: ${props => props.color};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: bold;
`;

const CardImage = styled.div`
  font-size: 72px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h3`
  margin: 8px 0;
  font-size: 1.2em;
  color: #ffffff;
  flex-grow: 1;
`;

const CardDate = styled.p`
  position: absolute;
  top: 12px;
  right: 12px;
  color: #ffffff;
  font-size: 0.8em;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 12px;
  margin: 0;
`;

const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  font-size: 0.9em;
  margin-top: 10px;
`;

const formatDate = (dateString) => {
  // 입력된 날짜 문자열에서 연도, 월, 일을 추출합니다.
  const match = dateString.match(/(\d{4})(\d{2})\.(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return `${year}.${month}.${day}`;
  }
  
  // 기존 형식에 맞지 않는 경우, 원래의 formatDate 로직을 사용합니다.
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '날짜 없음';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
};

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Card = ({ id, image, title, date, content, source, category, backgroundColor, theme, views, likes }) => {
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentViews, setCurrentViews] = useState(views);
  const [isLiked, setIsLiked] = useState(false);
  const categoryColor = `hsl(${Math.random() * 360}, 70%, 30%)`;

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
    setIsLiked(!!likedPosts[id]);
  }, [id]);

  const incrementViews = async () => {
    try {
      await fetch(`https://script.google.com/macros/s/AKfycbxLtGd_RsGvsLrEvtDHsbaeEq7YnLzn8GzDV3UAQaEKESODls8UJQX70p-rJbKSfSXE/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'incrementViews',
          id: id,
        }),
      });
      setCurrentViews(prevViews => prevViews + 1);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const incrementLikes = async () => {
    if (isLiked) {
      Swal.fire('이미 좋아요를 누르셨습니다!', '한 게시물에 한 번만 좋아요를 누를 수 있습니다.', 'info');
      return;
    }

    try {
      await fetch(`https://script.google.com/macros/s/AKfycbxLtGd_RsGvsLrEvtDHsbaeEq7YnLzn8GzDV3UAQaEKESODls8UJQX70p-rJbKSfSXE/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'incrementLikes',
          id: id,
        }),
      });
      setCurrentLikes(prevLikes => prevLikes + 1);
      setIsLiked(true);
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      likedPosts[id] = true;
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      Swal.fire('좋아요!', '이 뉴스에 좋아요를 표시했습니다.', 'success');
    } catch (error) {
      console.error('Error incrementing likes:', error);
      Swal.fire('오류', '좋아요를 처리하는 중 문제가 발생했습니다.', 'error');
    }
  };

  const handleCardClick = async () => {
    incrementViews();
    Swal.fire({
      title: `<span style="font-size: 3.1em; text-align: center;">${image}</span>`,
      html: `
        <div style="font-size: 1.3em; max-width: 90vw; overflow: auto; text-align: left; white-space: pre-wrap; color: ${theme === 'dark' ? '#fff' : '#333'};">
          ${content}
        </div>
      `,
      showCancelButton: true,
      showDenyButton: true,
      cancelButtonText: "닫기",
      confirmButtonText: "뉴스기사",
      denyButtonText: isLiked ? "이미 좋아요 누름" : "👍 좋아요",
      denyButtonColor: isLiked ? '#ccc' : '#3085d6',
      width: 'auto',
      maxWidth: '90%',
      background: theme === 'dark' ? '#333' : '#fff',
      customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup',
        htmlContainer: 'custom-html-container'
      },
      grow: 'row',
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(source, '_blank');
      } else if (result.isDenied && !isLiked) {
        incrementLikes();
      }
    });
  };

  return (
    <CardContainer $backgroundColor={backgroundColor} onClick={handleCardClick}>
      <CategoryTag color={categoryColor}>{category}</CategoryTag>
      <CardDate>{formatDate(date)}</CardDate>
      <CardContent>
        <CardImage>{image}</CardImage>
        <CardTitle>{title}</CardTitle>
        <CardStats>
          <span>👀: {currentViews}</span>
          <span>👍: {currentLikes}</span>
        </CardStats>
      </CardContent>
    </CardContainer>
  );
};

export default Card;
