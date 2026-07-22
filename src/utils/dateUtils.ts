import { DailyBoxOfficeItem } from "../types";

/**
 * Get Date object for yesterday relative to current time
 */
export function getYesterdayDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
}

/**
 * Format Date to YYYY-MM-DD (for <input type="date">)
 */
export function formatDateToYYYYMMDD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Convert YYYY-MM-DD to YYYYMMDD (for KOBIS API)
 */
export function toKobisDateStr(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

/**
 * Get YYYY-MM-DD date string shifted X days prior to base date (YYYYMMDD or YYYY-MM-DD)
 */
export function getRelativePastDateStr(baseDateStr: string, daysAgo: number): string {
  if (!baseDateStr) return "2026-07-01";
  const cleaned = baseDateStr.replace(/-/g, "");
  if (cleaned.length !== 8) return "2026-07-01";
  const y = parseInt(cleaned.slice(0, 4), 10);
  const m = parseInt(cleaned.slice(4, 6), 10) - 1;
  const d = parseInt(cleaned.slice(6, 8), 10);
  const dateObj = new Date(y, m, d);
  dateObj.setDate(dateObj.getDate() - daysAgo);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Generate fallback box office items ensuring all openDt values are on or before baseDate
 */
export function generateFallbackBoxOfficeList(baseDateStr: string): DailyBoxOfficeItem[] {
  return [
    { rnum: "1", rank: "1", rankInten: "0", rankOldAndNew: "OLD", movieCd: "20233219", movieNm: "호프", openDt: getRelativePastDateStr(baseDateStr, 7), salesAmt: "1344281460", salesShare: "66.9", salesInten: "-177957680", salesChange: "-11.7", salesAcc: "26601704300", audiCnt: "128899", audiInten: "-14163", audiChange: "-9.9", audiAcc: "2401617", scrnCnt: "2224", showCnt: "7696" },
    { rnum: "2", rank: "2", rankInten: "0", rankOldAndNew: "OLD", movieCd: "20261784", movieNm: "미니언즈 & 몬스터즈", openDt: getRelativePastDateStr(baseDateStr, 7), salesAmt: "185873530", salesShare: "9.2", salesInten: "14061300", salesChange: "8.2", salesAcc: "4247950130", audiCnt: "18765", audiInten: "1958", audiChange: "11.6", audiAcc: "410348", scrnCnt: "822", showCnt: "2003" },
    { rnum: "3", rank: "3", rankInten: "0", rankOldAndNew: "OLD", movieCd: "20259946", movieNm: "모아나 2", openDt: getRelativePastDateStr(baseDateStr, 14), salesAmt: "126872070", salesShare: "6.3", salesInten: "11849720", salesChange: "10.3", salesAcc: "8626153390", audiCnt: "12634", audiInten: "1540", audiChange: "13.9", audiAcc: "795817", scrnCnt: "667", showCnt: "1266" },
    { rnum: "4", rank: "4", rankInten: "0", rankOldAndNew: "OLD", movieCd: "20242402", movieNm: "눈동자", openDt: getRelativePastDateStr(baseDateStr, 28), salesAmt: "126467600", salesShare: "6.3", salesInten: "18399550", salesChange: "17", salesAcc: "14988909430", audiCnt: "12345", audiInten: "2128", audiChange: "20.8", audiAcc: "1453778", scrnCnt: "621", showCnt: "1030" },
    { rnum: "5", rank: "5", rankInten: "0", rankOldAndNew: "OLD", movieCd: "20259781", movieNm: "토이 스토리 5", openDt: getRelativePastDateStr(baseDateStr, 35), salesAmt: "84155290", salesShare: "4.2", salesInten: "6348440", salesChange: "8.2", salesAcc: "28502014390", audiCnt: "8400", audiInten: "890", audiChange: "11.9", audiAcc: "2766082", scrnCnt: "503", showCnt: "741" },
    { rnum: "6", rank: "6", rankInten: "0", rankOldAndNew: "OLD", movieCd: "20262902", movieNm: "다윗", openDt: getRelativePastDateStr(baseDateStr, 12), salesAmt: "32834750", salesShare: "1.6", salesInten: "1250550", salesChange: "4", salesAcc: "1642660820", audiCnt: "3362", audiInten: "120", audiChange: "3.7", audiAcc: "166370", scrnCnt: "306", showCnt: "369" },
    { rnum: "7", rank: "7", rankInten: "0", rankOldAndNew: "OLD", movieCd: "20252402", movieNm: "군체", openDt: getRelativePastDateStr(baseDateStr, 60), salesAmt: "13139400", salesShare: "0.7", salesInten: "1244050", salesChange: "10.5", salesAcc: "62587422650", audiCnt: "1252", audiInten: "127", audiChange: "11.3", audiAcc: "5943504", scrnCnt: "134", showCnt: "160" },
    { rnum: "8", rank: "8", rankInten: "0", rankOldAndNew: "NEW", movieCd: "20262381", movieNm: "사랑의 하츄핑", openDt: getRelativePastDateStr(baseDateStr, 0), salesAmt: "7866000", salesShare: "0.4", salesInten: "7866000", salesChange: "100", salesAcc: "7866000", audiCnt: "874", audiInten: "874", audiChange: "100", audiAcc: "874", scrnCnt: "4", showCnt: "4" },
    { rnum: "9", rank: "9", rankInten: "-1", rankOldAndNew: "OLD", movieCd: "20263530", movieNm: "마티 슈프림", openDt: getRelativePastDateStr(baseDateStr, 21), salesAmt: "8463100", salesShare: "0.4", salesInten: "-1208250", salesChange: "-12.5", salesAcc: "1279980730", audiCnt: "815", audiInten: "-66", audiChange: "-7.5", audiAcc: "118779", scrnCnt: "51", showCnt: "61" },
    { rnum: "10", rank: "10", rankInten: "10", rankOldAndNew: "OLD", movieCd: "20248252", movieNm: "와일드 씽", openDt: getRelativePastDateStr(baseDateStr, 45), salesAmt: "6654950", salesShare: "0.3", salesInten: "4904950", salesChange: "280.3", salesAcc: "12948384040", audiCnt: "713", audiInten: "510", audiChange: "251.2", audiAcc: "1341802", scrnCnt: "39", showCnt: "42" }
  ];
}

/**
 * Format YYYY-MM-DD to Korean date string e.g. "2026년 7월 21일 (화)"
 */
export function formatKoreanDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return dateStr;
  
  const dateObj = new Date(year, month - 1, day);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[dateObj.getDay()];

  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

/**
 * Helper to format numbers with commas e.g. 1,234,567
 */
export function formatNumber(val: string | number): string {
  const num = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(num)) return "0";
  return num.toLocaleString("ko-KR");
}

/**
 * Format currency in Korean Won e.g. 1.25억원 or 12,345,670원
 */
export function formatKoreanWon(val: string | number): string {
  const num = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(num)) return "0원";
  if (num >= 100000000) {
    const eon = (num / 100000000).toFixed(1);
    return `${eon}억원`;
  }
  if (num >= 10000) {
    const man = Math.floor(num / 10000);
    return `${formatNumber(man)}만원`;
  }
  return `${formatNumber(num)}원`;
}
