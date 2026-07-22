import React, { useEffect, useState } from "react";
import { DailyBoxOfficeItem, MovieDetailInfo, AISummaryResponse, AIReviewResponse } from "../types";
import { formatNumber, formatKoreanWon } from "../utils/dateUtils";
import {
  X,
  Clapperboard,
  User,
  Users,
  Clock,
  Calendar,
  Globe,
  Film,
  Building,
  ShieldCheck,
  Sparkles,
  Loader2,
  Share2,
  AlertCircle,
  Tv,
  Check,
  PenTool,
  Star,
  Copy,
  MessageSquare,
  Send,
  ThumbsUp
} from "lucide-react";

interface MovieDetailModalProps {
  movieCd: string;
  boxOfficeItem?: DailyBoxOfficeItem;
  onClose: () => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movieCd,
  boxOfficeItem,
  onClose,
}) => {
  const [detail, setDetail] = useState<MovieDetailInfo | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // AI Review Generator States
  const [userNote, setUserNote] = useState<string>("");
  const [aiReview, setAiReview] = useState<AIReviewResponse | null>(null);
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewCopied, setReviewCopied] = useState<boolean>(false);
  const [showReviewInput, setShowReviewInput] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchMovieDetails() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch movie info from KOBIS proxy
        const res = await fetch(`/api/movie/${movieCd}`);
        if (!res.ok) {
          throw new Error("영화 상세정보를 불러오는 데 실패했습니다.");
        }
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        const movieInfo = data.movieInfoResult?.movieInfo;
        if (!movieInfo) {
          throw new Error("영화 정보를 찾을 수 없습니다.");
        }

        if (isMounted) {
          setDetail(movieInfo);
          setLoading(false);

          // 2. Fetch AI Summary
          fetchAiSummary(movieInfo);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "오류가 발생했습니다.");
          setLoading(false);
        }
      }
    }

    async function fetchAiSummary(info: MovieDetailInfo) {
      try {
        setAiLoading(true);
        const genresStr = info.genres.map((g) => g.genreNm).join(", ");
        const directorsStr = info.directors.map((d) => d.peopleNm).join(", ");
        const actorsStr = info.actors.slice(0, 5).map((a) => a.peopleNm).join(", ");

        const res = await fetch("/api/ai-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movieNm: info.movieNm,
            genres: genresStr,
            directors: directorsStr,
            actors: actorsStr,
            openDt: info.openDt,
            audiAcc: boxOfficeItem?.audiAcc || "0",
          }),
        });

        if (res.ok) {
          const aiData = await res.json();
          if (isMounted) {
            setAiSummary(aiData);
          }
        }
      } catch (err) {
        console.error("AI summary fetch error:", err);
      } finally {
        if (isMounted) setAiLoading(false);
      }
    }

    fetchMovieDetails();

    return () => {
      isMounted = false;
    };
  }, [movieCd]);

  const handleShare = () => {
    if (navigator.clipboard) {
      const url = window.location.href;
      navigator.clipboard.writeText(`${detail?.movieNm || "영화"} - KOBIS 박스오피스 정보`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateReview = async () => {
    if (!userNote.trim()) {
      setReviewError("간단한 감상평 메모를 입력해주세요.");
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError(null);

      const genresStr = detail?.genres.map((g) => g.genreNm).join(", ") || "";
      const directorsStr = detail?.directors.map((d) => d.peopleNm).join(", ") || "";
      const actorsStr = detail?.actors.slice(0, 5).map((a) => a.peopleNm).join(", ") || "";

      const res = await fetch("/api/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieNm: detail?.movieNm || "영화",
          genres: genresStr,
          directors: directorsStr,
          actors: actorsStr,
          userNote: userNote.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("상세 감상평 생성 중 오류가 발생했습니다.");
      }

      const reviewData = await res.json();
      if (reviewData.error) {
        throw new Error(reviewData.error);
      }

      setAiReview(reviewData);
    } catch (err: any) {
      console.error("Generate AI Review error:", err);
      setReviewError(err.message || "감상평 생성에 실패했습니다.");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleCopyReview = () => {
    if (aiReview && navigator.clipboard) {
      const formattedText = `[${detail?.movieNm || "영화"} AI 상세 감상평]\n평점: ★ ${aiReview.rating}/5.0\n한줄평: ${aiReview.headline}\n\n${aiReview.detailedReview}\n\n추천: ${aiReview.recommendationReason}`;
      navigator.clipboard.writeText(formattedText);
      setReviewCopied(true);
      setTimeout(() => setReviewCopied(false), 2000);
    }
  };

  const presetNotes = [
    "🔥 배우들의 연기력이 압도적이었고 결말 반전이 소름 돋았음",
    "🎬 신선한 소재와 뛰어난 연출 덕분에 몰입감 대박",
    "😢 인물들의 서사가 감동적이라 눈물샘 자극",
    "🎵 OST와 영상미의 조화가 예술적이었음",
    "🍿 부담 없이 유쾌하게 즐기기 좋은 최고의 오락 영화"
  ];

  // Helper for watch grade color badge
  const renderWatchGradeBadge = (gradeStr?: string) => {
    if (!gradeStr) return null;

    let colorClasses = "bg-slate-800 text-slate-300 border-slate-700";
    if (gradeStr.includes("전체")) {
      colorClasses = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    } else if (gradeStr.includes("12")) {
      colorClasses = "bg-blue-500/20 text-blue-300 border-blue-500/40";
    } else if (gradeStr.includes("15")) {
      colorClasses = "bg-amber-500/20 text-amber-300 border-amber-500/40";
    } else if (gradeStr.includes("18") || gradeStr.includes("청소년") || gradeStr.includes("불가")) {
      colorClasses = "bg-rose-500/20 text-rose-300 border-rose-500/40";
    }

    return (
      <span className={`text-xs px-2.5 py-1 rounded-lg border font-semibold inline-flex items-center gap-1 ${colorClasses}`}>
        <ShieldCheck className="w-3.5 h-3.5" />
        {gradeStr}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative my-8 text-slate-100">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              영화 상세정보 (KOBIS)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
              <p className="text-sm font-medium">영화 상세정보를 로딩 중입니다...</p>
            </div>
          ) : error ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-200 mb-1">상세정보 조회 실패</h4>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-colors"
              >
                닫기
              </button>
            </div>
          ) : detail ? (
            <div className="space-y-6">
              {/* Title & Basic Meta */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {renderWatchGradeBadge(detail.audits?.[0]?.watchGradeNm)}
                  {detail.genres.map((g) => (
                    <span
                      key={g.genreNm}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                    >
                      {g.genreNm}
                    </span>
                  ))}
                  {detail.prdtStatNm && (
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                      {detail.prdtStatNm}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
                  {detail.movieNm}
                </h2>
                {detail.movieNmEn && (
                  <p className="text-sm text-slate-400 italic mb-4">{detail.movieNmEn}</p>
                )}

                {/* Quick Facts Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      개봉일
                    </span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5">
                      {detail.openDt || "미정"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      상영시간
                    </span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5">
                      {detail.showTm ? `${detail.showTm}분` : "정보없음"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      제작국가
                    </span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5">
                      {detail.nations.map((n) => n.nationNm).join(", ") || "정보없음"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Film className="w-3.5 h-3.5 text-emerald-400" />
                      제작연도
                    </span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5">
                      {detail.prdtYear ? `${detail.prdtYear}년` : "정보없음"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Boxoffice Performance Stats (If opened from BoxOffice) */}
              {boxOfficeItem && (
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    박스오피스 성과 요약 ({boxOfficeItem.rank}위)
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[11px] text-slate-400">당일 관객수</div>
                      <div className="text-base font-black text-white mt-0.5">
                        {formatNumber(boxOfficeItem.audiCnt)}명
                      </div>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[11px] text-slate-400">누적 관객수</div>
                      <div className="text-base font-black text-amber-300 mt-0.5">
                        {formatNumber(boxOfficeItem.audiAcc)}명
                      </div>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[11px] text-slate-400">누적 매출액</div>
                      <div className="text-base font-black text-emerald-400 mt-0.5">
                        {formatKoreanWon(boxOfficeItem.salesAcc)}
                      </div>
                    </div>
                    <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[11px] text-slate-400">매출 점유율</div>
                      <div className="text-base font-black text-rose-400 mt-0.5">
                        {boxOfficeItem.salesShare}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Summary Card */}
              <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-purple-200">AI 영화 맞춤 분석</h4>
                  </div>
                  {aiLoading && (
                    <span className="text-xs text-purple-300 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> 분석 생성 중...
                    </span>
                  )}
                </div>

                {aiSummary ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-200 leading-relaxed font-normal bg-purple-950/20 p-3 rounded-xl border border-purple-500/20">
                      {aiSummary.summary}
                    </p>

                    {aiSummary.highlights && aiSummary.highlights.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-purple-300 mb-1.5">주요 매력 포인트</div>
                        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {aiSummary.highlights.map((item, idx) => (
                            <li
                              key={idx}
                              className="text-xs bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-300 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiSummary.recommendedAudience && (
                      <div className="text-xs text-slate-400 pt-1">
                        💡 <strong>추천 관객:</strong> {aiSummary.recommendedAudience}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    AI 분석 정보를 로딩하는 중이거나 Gemini API 설정이 준비 중입니다.
                  </p>
                )}
              </div>

              {/* AI Detailed Review Generator Section */}
              <div className="bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border border-rose-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <PenTool className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-200 flex items-center gap-1.5">
                        AI 상세 감상평 작성기
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                          Gemini 2.5
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        간단한 한 줄 메모를 입력하면 전문 평론가 스타일의 상세 감상평을 자동 완성해드립니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input & Presets */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                      간단한 감상평 메모 작성
                    </label>
                    <textarea
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      placeholder="예: 배우들의 연기력이 대박이었고 후반부 반전 연출이 소름 돋았어요. 결말에 여운이 많이 남네요!"
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none"
                    />
                  </div>

                  {/* Preset Tags */}
                  <div>
                    <div className="text-[11px] text-slate-400 mb-1.5">💡 빠른 선택 예시 메모:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {presetNotes.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setUserNote(preset)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300 hover:text-white hover:border-rose-500/50 transition-all text-left"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {reviewError && (
                    <div className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  <button
                    onClick={handleGenerateReview}
                    disabled={reviewLoading || !userNote.trim()}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    {reviewLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI가 상세 감상평을 정교하게 작성 중입니다...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>상세 감상평 생성하기</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Generated AI Review Display */}
                {aiReview && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 animate-in fade-in duration-300 mt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-1 text-amber-400 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(aiReview.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-700"
                              }`}
                            />
                          ))}
                          <span className="text-xs font-bold text-amber-300 ml-1">
                            {aiReview.rating.toFixed(1)} / 5.0
                          </span>
                        </div>
                        <h5 className="text-sm font-black text-white">{aiReview.headline}</h5>
                      </div>

                      <button
                        onClick={handleCopyReview}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        {reviewCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">복사 완료</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>감상평 복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Key points tags */}
                    {aiReview.keyPoints && aiReview.keyPoints.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {aiReview.keyPoints.map((point, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium"
                          >
                            #{point}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Detailed Body Paragraphs */}
                    <div className="text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-line bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      {aiReview.detailedReview}
                    </div>

                    {/* Recommendation note */}
                    {aiReview.recommendationReason && (
                      <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-start gap-2">
                        <ThumbsUp className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>추천 대상:</strong> {aiReview.recommendationReason}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Directors & Staff */}
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-400" />
                  감독
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detail.directors && detail.directors.length > 0 ? (
                    detail.directors.map((d) => (
                      <div
                        key={d.peopleNm}
                        className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2"
                      >
                        <span>{d.peopleNm}</span>
                        {d.peopleNmEn && (
                          <span className="text-slate-400 text-[11px]">({d.peopleNmEn})</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">감독 정보 없음</span>
                  )}
                </div>
              </div>

              {/* Cast / Actors */}
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-rose-400" />
                  출연 배우
                </h4>
                {detail.actors && detail.actors.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {detail.actors.map((actor, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs flex flex-col justify-between"
                      >
                        <span className="font-bold text-slate-200">{actor.peopleNm}</span>
                        {actor.cast && (
                          <span className="text-[11px] text-amber-400/90 truncate mt-0.5">
                            {actor.cast} 역
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">출연진 정보 없음</span>
                )}
              </div>

              {/* Production Companies & Distributors */}
              {detail.companys && detail.companys.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-400" />
                    제작/배급사
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {detail.companys.map((company, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300"
                      >
                        <span className="text-slate-400 mr-1 text-[11px]">[{company.companyPartNm}]</span>
                        <strong className="text-slate-200">{company.companyNm}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>정보 클립보드 복사</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-rose-600/20"
                >
                  확인 닫기
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
