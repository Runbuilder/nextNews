import React from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

// pastelColors 배열은 이제 사용하지 않으므로 제거합니다.

const CardContainer = styled.div`
  width: 100%;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(135deg, #E0F7FA, #B3E5FC);
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.2);
  }
`;

const CategoryTag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: ${props => props.backgroundColor || '#4CAF50'};
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
  margin: 12px 0;
  font-size: 1.3em;
  color: #333;
  font-weight: 700;
`;

const CardDate = styled.p`
  color: #666;
  font-size: 0.9em;
  font-weight: 300;
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

const Card = ({ image, title, date, content, source, category, backgroundColor }) => {
  const categoryColor = `hsl(${Math.random() * 360}, 70%, 30%)`; // 카테고리 색상은 여전히 랜덤으로 설정

  const handleCardClick = () => {
    Swal.fire({
      title: title,
      html: `<div style="font-size: 1.3em; max-width: 90vw; overflow: auto;  text-align: left;white-space: pre-wrap;">${content}</div>`,
      showCancelButton: true,
      cancelButtonText: "닫기",
      confirmButtonText: "뉴스기사",
      width: 'auto',
      maxWidth: '90%',
      customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup',
        htmlContainer: 'custom-html-container'
      },
      grow: 'row',
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(source, '_blank');
      }
    });
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <CategoryTag backgroundColor={backgroundColor}>{category}</CategoryTag>
      <CardImage>{image}</CardImage>
      <CardTitle>{title}</CardTitle>
      <CardDate>{formatDate(date)}</CardDate>
    </CardContainer>
  );
};

export default Card;