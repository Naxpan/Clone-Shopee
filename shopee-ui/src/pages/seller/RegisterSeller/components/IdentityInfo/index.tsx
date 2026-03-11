import { useRef, useState } from "react";
import { IdentityInfoData } from "../../types";

interface IdentityErrors {
  fullName?: string;
  birthDate?: string;
  frontImage?: string;
  backImage?: string;
}

function validateIdentity(data: IdentityInfoData): IdentityErrors {
  const errors: IdentityErrors = {};
  if (!data.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên";
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = "Họ và tên phải có ít nhất 3 ký tự";
  }
  if (!data.birthDay || !data.birthMonth || !data.birthYear) {
    errors.birthDate = "Vui lòng chọn đầy đủ ngày tháng năm sinh";
  }
  if (!data.frontImage) {
    errors.frontImage = "Vui lòng tải lên ảnh mặt trước CCCD";
  }
  if (!data.backImage) {
    errors.backImage = "Vui lòng tải lên ảnh mặt sau CCCD";
  }
  return errors;
}

interface IdentityInfoProps {
  data: IdentityInfoData;
  onChange: (data: IdentityInfoData) => void;
  onNext: () => void;
  onBack: () => void;
}

const IdentityInfo = ({
  data,
  onChange,
  onNext,
  onBack,
}: IdentityInfoProps) => {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<IdentityErrors>({});
  const [touched, setTouched] = useState({
    fullName: false,
    birthDate: false,
    frontImage: false,
    backImage: false,
  });

  const currentErrors = validateIdentity(data);
  const isValid = Object.keys(currentErrors).length === 0;

  const updateField = <K extends keyof IdentityInfoData>(
    field: K,
    value: IdentityInfoData[K],
  ) => {
    const newData = { ...data, [field]: value };
    onChange(newData);
    const newErrors = validateIdentity(newData);
    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "front") {
          updateField("frontImage", reader.result as string);
          setTouched((prev) => ({ ...prev, frontImage: true }));
        } else {
          updateField("backImage", reader.result as string);
          setTouched((prev) => ({ ...prev, backImage: true }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    setTouched({
      fullName: true,
      birthDate: true,
      frontImage: true,
      backImage: true,
    });
    setErrors(currentErrors);
    if (isValid) onNext();
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="rs-identity">
      {/* Họ tên */}
      <div className="rs-identity__group">
        <label className="rs-identity__label">
          <span className="rs-identity__required">*</span> Họ và tên (theo CCCD)
        </label>
        <div className="rs-identity__input-wrap">
          <input
            className={`rs-identity__input${touched.fullName && errors.fullName ? " rs-identity__input--error" : ""}`}
            value={data.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, fullName: true }));
              setErrors((prev) => ({
                ...prev,
                fullName: currentErrors.fullName,
              }));
            }}
            placeholder="Nhập họ và tên đầy đủ"
            maxLength={50}
          />
        </div>
        {touched.fullName && errors.fullName && (
          <span className="rs-identity__error">{errors.fullName}</span>
        )}
      </div>

      {/* Ngày sinh */}
      <div className="rs-identity__group">
        <label className="rs-identity__label">
          <span className="rs-identity__required">*</span> Ngày sinh
        </label>
        <div className="rs-identity__date-wrap">
          <select
            className={`rs-identity__select${touched.birthDate && errors.birthDate ? " rs-identity__select--error" : ""}`}
            value={data.birthDay}
            onChange={(e) => {
              updateField("birthDay", e.target.value);
              setTouched((p) => ({ ...p, birthDate: true }));
            }}
          >
            <option value="">Ngày</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            className={`rs-identity__select${touched.birthDate && errors.birthDate ? " rs-identity__select--error" : ""}`}
            value={data.birthMonth}
            onChange={(e) => {
              updateField("birthMonth", e.target.value);
              setTouched((p) => ({ ...p, birthDate: true }));
            }}
          >
            <option value="">Tháng</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            className={`rs-identity__select${touched.birthDate && errors.birthDate ? " rs-identity__select--error" : ""}`}
            value={data.birthYear}
            onChange={(e) => {
              updateField("birthYear", e.target.value);
              setTouched((p) => ({ ...p, birthDate: true }));
            }}
          >
            <option value="">Năm</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        {touched.birthDate && errors.birthDate && (
          <span className="rs-identity__error">{errors.birthDate}</span>
        )}
      </div>

      {/* Ảnh CCCD */}
      <div className="rs-identity__group">
        <label className="rs-identity__label">
          <span className="rs-identity__required">*</span> Ảnh chụp Căn cước
          công dân
        </label>
        <p className="rs-identity__hint">
          Vui lòng tải lên ảnh mặt trước và mặt sau của CCCD/CMND
        </p>
        <div className="rs-identity__upload-wrap">
          {/* Mặt trước */}
          <div style={{ flex: 1 }}>
            <div
              className={`rs-identity__upload-box${data.frontImage ? " rs-identity__upload-box--has-image" : ""}${touched.frontImage && errors.frontImage ? " rs-identity__upload-box--error" : ""}`}
              onClick={() => frontInputRef.current?.click()}
            >
              {data.frontImage ? (
                <img
                  src={data.frontImage}
                  alt="Mặt trước CCCD"
                  className="rs-identity__preview"
                />
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up rs-identity__upload-icon"></i>
                  <span className="rs-identity__upload-text">Mặt trước</span>
                </>
              )}
              <input
                type="file"
                ref={frontInputRef}
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "front")}
                hidden
              />
            </div>
            {touched.frontImage && errors.frontImage && (
              <span className="rs-identity__error">{errors.frontImage}</span>
            )}
          </div>

          {/* Mặt sau */}
          <div style={{ flex: 1 }}>
            <div
              className={`rs-identity__upload-box${data.backImage ? " rs-identity__upload-box--has-image" : ""}${touched.backImage && errors.backImage ? " rs-identity__upload-box--error" : ""}`}
              onClick={() => backInputRef.current?.click()}
            >
              {data.backImage ? (
                <img
                  src={data.backImage}
                  alt="Mặt sau CCCD"
                  className="rs-identity__preview"
                />
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up rs-identity__upload-icon"></i>
                  <span className="rs-identity__upload-text">Mặt sau</span>
                </>
              )}
              <input
                type="file"
                ref={backInputRef}
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "back")}
                hidden
              />
            </div>
            {touched.backImage && errors.backImage && (
              <span className="rs-identity__error">{errors.backImage}</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="rs-identity__footer">
        <button
          className="rs-identity__btn rs-identity__btn--back"
          onClick={onBack}
        >
          Quay lại
        </button>
        <button
          className="rs-identity__btn rs-identity__btn--next"
          onClick={handleNext}
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default IdentityInfo;
