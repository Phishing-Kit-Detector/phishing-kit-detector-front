import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("📢 Flask로 데이터 전송 API 호출됨!");

  try {
    const bloggerData = await req.json(); // Blogger 데이터를 가져옴

    console.log("📢 Blogger 데이터:", bloggerData);

    // Flask 서버로 요청 전송
    const flaskUrl = "http://54.252.133.31:5000/process_json"; // Flask API 주소
    const flaskResponse = await fetch(flaskUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bloggerData),
    });

    const flaskData = await flaskResponse.json(); // Flask의 응답 받기

    console.log("✅ Flask 응답:", flaskData);

    return NextResponse.json(flaskData, { status: flaskResponse.status });
  } catch (error) {
    console.error("❌ Flask로 데이터 전송 실패:", error);
    return NextResponse.json({ error: "Failed to send data to Flask", details: error }, { status: 500 });
  }
}
