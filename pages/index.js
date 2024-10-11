import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const API_URL = 'https://openai.highbuff.com/';

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
`;

const PopupContent = styled.div`
  background-color: ${({ theme }) => (theme === 'dark' ? '#444' : 'white')}; // 테마에 따른 배경색
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#333')}; // 테마에 따른 글자색
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  z-index: 1000;
  width: 90%;
  max-width: 800px;
  text-align: center;
  box-sizing: border-box;
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#333')}; // 테마에 따른 글자색

  @media (max-width: 768px) {
    width: 95%;
    padding: 20px;
  }
`;

const Title = styled.h2`
  color: #333;
  font-size: 4.5rem; // 크기를 더 크게 조정
  margin-bottom: 3px;
  text-align: center; // 가운데 정렬
  font-weight: bold; // 글씨를 더 굵게 (선택사항)
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#333')}; // 테마에 따른 글자색

`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 20px; // 폰트 크기 증가
  max-width: 400px;

  @media (max-width: 480px) {
    width: 100%;
    font-size: 18px; // 모바일에서 폰트 크기 조정
  }
`;

const AnalyzeButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  white-space: nowrap;

  &:hover {
    background-color: #45a049;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4136;
  border-radius: 5px;

  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #ffffff;
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 5px;
  font-size: 18px;
  color: ${({ theme }) => (theme === 'dark' ? '#fff' : '#333')}; // 테마에 따른 글자색

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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 15px 25px; // 패딩 증가
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px; // 폰트 크기 증가
  white-space: nowrap;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  @media (max-width: 480px) {
    font-size: 18px; // 모바일에서 폰트 크기 조정
    padding: 12px 20px; // 모바일에서 패딩 조정
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px; // 버튼 간격 증가
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PredictButton = styled(Button)`
  background-color: #FF4136;
  &:hover {
    background-color: #E7261F;
  }
`;

const StockPrediction = ({ onClose, theme }) => {
  const [stockName, setStockName] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getStockForecast = async () => {
    if (!stockName) {
      setError("종목명을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch(`${API_URL}?method=portfolioAI&name=${encodeURIComponent(stockName)}`);
      const data = await response.text();

      if (data && data.startsWith('https://')) {
        setResult(`
          <h3>${stockName} 예측 차트</h3>
          <img src="${data}" alt="${stockName} 예측 차트" style="max-width: 100%; height: auto;" />
          <p>1) 장 거래 시간에만 예측 그래프가 표기되며, <strong>장외 시간에는 현재 시세 그래프만 표기</strong>됩니다.</p>
          <p>2) 예측 가능한 시간은 현시점에서 1분~5분 이내입니다. <strong>예측 성공률은 보장하지 않으며, 매수 매도 전에 참고용으로만 활용</strong>하시길 바랍니다.</p>
          <p>3) 예측 결과에 따라 사람이 직접 추격 매수 및 손절 할 경우, 매매 시간 지연에 따라 손실이 발생할 수 있으며, 시간 지연 문제에 도움을 받기 위해선 <a href="https://highbuff.com/person" target="_blank">HIGHBUFF AI</a> 서비스를 무료 체험해 보시길 바랍니다.</p>
          <p>4) 이 정보를 활용한 투자 책임은 본인에게 있으며, 자세한 알고리즘 및 기술에 관련된 자세한 정보는 <a href="https://highbuff.com/person" target="_blank">HIGHBUFF AI</a>에서 확인 가능합니다.</p>
        `);
      } else {
        setError(`${stockName}에 대한 예측 차트를 생성하기 위한 데이터가 충분하지 않습니다. 다른 종목을 입력해 주시기 바랍니다.`);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMarketCap = async (market) => {
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch(`${API_URL}?method=marketCap`);
      const data = await response.json();

      let html = `<h3>${market} 시가총액 순위</h3>`;

      if (data[market.toLowerCase()]) {
        html += createMarketCapTable(data[market.toLowerCase()]);
        html += '<p>위 종목 중 예측 차트를 보고 싶은 종목이 있다면 종목명을 입력해주세요.</p>';
      } else {
        html += `<p>${market} 시가총액 데이터를 불러오지 못했습니다.</p>`;
      }

      setResult(html);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createMarketCapTable = (data) => {
    let html = '<table style="width:100%; border-collapse: collapse;"><tr><th style="border: 1px solid #ddd; padding: 8px;">순위</th><th style="border: 1px solid #ddd; padding: 8px;">종목</th><th style="border: 1px solid #ddd; padding: 8px;">코드</th><th style="border: 1px solid #ddd; padding: 8px;">시가총액</th></tr>';
    data.forEach((item, index) => {
      html += `<tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.code}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${parseInt(item.marketCap).toLocaleString()}</td>
      </tr>`;
    });
    html += '</table>';
    return html;
  };

  const handleError = (error) => {
    console.error('Error:', error);
    setError("조회중 오류가 발생했습니다. 다시 시도해주세요.");
  };

  return (
    <Overlay>
      <PopupContent ref={popupRef} theme={theme}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>🧙‍♂️</Title>
        <InputContainer>
          <Input 
            type="text" 
            placeholder="종목명을 입력하세요" 
            value={stockName} 
            onChange={(e) => setStockName(e.target.value)}
          />
          <PredictButton onClick={getStockForecast}>예측 차트 보기</PredictButton>
        </InputContainer>
        <ButtonContainer>
          <Button onClick={() => getMarketCap('KOSPI')}>KOSPI 시가총액</Button>
          <Button onClick={() => getMarketCap('KOSDAQ')}>KOSDAQ 시가총액</Button>
        </ButtonContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : (
          result && <ResultContainer dangerouslySetInnerHTML={{ __html: result }} />
        )}
      </PopupContent>
    </Overlay>
  );
};

export default StockPrediction;
