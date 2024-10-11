import React from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const CardContainer = styled.div`
  width: 100%;
  max-width: 300px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(220, 240, 220, 0.9) 0%, rgba(180, 220, 180, 0.9) 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
  background-color: rgba(0, 100, 0, 0.7);
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
  color: #2c3e50;
`;

const CardDate = styled.p`
  color: #34495e;
  font-size: 0.9em;
`;

// formatDate 함수는 이전과 동일하게 유지

const Card = ({ image, title, date, content, source, category }) => {
  // handleCardClick 함수는 이전과 동일하게 유지

  return (
    <CardContainer onClick={handleCardClick}>
      <CategoryTag>{category}</CategoryTag>
      <CardImage>{image}</CardImage>
      <CardTitle>{title}</CardTitle>
      <CardDate>{formatDate(date)}</CardDate>
    </CardContainer>
  );
};

export default Card;
