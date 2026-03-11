export interface ShopInfoData {
  shopName: string;
  phone: string;
  email: string;
  address: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  codEnabled: boolean;
  enabled: boolean;
}

export interface ShippingSection {
  id: string;
  title: string;
  options: ShippingOption[];
  collapsed: boolean;
}

export interface IdentityInfoData {
  fullName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  frontImage: string | null;
  backImage: string | null;
}

export type BusinessType = "personal" | "household" | "enterprise";

export interface TaxInfoData {
  taxId: string;
  businessType: BusinessType;
  invoiceAddress: string;
}

export interface SellerFormData {
  shopInfo: ShopInfoData;
  shippingSections: ShippingSection[];
  identityInfo: IdentityInfoData;
  taxInfo: TaxInfoData;
}

export const initialShopInfo: ShopInfoData = {
  shopName: "",
  phone: "",
  email: "",
  address: "",
};

export const initialShippingSections: ShippingSection[] = [
  {
    id: "hoa-toc",
    title: "Hỏa Tốc",
    collapsed: false,
    options: [
      { id: "hoa-toc-1", name: "Hỏa Tốc", codEnabled: true, enabled: false },
    ],
  },
  {
    id: "trong-ngay",
    title: "Trong Ngày",
    collapsed: false,
    options: [
      {
        id: "trong-ngay-1",
        name: "Trong Ngày",
        codEnabled: true,
        enabled: false,
      },
    ],
  },
  {
    id: "nhanh",
    title: "Nhanh",
    collapsed: false,
    options: [
      { id: "nhanh-1", name: "Nhanh", codEnabled: true, enabled: true },
    ],
  },
  {
    id: "tu-nhan-hang",
    title: "Tự Nhận Hàng",
    collapsed: false,
    options: [
      {
        id: "tu-nhan-1",
        name: "Tự Nhận Hàng",
        codEnabled: true,
        enabled: false,
      },
      {
        id: "tu-nhan-2",
        name: "Điểm nhận hàng",
        codEnabled: true,
        enabled: false,
      },
    ],
  },
  {
    id: "hang-cong-kenh",
    title: "Hàng Cồng Kềnh",
    collapsed: false,
    options: [
      {
        id: "cong-kenh-1",
        name: "Hàng Cồng Kềnh",
        codEnabled: true,
        enabled: false,
      },
    ],
  },
];

export const initialIdentityInfo: IdentityInfoData = {
  fullName: "",
  birthDay: "",
  birthMonth: "",
  birthYear: "",
  frontImage: null,
  backImage: null,
};

export const initialTaxInfo: TaxInfoData = {
  taxId: "",
  businessType: "personal",
  invoiceAddress: "",
};
