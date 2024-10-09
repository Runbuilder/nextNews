// components/Card.js
import styled from 'styled-components';

const CardContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 10px;
  overflow: hidden;
  width: 100%;
  max-width: 300px;
`;

const CardImage = styled.img`
  width: 100%;
  height: auto;
`;

const CardContent = styled.div`
  padding: 15px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2em;
`;

const Date = styled.p`
  color: #888;
  font-size: 0.9em;
`;

const Card = ({ title, date, image }) => (
  <CardContainer>
    <CardImage src={image} alt={title} />
    <CardContent>
      <Title>{title}</Title>
      <Date>{date}</Date>
    </CardContent>
  </CardContainer>
);

export default Card;