import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const KOBIS_KEY = process.env.KOBIS_API_KEY || "8272922945cc459865e60ce86a0f466d";

  // 1. Daily Box Office Proxy Route
  app.get("/api/boxoffice", async (req, res) => {
    try {
      const { date, multiMovieYn, repNationCd, itemPerPage } = req.query;

      if (!date || typeof date !== "string") {
        return res.status(400).json({ error: "date (YYYYMMDD) parameter is required" });
      }

      // Format date: remove hyphens if passed as YYYY-MM-DD
      const targetDt = date.replace(/-/g, "");

      let url = `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${KOBIS_KEY}&targetDt=${targetDt}`;
      if (multiMovieYn) url += `&multiMovieYn=${multiMovieYn}`;
      if (repNationCd) url += `&repNationCd=${repNationCd}`;
      if (itemPerPage) url += `&itemPerPage=${itemPerPage}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`KOBIS API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.faultInfo) {
        return res.status(500).json({ error: data.faultInfo.message || "KOBIS API Error" });
      }

      return res.json(data);
    } catch (err: any) {
      console.error("Box office API proxy error:", err);
      return res.status(500).json({ error: err.message || "Failed to fetch box office data" });
    }
  });

  // 2. Movie Detail Proxy Route
  app.get("/api/movie/:movieCd", async (req, res) => {
    try {
      const { movieCd } = req.params;

      if (!movieCd) {
        return res.status(400).json({ error: "movieCd parameter is required" });
      }

      const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${KOBIS_KEY}&movieCd=${movieCd}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`KOBIS API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.faultInfo) {
        return res.status(500).json({ error: data.faultInfo.message || "KOBIS API Error" });
      }

      return res.json(data);
    } catch (err: any) {
      console.error("Movie detail API proxy error:", err);
      return res.status(500).json({ error: err.message || "Failed to fetch movie details" });
    }
  });

  // 3. Optional AI Insights Route using Gemini API
  app.post("/api/ai-summary", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          summary: "AI 요약 기능은 GEMINI_API_KEY 설정 시 이용 가능합니다.",
          highlights: ["감독 및 배우 정보 확인 가능", "개봉일 및 누적 관객수 표시"],
          recommendedAudience: "모든 영화 관람객"
        });
      }

      const { movieNm, genres, directors, actors, openDt, audiAcc } = req.body;

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
당신은 박스오피스 영화 전문 평론가 및 추천 AI입니다.
다음 영화 정보를 바탕으로 3문장의 매력적인 요약과 주요 특징 3가지, 추천 관객층을 JSON으로 작성해주세요.

영화 제목: ${movieNm}
장르: ${genres || "미정"}
감독: ${directors || "미정"}
주요 출연: ${actors || "미정"}
개봉일: ${openDt || "미정"}
누적 관객수: ${audiAcc || 0}명

반드시 다음과 같은 JSON 형식으로만 응답해주세요 (다른 텍스트 없이 pure JSON):
{
  "summary": "영화 설명 요약 2~3문장",
  "highlights": ["매력포인트 1", "매력포인트 2", "매력포인트 3"],
  "recommendedAudience": "추천 관객층 (예: SF와 압도적 연출을 좋아하는 분)"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const responseText = response.text || "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json(parsed);
      } else {
        return res.json({
          summary: `${movieNm}은(는) ${genres} 장르의 흥미로운 작품입니다.`,
          highlights: [`감독: ${directors}`, `출연: ${actors}`],
          recommendedAudience: "해당 장르를 선호하는 모든 관객"
        });
      }
    } catch (err: any) {
      console.error("AI Summary error:", err);
      return res.json({
        summary: "영화 상세 정보가 준비되었습니다.",
        highlights: ["KOBIS 공식 데이터 조회 완료"],
        recommendedAudience: "영화 마니아"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
