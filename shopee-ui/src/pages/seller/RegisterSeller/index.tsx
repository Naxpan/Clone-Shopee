import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "./components/Stepper";
import ShopInfo from "./components/ShopInfo";
import ShippingSettings from "./components/ShippingSettings";
import IdentityInfo from "./components/IdentityInfo";
import TaxInfo from "./components/TaxInfo";
import CompletionStep from "./components/CompletionStep";
import {
  ShopInfoData,
  ShippingSection,
  IdentityInfoData,
  TaxInfoData,
  initialShopInfo,
  initialShippingSections,
  initialIdentityInfo,
  initialTaxInfo,
} from "./types";

const STEPS = [
  { label: "Thông tin Shop" },
  { label: "Cài đặt vận chuyển" },
  { label: "Thông tin định danh" },
  { label: "Thông tin thuế" },
  { label: "Hoàn tất" },
];

const RegisterSeller = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Form data state
  const [shopInfo, setShopInfo] = useState<ShopInfoData>(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return { ...initialShopInfo, email: user.email || "" };
    } catch {
      return initialShopInfo;
    }
  });
  const [shippingSections, setShippingSections] = useState<ShippingSection[]>(
    initialShippingSections,
  );
  const [identityInfo, setIdentityInfo] =
    useState<IdentityInfoData>(initialIdentityInfo);
  const [taxInfo, setTaxInfo] = useState<TaxInfoData>(initialTaxInfo);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  const handleSave = () => {
    console.log("Saved step", currentStep);
  };

  const handleSubmit = () => {
    console.log("Submitting seller registration:", {
      shopInfo,
      shippingSections,
      identityInfo,
      taxInfo,
    });
    // TODO: Call API to submit registration
    alert("Đăng ký thành công! (Demo)");
    navigate("/");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ShopInfo
            data={shopInfo}
            onChange={setShopInfo}
            onNext={handleNext}
            onSave={handleSave}
            onBack={handleBack}
          />
        );
      case 1:
        return (
          <ShippingSettings
            data={shippingSections}
            onChange={setShippingSections}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <IdentityInfo
            data={identityInfo}
            onChange={setIdentityInfo}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <TaxInfo
            data={taxInfo}
            onChange={setTaxInfo}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <CompletionStep
            data={{ shopInfo, shippingSections, identityInfo, taxInfo }}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="register-seller-page">
      <div className="rs-content">
        <Stepper steps={STEPS} currentStep={currentStep} />
        <hr className="rs-divider" />
        {renderStep()}
      </div>
    </div>
  );
};

export default RegisterSeller;
