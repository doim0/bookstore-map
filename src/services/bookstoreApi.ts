import type { ApiBookstore, Bookstore } from "../types";

// 직접 호출 (CORS 에러 발생 가능)
const API_URL = "https://api.kcisa.kr/API_CNV_045/request";
const SERVICE_KEY = "de281c02-f61e-421f-9b16-b752b0b289a0";

// 공공 API 응답 타입 (실제 응답 구조)
interface ApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: ApiBookstore[];
      };
      numOfRows: string;
      pageNo: string;
      totalCount: string;
    };
  };
}

// 소수를 시간 형식으로 변환 (0.5 -> "12:00")
const convertDecimalToTime = (
  decimal: string | undefined
): string | undefined => {
  if (!decimal || decimal === "") return undefined;
  const num = parseFloat(decimal);
  if (isNaN(num)) return undefined;

  const hours = Math.floor(num * 24);
  const minutes = Math.floor((num * 24 - hours) * 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

// 전화번호 포맷팅 (하이픈 추가)
const formatPhoneNumber = (phone: string | undefined): string | undefined => {
  if (!phone) return undefined;
  // 숫자만 추출
  let numbers = phone.replace(/[^0-9]/g, "");
  if (numbers.length === 0) return undefined;

  // 앞에 0이 없으면 0을 붙임
  if (!numbers.startsWith("0")) {
    numbers = "0" + numbers;
  }

  // 02로 시작하는 서울 번호
  if (numbers.startsWith("02")) {
    if (numbers.length === 9) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(
        5
      )}`;
    } else if (numbers.length === 10) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(
        6
      )}`;
    }
  }
  // 010으로 시작하는 휴대폰 번호
  else if (numbers.startsWith("010")) {
    if (numbers.length === 10) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(
        6
      )}`;
    } else if (numbers.length === 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7
      )}`;
    }
  }
  // 그 외 지역번호
  else if (numbers.length === 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  } else if (numbers.length === 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  }

  return phone; // 형식을 알 수 없으면 원본 반환
};

// API 데이터를 앱에서 사용하는 형식으로 변환
export const convertApiToBookstore = (apiData: ApiBookstore): Bookstore => {
  return {
    id: apiData.ESNTL_ID,
    name: apiData.FCLTY_NM,
    address: apiData.FCLTY_ROAD_NM_ADDR,
    latitude: parseFloat(apiData.FCLTY_LA) || 37.5665,
    longitude: parseFloat(apiData.FCLTY_LO) || 126.978,
    category: apiData.MLSFC_NM || apiData.LCLAS_NM,
    phone: formatPhoneNumber(apiData.TEL_NO),
    openTime: convertDecimalToTime(apiData.WORKDAY_OPN_BSNS_TIME),
    closeTime: convertDecimalToTime(apiData.WORKDAY_CLOS_TIME),
    closedDays: apiData.RSTDE_GUID_CN,
    description: apiData.ADIT_DC || apiData.OPTN_DC,
    isUserAdded: false,
  };
};

// 중고서점 데이터 가져오기
export const fetchBookstores = async (
  pageNo: number = 1,
  numOfRows: number = 100
): Promise<Bookstore[]> => {
  try {
    const params = new URLSearchParams({
      serviceKey: SERVICE_KEY,
      numOfRows: numOfRows.toString(),
      pageNo: pageNo.toString(),
    });

    const url = `${API_URL}?${params}`;
    console.log("API 요청 URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("API 응답 오류:", response.status, response.statusText);
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    // 응답 타입 확인
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("잘못된 응답 타입:", contentType);
      const text = await response.text();
      console.error("응답 내용:", text.substring(0, 200));
      throw new Error("API가 JSON을 반환하지 않습니다. API 키를 확인하세요.");
    }

    const data: ApiResponse = await response.json();
    console.log("API 응답:", data);

    if (data.response?.header?.resultCode !== "0000") {
      console.error("API 결과 코드 오류:", data.response?.header);
      throw new Error(data.response?.header?.resultMsg || "API 오류");
    }

    // 안전하게 items 처리
    const items = data.response?.body?.items?.item || [];
    if (!Array.isArray(items)) {
      console.warn("API 응답에 배열이 없음:", items);
      return [];
    }

    return items.map(convertApiToBookstore);
  } catch (error) {
    console.error("서점 데이터 가져오기 실패:", error);
    // API 에러는 조용히 처리 (샘플 데이터로 대체)
    return [];
  }
};
