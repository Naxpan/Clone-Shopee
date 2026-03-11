import { useState } from "react";
import { TaxInfoData, BusinessType } from "../../types";

interface TaxErrors {
  taxId?: string;
}

function validateTax(data: TaxInfoData): TaxErrors {
  const errors: TaxErrors = {};
  if (data.taxId.trim() && !/^[0-9]{10}([0-9]{3})?$/.test(data.taxId.trim())) {
    errors.taxId = "Mã số thuế phải gồm 10 hoặc 13 chữ số";
  }
  return errors;
}

interface TaxInfoProps {
  data: TaxInfoData;
  onChange: (data: TaxInfoData) => void;
  onNext: () => void;
  onBack: () => void;
}

const TaxInfo = ({ data, onChange, onNext, onBack }: TaxInfoProps) => {
  const [errors, setErrors] = useState<TaxErrors>({});
  const [touched, setTouched] = useState({ taxId: false });

  const currentErrors = validateTax(data);
  const isValid = Object.keys(currentErrors).length === 0;
  const updateField = <K extends keyof TaxInfoData>(
    field: K,
    value: TaxInfoData[K],
  ) => {
    const newData = { ...data, [field]: value };
    onChange(newData);
    if (touched.taxId) {
      setErrors(validateTax(newData));
    }
  };

  const handleNext = () => {
    setTouched({ taxId: true });
    setErrors(currentErrors);
    if (isValid) onNext();
  };

  const businessOptions = [
    {
      value: "personal",
      label: "Cá nhân",
      description: "Bán hàng với tư cách cá nhân",
    },
    {
      value: "household",
      label: "Hộ kinh doanh",
      description: "Hộ kinh doanh có giấy phép",
    },
    {
      value: "enterprise",
      label: "Doanh nghiệp",
      description: "Công ty, doanh nghiệp có đăng ký",
    },
  ];

  return (
    <div className="rs-tax">
      {/* Mã số thuế */}
      <div className="rs-tax__group">
        <label className="rs-tax__label">
          Mã số thuế <span className="rs-tax__optional">(Không bắt buộc)</span>
        </label>
        <div className="rs-tax__input-wrap">
          <input
            className="rs-tax__input"
            value={data.taxId}
            onChange={(e) => updateField("taxId", e.target.value)}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, taxId: true }));
              setErrors(validateTax(data));
            }}
            placeholder="Nhập mã số thuế (nếu có)"
            maxLength={14}
          />
        </div>
        {touched.taxId && errors.taxId && (
          <span
            style={{
              color: "#ee4d2d",
              fontSize: "1.2rem",
              marginTop: 4,
              display: "block",
            }}
          >
            {errors.taxId}
          </span>
        )}
        <p className="rs-tax__hint">Mã số thuế gồm 10 hoặc 13 chữ số</p>
      </div>

      {/* Loại hình kinh doanh */}
      <div className="rs-tax__group">
        <label className="rs-tax__label">
          <span className="rs-tax__required">*</span> Loại hình kinh doanh
        </label>
        <div className="rs-tax__options">
          {businessOptions.map((option) => (
            <div
              key={option.value}
              className={`rs-tax__option ${data.businessType === option.value ? "rs-tax__option--active" : ""}`}
              onClick={() =>
                updateField("businessType", option.value as BusinessType)
              }
            >
              <div className="rs-tax__option-radio">
                <span
                  className={`rs-tax__radio-dot ${data.businessType === option.value ? "rs-tax__radio-dot--checked" : ""}`}
                ></span>
              </div>
              <div className="rs-tax__option-content">
                <span className="rs-tax__option-label">{option.label}</span>
                <span className="rs-tax__option-desc">
                  {option.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Địa chỉ xuất hóa đơn */}
      <div className="rs-tax__group">
        <label className="rs-tax__label">
          Địa chỉ xuất hóa đơn{" "}
          <span className="rs-tax__optional">(Không bắt buộc)</span>
        </label>
        <div className="rs-tax__input-wrap">
          <textarea
            className="rs-tax__textarea"
            value={data.invoiceAddress}
            onChange={(e) => updateField("invoiceAddress", e.target.value)}
            placeholder="Nhập địa chỉ xuất hóa đơn (nếu có)"
            rows={3}
            maxLength={200}
          />
        </div>
        <p className="rs-tax__hint">
          Địa chỉ này sẽ được sử dụng khi xuất hóa đơn cho khách hàng
        </p>
      </div>

      {/* Footer */}
      <div className="rs-tax__footer">
        <button className="rs-tax__btn rs-tax__btn--back" onClick={onBack}>
          Quay lại
        </button>
        <button className="rs-tax__btn rs-tax__btn--next" onClick={handleNext}>
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default TaxInfo;
