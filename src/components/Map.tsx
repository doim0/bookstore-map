import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Bookstore } from "../types";
import { Icon } from "leaflet";

// 기본 마커 아이콘 설정 (Leaflet 기본 아이콘 문제 해결)
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 사용자 추가 서점 마커 아이콘
const userIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 선택된 서점 마커 아이콘 (빨간색)
const selectedIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  bookstores: Bookstore[];
  center?: LatLngExpression;
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  selectedBookstoreId?: string | null;
}

// 지도 클릭 이벤트 핸들러 컴포넌트
function MapClickHandler({
  onClick,
}: {
  onClick?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      if (onClick) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function Map({
  bookstores,
  center = [37.5665, 126.978], // 기본값: 서울
  zoom = 13,
  onMapClick,
  selectedLocation,
  selectedBookstoreId,
}: MapProps) {
  return (
    <div className="h-full w-full" key={`map-wrapper-${bookstores.length}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full rounded-lg shadow-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {onMapClick && <MapClickHandler onClick={onMapClick} />}

        {/* 선택된 위치 마커 (서점 추가시) */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={userIcon}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold">선택된 위치</p>
                <p className="text-sm text-gray-600">
                  위도: {selectedLocation.lat.toFixed(6)}
                </p>
                <p className="text-sm text-gray-600">
                  경도: {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 서점 마커들 */}
        {bookstores.map((store) => (
          <Marker
            key={store.id}
            position={[store.latitude, store.longitude]}
            icon={selectedBookstoreId === store.id ? selectedIcon : defaultIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{store.name}</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">📍 {store.address}</p>
                  {store.category && (
                    <p className="text-gray-600">🏷️ {store.category}</p>
                  )}
                  {store.phone && (
                    <p className="text-gray-600">📞 {store.phone}</p>
                  )}
                  {store.openTime && store.closeTime && (
                    <p className="text-gray-600">
                      🕐 {store.openTime} - {store.closeTime}
                    </p>
                  )}
                  {store.closedDays && (
                    <p className="text-gray-600">🚫 {store.closedDays}</p>
                  )}
                  {store.description && (
                    <p className="text-gray-600 mt-2">{store.description}</p>
                  )}
                  {store.isUserAdded && (
                    <p className="text-blue-600 font-semibold mt-2">
                      👤 사용자 추가 서점
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
