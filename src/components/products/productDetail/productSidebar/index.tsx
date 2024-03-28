import Image from "next/image";
import React from "react";
import { BiMoney } from "react-icons//bi";
import { BsBagCheck, BsTruck } from "react-icons/bs";
import Images from "src/assets/images";

const service = [
  {
    icon: <BsTruck className="text-[34px]"></BsTruck>,
    title: "Free Shipping & Returns",
    description: "For all orders over $99",
  },
  {
    icon: <BsBagCheck className="text-[34px]"></BsBagCheck>,
    title: "Secure Payment",
    description: "We ensure secure payment",
  },
  {
    icon: <BiMoney className="text-[34px]"></BiMoney>,
    title: "Money Back Guarantee",
    description: "Any back within 30 days",
  },
];

interface ProductSideBarProps {}

const ProductSideBar = (props: ProductSideBarProps) => {
  return (
    <div id="product-side-bar">
      <div className="border-[1px] border-solid border-gray-ee px-5 mb-[30px]">
        {service.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-4 py-5 item-service"
          >
            <div>{item.icon}</div>
            <div>
              <h4 className="mb-0 text-sm text-black-33">{item.title}</h4>
              <div className="text-gray-99 text-[13px]">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Image
          className="rounded-lg"
          src={Images.banner.bds}
          width={266}
          height={220}
        />
      </div>
    </div>
  );
};

export default ProductSideBar;
