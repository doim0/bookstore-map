import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getMyBookstores,
  updateBookstore,
  deleteBookstore,
} from "../services/firestoreService";
import { getCurrentUser } from "../services/authService";
import Map from "../components/Map";
import type { Bookstore } from "../types";

export default function MyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bookstores, setBookstores] = useState<Bookstore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Bookstore>>({});
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      alert(t("addBookstore.loginRequired"));
      navigate("/login");
      return;
    }

    loadMyBookstores(user.uid);
  }, [navigate, t]);

  const loadMyBookstores = async (userId: string) => {
    try {
      setLoading(true);
      const data = await getMyBookstores(userId);
      setBookstores(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bookstore: Bookstore) => {
    setEditingId(bookstore.id);
    setEditFormData({
      name: bookstore.name,
      address: bookstore.address,
      category: bookstore.category,
      phone: bookstore.phone || "",
      openTime: bookstore.openTime || "",
      closeTime: bookstore.closeTime || "",
      closedDays: bookstore.closedDays || "",
      description: bookstore.description || "",
    });
    setSelectedLocation({
      lat: bookstore.latitude,
      lng: bookstore.longitude,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
    setSelectedLocation(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const handleUpdate = async (bookstoreId: string) => {
    try {
      const updates: Partial<Bookstore> = {
        name: (editFormData.name as string).trim(),
        address: (editFormData.address as string).trim(),
        category: (editFormData.category as string).trim() || "기타",
      };

      if (selectedLocation) {
        updates.latitude = selectedLocation.lat;
        updates.longitude = selectedLocation.lng;
      }

      // 선택적 필드들
      const phone = (editFormData.phone as string)?.trim();
      const openTime = editFormData.openTime as string;
      const closeTime = editFormData.closeTime as string;
      const closedDays = (editFormData.closedDays as string)?.trim();
      const description = (editFormData.description as string)?.trim();

      if (phone) updates.phone = phone;
      if (openTime) updates.openTime = openTime;
      if (closeTime) updates.closeTime = closeTime;
      if (closedDays) updates.closedDays = closedDays;
      if (description) updates.description = description;

      await updateBookstore(bookstoreId, updates);
      alert(t("bookstore.updateSuccess"));

      const user = getCurrentUser();
      if (user) {
        await loadMyBookstores(user.uid);
      }
      handleCancelEdit();
    } catch (err: any) {
      alert(t("bookstore.updateError") + ": " + err.message);
    }
  };

  const handleDelete = async (bookstoreId: string) => {
    if (!confirm(t("bookstore.confirmDelete"))) return;

    try {
      await deleteBookstore(bookstoreId);
      alert(t("bookstore.deleteSuccess"));

      const user = getCurrentUser();
      if (user) {
        await loadMyBookstores(user.uid);
      }
    } catch (err: any) {
      alert(t("bookstore.deleteError") + ": " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {t("myPage.title")}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {bookstores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {t("myPage.noBookstores")}
            </p>
            <button
              onClick={() => navigate("/add")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {t("nav.addBookstore")}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookstores.map((bookstore) => (
              <div
                key={bookstore.id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                {editingId === bookstore.id ? (
                  // 수정 모드
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      {t("myPage.editing")}
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 폼 */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("addBookstore.name")} *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("addBookstore.address")} *
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={editFormData.address || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("addBookstore.category")}
                          </label>
                          <input
                            type="text"
                            name="category"
                            value={editFormData.category || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("addBookstore.phone")}
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={editFormData.phone || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              {t("addBookstore.openTime")}
                            </label>
                            <input
                              type="time"
                              name="openTime"
                              value={editFormData.openTime || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              {t("addBookstore.closeTime")}
                            </label>
                            <input
                              type="time"
                              name="closeTime"
                              value={editFormData.closeTime || ""}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("addBookstore.closedDays")}
                          </label>
                          <input
                            type="text"
                            name="closedDays"
                            value={editFormData.closedDays || ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("addBookstore.description")}
                          </label>
                          <textarea
                            name="description"
                            value={editFormData.description || ""}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleUpdate(bookstore.id)}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                          >
                            {t("common.save")}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold"
                          >
                            {t("common.cancel")}
                          </button>
                        </div>
                      </div>

                      {/* 지도 */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          {t("addBookstore.clickMap")}
                        </p>
                        <div className="rounded-lg overflow-hidden shadow-md h-[500px]">
                          <Map
                            bookstores={[]}
                            onMapClick={handleMapClick}
                            selectedLocation={selectedLocation}
                            center={
                              selectedLocation
                                ? [selectedLocation.lat, selectedLocation.lng]
                                : [bookstore.latitude, bookstore.longitude]
                            }
                            zoom={15}
                          />
                        </div>
                        {selectedLocation && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>
                              {t("addBookstore.latitude")}:{" "}
                              {selectedLocation.lat.toFixed(6)}
                            </p>
                            <p>
                              {t("addBookstore.longitude")}:{" "}
                              {selectedLocation.lng.toFixed(6)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // 보기 모드
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {bookstore.name}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(bookstore)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                        >
                          {t("common.edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(bookstore.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                        >
                          {t("common.delete")}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {t("addBookstore.address")}:
                        </p>
                        <p>{bookstore.address}</p>
                      </div>

                      {bookstore.category && (
                        <div>
                          <p className="font-semibold text-gray-800">
                            {t("addBookstore.category")}:
                          </p>
                          <p>{bookstore.category}</p>
                        </div>
                      )}

                      {bookstore.phone && (
                        <div>
                          <p className="font-semibold text-gray-800">
                            {t("addBookstore.phone")}:
                          </p>
                          <p>{bookstore.phone}</p>
                        </div>
                      )}

                      {(bookstore.openTime || bookstore.closeTime) && (
                        <div>
                          <p className="font-semibold text-gray-800">
                            {t("myPage.businessHours")}:
                          </p>
                          <p>
                            {bookstore.openTime || "?"} -{" "}
                            {bookstore.closeTime || "?"}
                          </p>
                        </div>
                      )}

                      {bookstore.closedDays && (
                        <div>
                          <p className="font-semibold text-gray-800">
                            {t("addBookstore.closedDays")}:
                          </p>
                          <p>{bookstore.closedDays}</p>
                        </div>
                      )}

                      {bookstore.description && (
                        <div className="md:col-span-2">
                          <p className="font-semibold text-gray-800">
                            {t("addBookstore.description")}:
                          </p>
                          <p>{bookstore.description}</p>
                        </div>
                      )}

                      {bookstore.createdAt && (
                        <div className="md:col-span-2 text-sm text-gray-500">
                          {t("myPage.createdAt")}:{" "}
                          {bookstore.createdAt.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
