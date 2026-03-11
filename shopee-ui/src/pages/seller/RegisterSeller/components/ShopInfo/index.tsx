import { useState, useEffect } from "react";
import { ShopInfoData } from "../../types";
import AddressModal from "../../../../../components/Modal/AddressModal";

interface ShopInfoErrors {
  shopName?: string;
  address?: string;
  phone?: string;
}

function validateShopInfo(data: ShopInfoData): ShopInfoErrors {
  const errors: ShopInfoErrors = {};
  if (!data.shopName.trim()) {
    errors.shopName = "Vui lòng nhập tên shop";
  } else if (data.shopName.trim().length < 2) {
    errors.shopName = "Tên shop phải có ít nhất 2 ký tự";
  }
  if (!data.address.trim()) {
    errors.address = "Vui lòng chọn địa chỉ lấy hàng";
  }
  if (!data.phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!/^0[0-9]{9,10}$/.test(data.phone.trim())) {
    errors.phone = "Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)";
  }
  return errors;
}

const API = "https://provinces.open-api.vn/api";

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

interface ShopInfoProps {
  data: ShopInfoData;
  onChange: (data: ShopInfoData) => void;
  onNext: () => void;
  onSave: () => void;
  onBack: () => void;
}

const ShopInfo = ({
  data,
  onChange,
  onNext,
  onSave,
  onBack,
}: ShopInfoProps) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressDetail, setAddressDetail] = useState("");

  // Validation state
  const [errors, setErrors] = useState<ShopInfoErrors>({});
  const [touched, setTouched] = useState<Record<keyof ShopInfoErrors, boolean>>(
    {
      shopName: false,
      address: false,
      phone: false,
    },
  );

  // Revalidate whenever data changes
  const currentErrors = validateShopInfo(data);
  const isValid = Object.keys(currentErrors).length === 0;

  // Dữ liệu API
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // Lựa chọn hiện tại
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null,
  );
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Load tỉnh khi mở modal lần đầu
  useEffect(() => {
    if (showAddressModal && provinces.length === 0) {
      fetch(`${API}/p/`)
        .then((r) => r.json())
        .then(setProvinces)
        .catch(() => {});
    }
  }, [showAddressModal]);

  const handleSelectProvince = async (code: number) => {
    const p = provinces.find((x) => x.code === code) || null;
    setSelectedProvince(p);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    if (!code) return;
    setLoadingDistricts(true);
    try {
      const res = await fetch(`${API}/p/${code}?depth=2`);
      const json = await res.json();
      setDistricts(json.districts || []);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleSelectDistrict = async (code: number) => {
    const d = districts.find((x) => x.code === code) || null;
    setSelectedDistrict(d);
    setSelectedWard(null);
    setWards([]);
    if (!code) return;
    setLoadingWards(true);
    try {
      const res = await fetch(`${API}/d/${code}?depth=2`);
      const json = await res.json();
      setWards(json.wards || []);
    } finally {
      setLoadingWards(false);
    }
  };

  const handleSelectWard = (code: number) => {
    setSelectedWard(wards.find((w) => w.code === code) || null);
  };

  const updateField = (field: keyof ShopInfoData, value: string) => {
    onChange({ ...data, [field]: value });
    if (touched[field as keyof ShopInfoErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateShopInfo({ ...data, [field]: value })[
          field as keyof ShopInfoErrors
        ],
      }));
    }
  };

  const handleBlur = (field: keyof ShopInfoErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: currentErrors[field] }));
  };

  const handleSaveAddress = () => {
    const parts = [
      selectedProvince?.name,
      selectedDistrict?.name,
      selectedWard?.name,
      addressDetail,
    ].filter(Boolean);
    const newAddress = parts.join(", ");
    updateField("address", newAddress);
    setTouched((prev) => ({ ...prev, address: true }));
    setErrors((prev) => ({
      ...prev,
      address: newAddress ? undefined : "Vui lòng chọn địa chỉ lấy hàng",
    }));
    setShowAddressModal(false);
  };

  const handleCancelAddress = () => {
    setShowAddressModal(false);
  };

  const handleNext = () => {
    // Mark all fields touched and show errors
    setTouched({ shopName: true, address: true, phone: true });
    setErrors(currentErrors);
    if (isValid) onNext();
  };

  return (
    <div className="rs-form">
      {/* Tên Shop */}
      <div className="rs-form__group">
        <label className="rs-form__label">
          <span className="rs-form__required">*</span> Tên Shop
        </label>
        <div className="rs-form__input-wrap">
          <input
            className={`rs-form__input${touched.shopName && errors.shopName ? " rs-form__input--error" : ""}`}
            maxLength={30}
            value={data.shopName}
            onChange={(e) => updateField("shopName", e.target.value)}
            onBlur={() => handleBlur("shopName")}
            placeholder="Nhập tên shop"
          />
          <span className="rs-form__count">{data.shopName.length}/30</span>
          {touched.shopName && errors.shopName && (
            <span className="rs-form__error">{errors.shopName}</span>
          )}
        </div>
      </div>
      {/* Địa chỉ */}
      <div className="rs-form__group">
        <label className="rs-form__label">
          <span className="rs-form__required">*</span> Địa chỉ lấy hàng
        </label>
        <div style={{ flex: 1, maxWidth: 500 }}>
          <div
            className={`rs-form__address${touched.address && errors.address ? " rs-form__address--error" : ""}`}
          >
            <p className="rs-form__address-empty">
              {data.address || "Chưa có địa chỉ"}
            </p>
            <button
              type="button"
              className="rs-form__address-btn"
              onClick={() => setShowAddressModal(true)}
            >
              Địa chỉ
            </button>
          </div>
          {touched.address && errors.address && (
            <span className="rs-form__error">{errors.address}</span>
          )}
        </div>
      </div>
      {/* Email */}
      <div className="rs-form__group">
        <label className="rs-form__label">
          <span className="rs-form__required">*</span> Email
        </label>
        <div className="rs-form__input-wrap">
          <input
            className="rs-form__input rs-form__input--disabled"
            disabled
            value={data.email}
            placeholder="Email của bạn"
          />
        </div>
      </div>
      {/* SĐT */}
      <div className="rs-form__group">
        <label className="rs-form__label">
          <span className="rs-form__required">*</span> Số điện thoại
        </label>
        <div className="rs-form__input-wrap">
          <input
            className={`rs-form__input${touched.phone && errors.phone ? " rs-form__input--error" : ""}`}
            value={data.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            placeholder="Nhập số điện thoại"
            maxLength={11}
          />
          {touched.phone && errors.phone && (
            <span className="rs-form__error">{errors.phone}</span>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="rs-form__footer">
        <button className="rs-form__btn rs-form__btn--out" onClick={onBack}>
          Trở về
        </button>
        <div className="rs-form__btn-group">
          <button className="rs-form__btn rs-form__btn--save" onClick={onSave}>
            Lưu
          </button>
          <button
            className="rs-form__btn rs-form__btn--next"
            onClick={handleNext}
          >
            Tiếp theo
          </button>
        </div>
      </div>
      <AddressModal
        show={showAddressModal}
        provinces={provinces}
        districts={districts}
        wards={wards}
        selectedProvince={selectedProvince}
        selectedDistrict={selectedDistrict}
        selectedWard={selectedWard}
        loadingDistricts={loadingDistricts}
        loadingWards={loadingWards}
        addressDetail={addressDetail}
        onSelectProvince={handleSelectProvince}
        onSelectDistrict={handleSelectDistrict}
        onSelectWard={handleSelectWard}
        onAddressDetailChange={setAddressDetail}
        onCancel={handleCancelAddress}
        onSave={handleSaveAddress}
      />
    </div>
  );
};

export default ShopInfo;
