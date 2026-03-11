import { SellerFormData, BusinessType } from "../../types";

interface CompletionStepProps {
  data: SellerFormData;
  onBack: () => void;
  onSubmit: () => void;
}

const businessTypeLabels: Record<BusinessType, string> = {
  personal: "Cá nhân",
  household: "Hộ kinh doanh",
  enterprise: "Doanh nghiệp",
};

const CompletionStep = ({ data, onBack, onSubmit }: CompletionStepProps) => {
  const { shopInfo, shippingSections, identityInfo, taxInfo } = data;

  const displayValue = (value: string | null | undefined) => {
    if (!value || value.trim() === "") {
      return <span className="rs-complete__empty">Không có</span>;
    }
    return value;
  };

  const formatBirthDate = () => {
    const { birthDay, birthMonth, birthYear } = identityInfo;
    if (!birthDay || !birthMonth || !birthYear) {
      return <span className="rs-complete__empty">Không có</span>;
    }
    return `${birthDay}/${birthMonth}/${birthYear}`;
  };

  const getEnabledShippingOptions = () => {
    const enabled: string[] = [];
    shippingSections.forEach((section) => {
      section.options.forEach((opt) => {
        if (opt.enabled) {
          enabled.push(opt.name);
        }
      });
    });
    return enabled.length > 0 ? enabled.join(", ") : null;
  };

  return (
    <div className="rs-complete">
      <div className="rs-complete__header">
        <h2 className="rs-complete__header-title">
          Kiểm tra thông tin đăng ký
        </h2>
        <p className="rs-complete__header-desc">
          Vui lòng kiểm tra lại thông tin trước khi hoàn tất đăng ký
        </p>
      </div>

      {/* Section 1: Thông tin Shop */}
      <div className="rs-complete__section">
        <h3 className="rs-complete__section-title">
          <i className="fa-solid fa-store"></i>
          Thông tin Shop
        </h3>
        <div className="rs-complete__grid">
          <div className="rs-complete__item">
            <span className="rs-complete__label">Tên Shop</span>
            <span className="rs-complete__value">
              {displayValue(shopInfo.shopName)}
            </span>
          </div>
          <div className="rs-complete__item">
            <span className="rs-complete__label">Số điện thoại</span>
            <span className="rs-complete__value">
              {displayValue(shopInfo.phone)}
            </span>
          </div>
          <div className="rs-complete__item">
            <span className="rs-complete__label">Email</span>
            <span className="rs-complete__value">
              {displayValue(shopInfo.email)}
            </span>
          </div>
          <div className="rs-complete__item">
            <span className="rs-complete__label">Địa chỉ lấy hàng</span>
            <span className="rs-complete__value">
              {displayValue(shopInfo.address)}
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Cài đặt vận chuyển */}
      <div className="rs-complete__section">
        <h3 className="rs-complete__section-title">
          <i className="fa-solid fa-truck"></i>
          Cài đặt vận chuyển
        </h3>
        <div className="rs-complete__grid">
          <div className="rs-complete__item rs-complete__item--full">
            <span className="rs-complete__label">
              Phương thức vận chuyển đã bật
            </span>
            <span className="rs-complete__value">
              {getEnabledShippingOptions() || (
                <span className="rs-complete__empty">Không có</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Thông tin định danh */}
      <div className="rs-complete__section">
        <h3 className="rs-complete__section-title">
          <i className="fa-solid fa-id-card"></i>
          Thông tin định danh
        </h3>
        <div className="rs-complete__grid">
          <div className="rs-complete__item">
            <span className="rs-complete__label">Họ và tên</span>
            <span className="rs-complete__value">
              {displayValue(identityInfo.fullName)}
            </span>
          </div>
          <div className="rs-complete__item">
            <span className="rs-complete__label">Ngày sinh</span>
            <span className="rs-complete__value">{formatBirthDate()}</span>
          </div>
          <div className="rs-complete__item rs-complete__item--full">
            <span className="rs-complete__label">Ảnh CCCD</span>
            <div className="rs-complete__images">
              {identityInfo.frontImage ? (
                <div className="rs-complete__image-box">
                  <img src={identityInfo.frontImage} alt="Mặt trước CCCD" />
                  <span>Mặt trước</span>
                </div>
              ) : (
                <div className="rs-complete__image-empty">
                  <i className="fa-regular fa-image"></i>
                  <span>Mặt trước: Không có</span>
                </div>
              )}
              {identityInfo.backImage ? (
                <div className="rs-complete__image-box">
                  <img src={identityInfo.backImage} alt="Mặt sau CCCD" />
                  <span>Mặt sau</span>
                </div>
              ) : (
                <div className="rs-complete__image-empty">
                  <i className="fa-regular fa-image"></i>
                  <span>Mặt sau: Không có</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Thông tin thuế */}
      <div className="rs-complete__section">
        <h3 className="rs-complete__section-title">
          <i className="fa-solid fa-file-invoice"></i>
          Thông tin thuế
        </h3>
        <div className="rs-complete__grid">
          <div className="rs-complete__item">
            <span className="rs-complete__label">Mã số thuế</span>
            <span className="rs-complete__value">
              {displayValue(taxInfo.taxId)}
            </span>
          </div>
          <div className="rs-complete__item">
            <span className="rs-complete__label">Loại hình kinh doanh</span>
            <span className="rs-complete__value">
              {businessTypeLabels[taxInfo.businessType]}
            </span>
          </div>
          <div className="rs-complete__item rs-complete__item--full">
            <span className="rs-complete__label">Địa chỉ xuất hóa đơn</span>
            <span className="rs-complete__value">
              {displayValue(taxInfo.invoiceAddress)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="rs-complete__footer">
        <button
          className="rs-complete__btn rs-complete__btn--back"
          onClick={onBack}
        >
          Quay lại
        </button>
        <button
          className="rs-complete__btn rs-complete__btn--submit"
          onClick={onSubmit}
        >
          <i className="fa-solid fa-check"></i>
          Hoàn tất đăng ký
        </button>
      </div>
    </div>
  );
};

export default CompletionStep;
