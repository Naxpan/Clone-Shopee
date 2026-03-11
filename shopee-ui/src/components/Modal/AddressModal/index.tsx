import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Province {
  code: number;
  name: string;
}
interface District {
  code: number;
  name: string;
}
interface Ward {
  code: number;
  name: string;
}

interface AddressModalProps {
  show: boolean;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  selectedProvince: Province | null;
  selectedDistrict: District | null;
  selectedWard: Ward | null;
  loadingDistricts: boolean;
  loadingWards: boolean;
  addressDetail: string;
  onSelectProvince: (code: number) => void;
  onSelectDistrict: (code: number) => void;
  onSelectWard: (code: number) => void;
  onAddressDetailChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const DEFAULT_CENTER: [number, number] = [16.047, 108.206]; // Center of Vietnam

/**
 * Strips Vietnamese administrative unit prefixes so Nominatim can find the place.
 * e.g. "Thành phố Hồ Chí Minh" → "Hồ Chí Minh"
 *      "Phường Bến Nghé"        → "Bến Nghé"
 *      "Quận 1"                 → "1"
 */
function stripAdminPrefix(name: string): string {
  const prefixes = [
    "Thành phố ",
    "Tỉnh ",
    "Quận ",
    "Huyện ",
    "Thị xã ",
    "Phường ",
    "Xã ",
    "Thị trấn ",
  ];
  for (const prefix of prefixes) {
    if (name.startsWith(prefix)) return name.slice(prefix.length);
  }
  return name;
}

/**
 * Nominatim geocode with fallback chain.
 * Uses stripped names first (no admin prefix), then full names as fallback,
 * then progressively less-specific queries.
 */
async function geocodeVN(
  province: string,
  district: string,
  ward: string,
  signal: AbortSignal,
): Promise<{ lat: number; lng: number; zoom: number } | null> {
  const p = stripAdminPrefix(province);
  const d = stripAdminPrefix(district);
  const w = stripAdminPrefix(ward);

  const attempts: Array<{ q: string; zoom: number }> = [
    { q: `${w}, ${d}, ${p}, Vietnam`, zoom: 15 }, // stripped names
    { q: `${ward}, ${district}, ${province}, Vietnam`, zoom: 15 }, // full names fallback
    { q: `${d}, ${p}, Vietnam`, zoom: 13 },
    { q: `${district}, ${province}, Vietnam`, zoom: 13 },
    { q: `${p}, Vietnam`, zoom: 10 },
    { q: `${province}, Vietnam`, zoom: 10 },
  ];

  for (const { q, zoom } of attempts) {
    if (signal.aborted) return null;
    try {
      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=vn`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "vi,en" },
        signal,
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          zoom,
        };
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return null;
      // continue to less specific
    }
  }
  return null;
}

const AddressModal = ({
  show,
  provinces,
  districts,
  wards,
  selectedProvince,
  selectedDistrict,
  selectedWard,
  loadingDistricts,
  loadingWards,
  addressDetail,
  onSelectProvince,
  onSelectDistrict,
  onSelectWard,
  onAddressDetailChange,
  onCancel,
  onSave,
}: AddressModalProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  // Stores current abort controller — aborts stale geocode requests
  const abortRef = useRef<AbortController | null>(null);

  /**
   * Only geocode when ALL 3 levels are selected.
   * Reads map/marker from refs so never stale.
   * Cancels any in-flight request before starting a new one.
   */
  const flyToAddress = useCallback(
    (
      province: Province | null,
      district: District | null,
      ward: Ward | null,
    ) => {
      const map = mapInstanceRef.current;
      const marker = markerRef.current;

      // Guard: need map ready AND all 3 address levels selected
      if (!map || !marker || !province || !district || !ward) return;

      // Cancel previous in-flight geocode
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      geocodeVN(
        province.name,
        district.name,
        ward.name,
        controller.signal,
      ).then((result) => {
        if (!result || controller.signal.aborted) return;
        map.flyTo([result.lat, result.lng], result.zoom, { duration: 1.2 });
        marker.setLatLng([result.lat, result.lng]);
      });
    },
    [], // stable — reads refs, no React state
  );

  // ─── Effect 1: Init Leaflet ONCE on mount ──────────────────────────────────
  // Keep modal always mounted (display CSS), never destroy/recreate the map.
  useEffect(() => {
    const timer = setTimeout(() => {
      const container = mapContainerRef.current;
      if (!container) return;

      // Clean up any leftover Leaflet state (Strict Mode safety)
      delete (container as any)._leaflet_id;

      const map = L.map(container).setView(DEFAULT_CENTER, 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const marker = L.marker(DEFAULT_CENTER).addTo(map);
      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Allow user to manually place marker
      map.on("click", (e: L.LeafletMouseEvent) => {
        marker.setLatLng([e.latlng.lat, e.latlng.lng]);
      });
    }, 0);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []); // ← empty: runs once only

  // ─── Effect 2: Modal open → fix tile layout + geocode current selection ────
  useEffect(() => {
    if (!show) return;
    // Wait for display:flex to take effect before recalculating tile size
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
      flyToAddress(selectedProvince, selectedDistrict, selectedWard);
    }, 80);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  // ─── Effect 3: Address selection changed → geocode ─────────────────────────
  // Only fires when show=true (modal is open)
  useEffect(() => {
    if (!show) return;
    flyToAddress(selectedProvince, selectedDistrict, selectedWard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince, selectedDistrict, selectedWard]);

  // Keep component always mounted — hide via CSS so Leaflet map isn't re-created
  return createPortal(
    <div className="rs-addr-modal" style={{ display: show ? "flex" : "none" }}>
      <div className="rs-addr-modal__overlay" onClick={onCancel} />
      <div className="rs-addr-modal__box">
        <div className="rs-addr-modal__field">
          <label className="rs-addr-modal__label">
            Tỉnh/Thành phố / Quận/Huyện / Phường/Xã
          </label>
          {/* Tỉnh/Thành phố */}
          <div
            className="rs-addr-modal__select-wrap"
            style={{ marginBottom: 10 }}
          >
            <select
              className="rs-addr-modal__select"
              value={selectedProvince?.code ?? ""}
              onChange={(e) => onSelectProvince(Number(e.target.value))}
            >
              <option value="">-- Chọn Tỉnh/Thành phố --</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down rs-addr-modal__select-icon" />
          </div>
          {/* Quận/Huyện */}
          <div
            className="rs-addr-modal__select-wrap"
            style={{ marginBottom: 10 }}
          >
            <select
              className="rs-addr-modal__select"
              value={selectedDistrict?.code ?? ""}
              onChange={(e) => onSelectDistrict(Number(e.target.value))}
              disabled={!selectedProvince || loadingDistricts}
            >
              <option value="">
                {loadingDistricts ? "Đang tải..." : "-- Chọn Quận/Huyện --"}
              </option>
              {districts.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down rs-addr-modal__select-icon" />
          </div>
          {/* Phường/Xã */}
          <div className="rs-addr-modal__select-wrap">
            <select
              className="rs-addr-modal__select"
              value={selectedWard?.code ?? ""}
              onChange={(e) => onSelectWard(Number(e.target.value))}
              disabled={!selectedDistrict || loadingWards}
            >
              <option value="">
                {loadingWards ? "Đang tải..." : "-- Chọn Phường/Xã --"}
              </option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down rs-addr-modal__select-icon" />
          </div>
        </div>
        {/* Địa chỉ chi tiết */}
        <div className="rs-addr-modal__field">
          <label className="rs-addr-modal__label">Địa chỉ chi tiết</label>
          <textarea
            className="rs-addr-modal__textarea"
            value={addressDetail}
            onChange={(e) => onAddressDetailChange(e.target.value)}
            placeholder="Số nhà, tên đường..."
            rows={3}
          />
        </div>
        {/* Bản đồ */}
        <div
          ref={mapContainerRef}
          style={{
            height: 260,
            width: "100%",
            marginBottom: 16,
            borderRadius: 4,
          }}
        />
        {/* Footer */}
        <div className="rs-addr-modal__footer">
          <button
            type="button"
            className="rs-addr-modal__btn rs-addr-modal__btn--cancel"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            type="button"
            className="rs-addr-modal__btn rs-addr-modal__btn--save"
            onClick={onSave}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AddressModal;
