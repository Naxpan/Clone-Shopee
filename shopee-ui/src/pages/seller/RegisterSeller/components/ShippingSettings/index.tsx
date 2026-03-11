import { useState } from "react";
import { ShippingSection } from "../../types";

interface ShippingSettingsProps {
  data: ShippingSection[];
  onChange: (data: ShippingSection[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const ShippingSettings = ({
  data,
  onChange,
  onNext,
  onBack,
}: ShippingSettingsProps) => {
  const hasAtLeastOne = data.some((s) => s.options.some((o) => o.enabled));
  const [showError, setShowError] = useState(false);
  const toggleCollapse = (sectionId: string) => {
    onChange(
      data.map((section) =>
        section.id === sectionId
          ? { ...section, collapsed: !section.collapsed }
          : section,
      ),
    );
  };

  const toggleOption = (sectionId: string, optionId: string) => {
    onChange(
      data.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              options: section.options.map((opt) =>
                opt.id === optionId ? { ...opt, enabled: !opt.enabled } : opt,
              ),
            }
          : section,
      ),
    );
  };

  return (
    <div className="rs-shipping">
      {data.map((section) => (
        <div key={section.id} className="rs-shipping__section">
          <div className="rs-shipping__header">
            <h3 className="rs-shipping__title">{section.title}</h3>
            <button
              className="rs-shipping__collapse-btn"
              onClick={() => toggleCollapse(section.id)}
            >
              {section.collapsed ? "Mở rộng" : "Thu gọn"}{" "}
              <i
                className={`fa-solid fa-chevron-${
                  section.collapsed ? "down" : "up"
                }`}
              ></i>
            </button>
          </div>

          {!section.collapsed && (
            <div className="rs-shipping__options">
              {section.options.map((option) => (
                <div key={option.id} className="rs-shipping__option">
                  <div className="rs-shipping__option-info">
                    <span className="rs-shipping__option-name">
                      {option.name}
                    </span>
                    {option.codEnabled && option.enabled && (
                      <span className="rs-shipping__cod-badge">
                        [COD đã được kích hoạt]
                      </span>
                    )}
                  </div>
                  <label className="rs-shipping__toggle">
                    <input
                      type="checkbox"
                      checked={option.enabled}
                      onChange={() => toggleOption(section.id, option.id)}
                    />
                    <span className="rs-shipping__toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Thêm đơn vị vận chuyển */}
      <div className="rs-shipping__section">
        <div className="rs-shipping__header">
          <h3 className="rs-shipping__title">Thêm đơn vị vận chuyển</h3>
        </div>
        <p className="rs-shipping__note">
          Lưu ý: TUI không hỗ trợ theo dõi quá trình cho các phương thức vận
          chuyển không có tích hợp và cũng sẽ không chịu trách nhiệm về bất kỳ
          sản phẩm nào bị thiếu hoặc hư hỏng.
        </p>
      </div>

      {showError && !hasAtLeastOne && (
        <span className="rs-shipping__error">
          Vui lòng chọn ít nhất một đơn vị vận chuyển
        </span>
      )}

      {/* Footer */}
      <div className="rs-shipping__footer">
        <button
          className="rs-shipping__btn rs-shipping__btn--back"
          onClick={onBack}
        >
          Quay lại
        </button>
        <button
          className="rs-shipping__btn rs-shipping__btn--next"
          onClick={() => {
            setShowError(true);
            if (hasAtLeastOne) onNext();
          }}
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default ShippingSettings;
