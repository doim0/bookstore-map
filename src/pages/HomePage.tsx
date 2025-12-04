import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchBookstores } from "../services/bookstoreApi";
import { getUserBookstores } from "../services/firestoreService";
import Map from "../components/Map";
import Loading from "../components/Loading";
import type { Bookstore } from "../types";

export default function HomePage() {
  const { t } = useTranslation();
  const [bookstores, setBookstores] = useState<Bookstore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookstoreId, setSelectedBookstoreId] = useState<string | null>(
    null
  );

  const loadBookstores = async () => {
    setLoading(true);
    setError("");

    try {
      // 공공 API와 Firestore 데이터를 모두 가져오기
      const [apiStores, userStores] = await Promise.all([
        fetchBookstores(1, 417).catch((err) => {
          console.error("API 로드 실패:", err);
          return [];
        }),
        getUserBookstores().catch((err) => {
          console.error("Firestore 로드 실패:", err);
          return [];
        }),
      ]);

      // 두 데이터 합치기
      setBookstores([...userStores, ...apiStores]);
    } catch (err: any) {
      console.error("데이터 로드 실패:", err);
      setError(err.message || t("home.error"));
      setBookstores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookstores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 검색 필터링
  const filteredBookstores = bookstores.filter((store) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      store.name.toLowerCase().includes(searchLower) ||
      store.address.toLowerCase().includes(searchLower) ||
      (store.category && store.category.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return <Loading message={t("home.loading")} />;
  }

  // 에러가 있어도 페이지는 표시 (경고 메시지만 추가)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 에러 메시지 표시 */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">⚠️ 오류 발생</p>
          <p>{error}</p>
          <button
            onClick={loadBookstores}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            다시 시도
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {t("home.title")}
        </h1>

        {/* 검색창 */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("home.searchPlaceholder")}
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
          />
          <span className="absolute right-4 top-4 text-2xl">🔍</span>
        </div>

        {/* 통계 */}
        <div className="mt-4 text-gray-600">
          <span className="font-semibold text-xl">
            {t("home.totalStores")}: {filteredBookstores.length}
          </span>
          {searchTerm && (
            <span className="ml-4 text-blue-600">
              (검색 결과: {filteredBookstores.length}개)
            </span>
          )}
        </div>
      </div>

      {/* 지도와 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 지도 */}
        <div className="h-[600px] rounded-xl overflow-hidden shadow-xl">
          <Map
            bookstores={filteredBookstores}
            selectedBookstoreId={selectedBookstoreId}
          />
        </div>

        {/* 서점 목록 */}
        <div className="h-[600px] overflow-y-auto space-y-4 pr-2">
          {filteredBookstores.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-xl">😢</p>
              <p className="mt-2">{t("home.noResults")}</p>
            </div>
          ) : (
            filteredBookstores.map((store) => (
              <div
                key={store.id}
                onClick={() => setSelectedBookstoreId(store.id)}
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition border-2 cursor-pointer ${
                  selectedBookstoreId === store.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-transparent hover:border-blue-300"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    {store.name}
                  </h3>
                  {store.isUserAdded && (
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                      사용자 추가
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-gray-600">
                  <p className="flex items-start">
                    <span className="mr-2">📍</span>
                    <span className="flex-1">{store.address}</span>
                  </p>

                  {store.category && (
                    <p className="flex items-center">
                      <span className="mr-2">🏷️</span>
                      <span>{store.category}</span>
                    </p>
                  )}

                  {store.phone && (
                    <p className="flex items-center">
                      <span className="mr-2">📞</span>
                      <span>{store.phone}</span>
                    </p>
                  )}

                  {store.openTime && store.closeTime && (
                    <p className="flex items-center">
                      <span className="mr-2">🕐</span>
                      <span>
                        {store.openTime} - {store.closeTime}
                      </span>
                    </p>
                  )}

                  {store.closedDays && (
                    <p className="flex items-center">
                      <span className="mr-2">🚫</span>
                      <span>{store.closedDays}</span>
                    </p>
                  )}

                  {store.description && (
                    <p className="flex items-start mt-3 pt-3 border-t border-gray-200">
                      <span className="mr-2">📝</span>
                      <span className="flex-1 text-sm">
                        {store.description}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
