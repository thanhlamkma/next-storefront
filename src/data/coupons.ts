import Images from "src/assets/images";

export interface Coupon {
  id: string | number;
  code: string;
  name: string;
  isApp: boolean;
  image: string;
  deal: string;
  forOrder: string;
  expiry: string;
  condition: Array<string>;
}

export const coupons: Array<Coupon> = [
  {
    id: 1,
    code: "389123929381",
    name: "Ví ZaloPay",
    isApp: false,
    image: Images.coupon.zalo,
    deal: "Giảm 20k",
    forOrder: "Cho đơn hàng từ 189K",
    expiry: "30/12/2022",
    condition: [
      "Giảm 20K cho đơn hàng từ 189K.",
      "Áp dụng cho các sản phẩm trong danh mục NGON.",
      "Mỗi khách hàng được sử dụng tối đa 1 lần.",
      "Không áp dụng cho trả góp.",
    ],
  },
  {
    id: 1,
    code: "2023921823223",
    name: "Ví Momo",
    isApp: true,
    image: Images.coupon.momo,
    deal: "Giảm 45k",
    forOrder: "Cho đơn hàng từ 90k",
    expiry: "23/10/2022",
    condition: [
      "Giảm 20K cho đơn hàng từ 189K.",
      "Áp dụng cho các sản phẩm trong danh mục NGON.",
      "Mỗi khách hàng được sử dụng tối đa 1 lần.",
    ],
  },
  {
    id: 1,
    code: "9823912832103",
    name: "Ví Moca",
    isApp: true,
    image: Images.coupon.moca,
    deal: "Giảm 25k",
    forOrder: "Cho đơn hàng từ 50K",
    expiry: "15/12/2022",
    condition: [
      "Giảm 20K cho đơn hàng từ 189K.",
      "Mỗi khách hàng được sử dụng tối đa 1 lần.",
      "Không áp dụng cho trả góp.",
    ],
  },
];
