"use client";

import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// AI 응답 데이터의 타입 정의
interface AIResponse {
  id: string;
  question: string;
  answer: string;
  evidence: string;
  source_texts: string[];
  source_images: string[];
}

const WhoAmAIReport: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [aiResponses, setAiResponses] = useState<AIResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchAIResponse() {
      try {
        setLoading(true);

        // 1) Blogger API에서 데이터 가져오기
        const bloggerResponse = await fetch("/api/getBloggerData");
        const bloggerData = await bloggerResponse.json();
        console.log("📢 Blogger Data:", bloggerData);

        if (!bloggerData || !bloggerData.items) {
          setAiResponses([]);
          setLoading(false);
          return;
        }

        // 2) Flask 서버로 bloggerData 전체 전송
        const flaskResponse = await fetch("http://54.252.133.31/process_json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bloggerData),
        });
        const flaskData = await flaskResponse.json();
        console.log("📢 Flask Data:", flaskData);

        if (flaskData.response && Array.isArray(flaskData.response)) {
          setAiResponses(flaskData.response);
        } else {
          setAiResponses([]);
        }
      } catch (error) {
        console.error("⚠️ Error fetching AI response:", error);
        setAiResponses([]);
      }
      setLoading(false);
    }

    fetchAIResponse();
  }, []);

  if (!isClient) return null;

  return (
    <MainContainer>
      <Header>
        <Image
          src="/report-logo.png"
          width={150}
          height={30}
          alt="location"
          onClick={() => router.push("/")}
        />
        <BackButton onClick={() => router.push("/")}>홈으로 돌아가기</BackButton>
      </Header>
      <RobotContentWrapper>
        <FixedRobotImage
          src={loading ? "/whoamai-robot-1.svg" : "/whoamai-robot.svg"}
          width={500}
          height={500}
          alt="로봇 이미지"
          onClick={() => router.push("/")}
        />
        <ReportPageWrapper>
          <SummaryWrapper>
            <Summary>
              <Section1>
                <ProfileContainer>
                  <ProfileImage
                    src={session?.user?.image || "/base-image.svg"}
                    alt="Profile"
                  />
                  <ProfileDetails>
                    <Username>{session?.user?.name || "@unknown_user"}</Username>
                  </ProfileDetails>
                </ProfileContainer>
                <CenteredContent>
                  <DescriptionTitle>
                    제가 예측할 수 있는 {session?.user?.name} 님의 정보는 아래와 같아요.
                  </DescriptionTitle>
                </CenteredContent>
              </Section1>
            </Summary>
            <Section2>
              {loading ? (
                <LoadingText>🚀 AI 응답 생성 중...</LoadingText>
              ) : aiResponses.length > 0 ? (
                aiResponses.map((response) => (
                  <Content key={response.id}>
                    <QuestionText>❓ {response.question}</QuestionText>
                    <AnswerText>💡 {response.answer}</AnswerText>
                    <EvidenceText>📌 {response.evidence}</EvidenceText>
                    {response.source_texts.length > 0 && (
                      <SourceSection>
                        <h4>📄 참고 텍스트:</h4>
                        {response.source_texts.map((text, index) => (
                          <SourceText key={index}>{text}</SourceText>
                        ))}
                      </SourceSection>
                    )}
                    {response.source_images.length > 0 && (
                      <SourceSection>
                        <h4>🖼️ 참고 이미지:</h4>
                        <ImageGrid>
                          {response.source_images.map((img, index) => (
                            <SourceImage key={index} src={img} alt={`출처 이미지 ${index + 1}`} />
                          ))}
                        </ImageGrid>
                      </SourceSection>
                    )}
                  </Content>
                ))
              ) : (
                <NoDataText>⚠️ AI 분석 결과가 없습니다.</NoDataText>
              )}
            </Section2>
          </SummaryWrapper>
        </ReportPageWrapper>
      </RobotContentWrapper>
    </MainContainer>
  );
};

export default WhoAmAIReport;

const MainContainer = styled.main`
  background: url('/whoamai-bgimg.png') no-repeat center center fixed;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 5%;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
`;

const BackButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const RobotContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

// 로봇 이미지를 스크롤 시에도 왼쪽 중앙에 고정되도록 styled-component 추가
const FixedRobotImage = styled(Image)`
  position: fixed;
  left: 20px;           /* 화면 왼쪽으로부터 20px 간격 */
  top: 50%;             /* 화면 세로 중앙 */
  transform: translateY(-50%); /* 이미지의 세로 중앙을 기준으로 위치 조정 */
  z-index: 1000;        /* 다른 요소보다 위에 표시 */

  /* 뷰포트 크기에 비례한 너비 설정 */
  width: 35vw;
  height: auto;           /* 높이는 너비에 비례해서 자동 조절 */

  /* 너무 커지거나 작아지지 않도록 제한 추가 */
  max-width: 500px;
  min-width: 200px;
`;

const ReportPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  margin-top: 10px;
`;

const SummaryWrapper = styled.div`
  width: 70%;
`;

const Summary = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Section1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Section2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const ProfileDetails = styled.div`
  margin-top: 20px;
  color: #000;
  text-align: center;
`;

const Username = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CenteredContent = styled.div`
  width: 100%;
  text-align: center;
`;

const DescriptionTitle = styled.div`
  font-size: 1rem;
  color: #555;
`;

const Content = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
`;

const QuestionText = styled.h3`
  color: #000;
  font-weight: bold;
`;

const AnswerText = styled.p`
  font-size: 1.1rem;
  color: #007bff;
`;

const EvidenceText = styled.p`
  font-size: 1rem;
  color: #000;
`;

const SourceSection = styled.div`
  color: #000;
  margin-top: 10px;
`;

const SourceText = styled.p`
  font-size: 0.9rem;
  color: #000;
`;

const ImageGrid = styled.div`
  display: flex;
  gap: 10px;
`;

const SourceImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
`;

const NoDataText = styled.p`
  font-size: 1rem;
  color: #000;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #000;
`;
