"use client";

import styled from "styled-components";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginButton from "@/components/LoginButton";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // ✅ 클라이언트에서만 렌더링되도록 변경

  const handleLoadingRedirect = () => {
    router.push("/loading"); // ✅ '/loading' 페이지로 이동 후 리포트 페이지로 이동
  };

  return (
    <Container>
      <ButtonWrapper>
        {session ? (
          <>
            <LogoWrapper>
              <Image
                src="/whoamai-main-logo.svg"
                width={450}
                height={500}
                alt="location"
              />
            </LogoWrapper>
            <DescriptionWrapper>
              <Description>
                Blogger 분석을 통해 노출된 개인정보를 찾아드릴게요! <span>🕵🏻</span> <br />
                Google 계정으로 로그인 해주세요.
              </Description>
            </DescriptionWrapper>
            <UserInfo>
              <ProfileImage src={session.user?.image || "/default-profile.png"} alt="User Image" />
              <UserName>{session.user?.name}</UserName>
              <LogoutButton onClick={() => signOut()}>로그아웃</LogoutButton>
            </UserInfo>
            <ReportButton onClick={handleLoadingRedirect}>Blogger 게시글 불러오기</ReportButton>
          </>
        ) : (
          <>
            <LogoWrapper>
              <Image
                src="/whoamai-main-logo.svg"
                width={450}
                height={500}
                alt="location"
              />
            </LogoWrapper>
            <DescriptionWrapper>
              <Description>
                Blogger 분석을 통해 노출된 개인정보를 찾아드릴게요! <span>🕵🏻</span> <br />
                Google 계정으로 로그인 해주세요.
              </Description>
            </DescriptionWrapper>
            <LoginButton />
          </>
        )}
      </ButtonWrapper>
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('/whoamai-bgimg.png') no-repeat center center fixed;
  background-size: cover;
  width: 100%;
  height: 100vh;
  padding: 0;
`;

const LogoWrapper = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  text-align: center;
  max-width: 600px;
`;

const Description = styled.p`
  color: #000;
  font-family: "AR One Sans";
  font-size: 25px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.6;
  text-align: center;

  span {
    display: inline-block;
    line-height: normal;
    vertical-align: middle;
    font-size: 32px;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: #f1f1f1;
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.15);
  font-size: 22px;
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const UserName = styled.p`
  font-size: 22px;
  font-weight: 600;
  color: #333;
`;

const LogoutButton = styled.button`
  background-color: #d9534f;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: 0.3s;

  &:hover {
    background-color: #c9302c;
  }
`;

const ReportButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 14px 22px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;
