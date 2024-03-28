import Images from "src/assets/images";

export interface Payment {
  id: string | number;
  name: string;
  accountNumber: string;
  image: string;
}

export const payments: Array<Payment> = [
  {
    id: 1,
    accountNumber: "3891.2392.9381.****",
    name: "Ví ZaloPay",
    image: Images.coupon.zalo,
  },
  {
    id: 2,
    accountNumber: "2023.9218.2322.****",
    name: "Ví Momo",
    image: Images.coupon.momo,
  },
  {
    id: 3,
    accountNumber: "9823.9128.3210.****",
    name: "Ví Moca",
    image: Images.coupon.moca,
  },
];
