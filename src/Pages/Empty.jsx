import React from "react";
import styled, { keyframes } from "styled-components";

// Animation for fade-in effect
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const ComingSoonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  background: linear-gradient(135deg, #eef2f3, #d1d8e0);
  color: #2c3e50;
  font-family: "DM Sans", sans-serif;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin: 10px 0 20px;
  color: #7f8c8d;
  animation: ${fadeIn} 1.5s ease-in-out;
`;

const Message = styled.p`
  font-size: 1rem;
  margin: 5px 0;
  color: #95a5a6;
  animation: ${fadeIn} 2s ease-in-out;
`;

const PlaceholderBox = styled.div`
  margin-top: 30px;
  padding: 20px;
  border: 2px dashed #bdc3c7;
  border-radius: 10px;
  background: #f9fafc;
  color: #7f8c8d;
  font-size: 0.9rem;
  text-align: center;
  animation: ${fadeIn} 2.5s ease-in-out;
`;

const FeedbackNote = styled.div`
  margin-top: 30px;
  font-size: 1rem;
  color: #27ae60;
  animation: ${fadeIn} 3s ease-in-out;
`;

// Component
const ComingSoon = () => {
  return (
    <ComingSoonContainer>
      <Title>🚀 Coming Soon</Title>
      <Subtitle>Yet to Integrate Data for other Phases </Subtitle>
      <Message>
        We're waiting for feedback before proceeding with data integration.
      </Message>
      <PlaceholderBox>
        Placeholder for upcoming data visualization and components.
      </PlaceholderBox>
      <FeedbackNote>✔ Awaiting for feedback ...</FeedbackNote>
    </ComingSoonContainer>
  );
};

export default ComingSoon;
