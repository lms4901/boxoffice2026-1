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
