export interface Address {
  id: string | number;
  name: string;
  address: string;
  phone: string;
  linkContent: string;
  isDefault: boolean;
}

export const addresses: Array<Address> = [
  {
    id: 1,
    name: "Tống Phương",
    address:
      "số nhà 824 đường phúc diễm, Phường Tây Mỗ, Quận Nam Từ Liêm, Hà Nội",
    phone: "0324298320",
    linkContent: "/my-account/address/update-address",
    isDefault: true,
  },
  {
    id: 2,
    name: "Đào Nguyên Bảo",
    address: "ngõ 85 - Xuân Thủy - Dịch Vọng - Cầu Giấy - Hà Nội",
    phone: "0328282383",
    linkContent: "/my-account/address/update-address",
    isDefault: false,
  },
  {
    id: 3,
    name: "Nguyễn Văn Nam",
    address: "Hồ Thanh Trì, Tân Triều, Triều Khúc, Hà Đông, Hà Nội",
    phone: "0329238500",
    linkContent: "/my-account/address/update-address",
    isDefault: false,
  },
  {
    id: 4,
    name: "Tạ Quang Thắng",
    address: "Hồ Thanh Trì, Tân Triều, Triều Khúc, Hà Đông, Hà Nội",
    phone: "0329238500",
    linkContent: "/my-account/address/update-address",
    isDefault: false,
  },
];
