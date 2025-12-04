import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createBookstore } from "../services/firestoreService";
import { getCurrentUser } from "../services/authService";
import Map from "../components/Map";
import type { Bookstore } from "../types";

export default function AddBookstorePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    category: "",
    phone: "",
    openTime: "",
    closeTime: "",
    closedDays: "",
    description: "",
  });

  useEffect(() => {
    // 로그인 체크
    const user = getCurrentUser();
    if (!user) {
      alert(t("addBookstore.loginRequired"));
      navigate("/login");
    }
  }, [navigate, t]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedLocation) {
      setError("지도에서 위치를 선택해주세요");
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      setError(t("addBookstore.loginRequired"));
      return;
    }

    setLoading(true);

    try {
      const newBookstore: Omit<Bookstore, "id" | "createdAt"> = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        category: formData.category.trim() || "기타",
        phone: formData.phone.trim() || undefined,
        openTime: formData.openTime || undefined,
        closeTime: formData.closeTime || undefined,
        closedDays: formData.closedDays.trim() || undefined,
        description: formData.description.trim() || undefined,
        isUserAdded: true,
      };

      await createBookstore(newBookstore, user.uid);
      setSuccess(t("addBookstore.success"));

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err: any) {
      setError(err.message || t("addBookstore.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {t("addBookstore.title")}
        </h1>

        {/* 에러/성공 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 폼 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 서점 이름 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("addBookstore.name")} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t("addBookstore.namePlaceholder")}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 주소 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("addBookstore.address")} *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder={t("addBookstore.addressPlaceholder")}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("addBookstore.category")}
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder={t("addBookstore.categoryPlaceholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 전화번호 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("addBookstore.phone")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t("addBookstore.phonePlaceholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 영업 시간 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("addBookstore.openTime")}
                  </label>
                  <input
                    type="time"
                    name="openTime"
                    value={formData.openTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("addBookstore.closeTime")}
                  </label>
                  <input
                    type="time"
                    name="closeTime"
                    value={formData.closeTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 휴무일 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("addBookstore.closedDays")}
                </label>
                <input
                  type="text"
                  name="closedDays"
                  value={formData.closedDays}
                  onChange={handleInputChange}
                  placeholder={t("addBookstore.closedDaysPlaceholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("addBookstore.description")}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t("addBookstore.descriptionPlaceholder")}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 선택된 위치 정보 */}
              {selectedLocation && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-semibold text-blue-800 mb-1">
                    선택된 위치
                  </p>
                  <p className="text-sm text-blue-600">
                    위도: {selectedLocation.lat.toFixed(6)}
                  </p>
                  <p className="text-sm text-blue-600">
                    경도: {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}

              {/* 버튼 */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || !selectedLocation}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading
                    ? t("addBookstore.loading")
                    : t("addBookstore.submit")}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  {t("addBookstore.cancel")}
                </button>
              </div>
            </form>
          </div>

          {/* 지도 */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {t("addBookstore.clickMap")}
              </h2>
              <div className="h-[600px] rounded-lg overflow-hidden">
                <Map
                  bookstores={[]}
                  center={[37.5665, 126.978]}
                  zoom={12}
                  onMapClick={handleMapClick}
                  selectedLocation={selectedLocation}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
