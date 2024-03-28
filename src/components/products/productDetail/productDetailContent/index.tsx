import classnames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateResponse } from "src/models/Partner";
import {
  ListCountStarRatingResponse,
  ListRatingProductsResponse,
  ProductDetailResponse,
} from "src/models/Product";
import CustomerReviews from "./CustomerReviews";
import Description from "./Desciption";
import Specification from "./Specification";
import VendorInfo from "./VendorInfo";

interface Tab {
  id: string;
  label: string;
  component: () => React.ReactNode;
}

interface ProductDetailContentProps {
  productDetail?: ProductDetailResponse | null;
  ratingProduct?: ListCountStarRatingResponse | null;
  feedbackProduct?: ListRatingProductsResponse | null;
  vendorDetail?: CreateResponse | null;
}

const ProductDetailContent = (props: ProductDetailContentProps) => {
  const { t } = useTranslation();

  const tabs: Array<Tab> = useMemo(() => {
    return [
      {
        id: "1",
        label: t("products:description"),
        component: () => <Description productDetail={props.productDetail} />,
      },
      {
        id: "2",
        label: t("products:specification"),
        component: () => <Specification productDetail={props.productDetail} />,
      },
      {
        id: "3",
        label: t("products:vendorInfo"),
        component: () => <VendorInfo vendorDetail={props.vendorDetail} />,
      },
      {
        id: "4",
        label:
          t("products:customReviews") +
          `(${props.feedbackProduct ? props.feedbackProduct.total : 0})`,
        component: () => (
          <CustomerReviews ratingProduct={props.ratingProduct} />
        ),
      },
    ];
  }, [
    props.ratingProduct,
    props.feedbackProduct,
    props.vendorDetail,
    props.productDetail,
  ]);

  const [tabSelect, setTabSelect] = useState<Tab>(tabs[0]);

  useEffect(() => {
    setTabSelect(tabs[0]);
  }, [props.productDetail]);

  return (
    <div id="product-detail-content" className="mb-[40px]">
      <ul className="tabs">
        {tabs.map((tab) => (
          <li
            className={classnames(
              "inline-block text-xl font-bold py-4 mr-[40px] cursor-pointer",
              {
                "text-gray-99": tab.id !== tabSelect.id,
                "text-black-33 active": tab.id === tabSelect.id,
              },
              "tab-detail"
            )}
            key={`tab-description-${tab.id}`}
            onClick={() => setTabSelect(tab)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
      {/* <Divider style={{ marginBottom: 0 }} /> */}
      <div className="content-tab pt-4">{tabSelect.component()}</div>
    </div>
  );
};

export default ProductDetailContent;
