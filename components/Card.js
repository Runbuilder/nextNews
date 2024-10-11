import React from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const CardContainer = styled.div`
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
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
  border-radius: 4px;
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
  color: #333;
`;

const CardDate = styled.p`
  color: #666;
  font-size: 0.9em;
`;

const formatDate = (dateString) => {
  const match = dateString.match(/(\d{4})(\d{2})\.(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return `${year}.${month}.${day}`;
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '날짜 없음';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
};

const Card = ({ image, title, date, content, source, category }) => {
  const categoryColor = `hsl(${Math.random() * 360}, 70%, 30%)`;

  const handleCardClick = () => {
    Swal.fire({
      title: title,
      html: `<div style="font-size: 1.3em; max-width: 90vw; overflow: auto; text-align: left;white-space: pre-wrap;">${content}</div>`,
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
      <CategoryTag color={categoryColor}>{category}</CategoryTag>
      <CardImage>{image}</CardImage>
      <CardTitle>{title}</CardTitle>
      <CardDate>{formatDate(date)}</CardDate>
    </CardContainer>
  );
};

export default Card;
