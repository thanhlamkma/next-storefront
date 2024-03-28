import { default as classnames } from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiCommentDetail } from "react-icons/bi";
import Images from "src/assets/images";
import { Button } from "src/components";
import CommentProduct from "src/components/modal/CommentProduct";
import XIcon from "src/components/XIcon";
import { Product } from "src/data/products";

interface CardReviewProductProps extends Product {
  className?: string;
  positionContent?: "right" | "left" | "center";
  typeView?: "col" | "row";
  onRating?: (saleOrderLineId?: number) => void;
}

const CardReviewProduct = ({
  id,
  image,
  name,
  type,
  saleOrderLineId,
  className = "",
  positionContent = "center",
  typeView = "col",
  onRating,
}: CardReviewProductProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const justifyPosition = useMemo(() => {
    if (typeView === "row") return "justify-start";
    switch (positionContent) {
      case "left":
        return "justify-start";

      case "center":
        return "justify-center";

      case "right":
        return "justify-end";

      default:
        return "justify-center";
    }
  }, [positionContent, typeView]);

  const [comment, setComment] = useState<boolean>(false);

  const isTypeRow = useMemo(() => typeView === "row", [typeView]);

  return (
    <div
      id="card-product"
      className={classnames([
        className,
        {
          "flex gap-5 cursor-pointer": isTypeRow,
        },
      ])}
    >
      <div
        className="cursor-pointer flex items-center justify-center"
        onClick={() => router.push({ pathname: `/products/${id}` })}
      >
        {typeView === "col" ? (
          <Image
            src={image ? image : Images.product.noProductImg}
            width="300px"
            height="338px"
            objectFit="contain"
          />
        ) : (
          <div className="min-w-[260px]">
            <Image
              src={image ? image : Images.product.noProductImg}
              width="260px"
              height="290px"
              objectFit="contain"
            />
          </div>
        )}
      </div>
      <div
        className={classnames([
          "pt-4 flex flex-col",
          {
            "flex-grow items-start justify-start": isTypeRow,
            "items-center justify-center": !isTypeRow,
          },
        ])}
        style={{ width: isTypeRow ? "calc(100% - 260px)" : "auto" }}
      >
        {/* kind and name */}
        {/* <div
          className={`text-gray-99 mb-1 uppercase text-[11px] w-full text-${positionContent}`}
          style={{ textAlign: isTypeRow ? "left" : positionContent }}
        >
          {type}
        </div> */}
        <div
          className={classnames([`product-name text-${positionContent}`])}
          style={{
            textAlign: isTypeRow ? "left" : positionContent,
            fontSize: isTypeRow ? "18px" : "",
          }}
          onClick={() => router.push({ pathname: `/products/${id}` })}
        >
          {name}
        </div>
        {/* Description */}
        <div className="expand-info">
          {/* {isTypeRow && (
            <p className="description mb-10">
              Ultrices eros in cursus turpis massa cursus mattis. Volutpat ac
              tincidunt vitae semper quis lectus. Aliquam id diam maecenas
              ultricies…
            </p>
          )} */}
          <div
            className={`text-gray-99 mb-1 mt-3 uppercase text-[11px] w-full text-${positionContent}`}
            style={{ textAlign: isTypeRow ? "left" : positionContent }}
          >
            <div className="contents items-center gap-3">
              <Button
                className="button-add-cart uppercase"
                style={{
                  display: "inline-flex",
                  marginBottom: "10px",
                }}
                onClick={() => setComment(true)}
              >
                <BiCommentDetail className="xs:text-[16px] sm:text-[18px] mr-2" />
                {t("common:writeReview")}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <CommentProduct
        image={image}
        name={name}
        productId={id}
        saleOrderLineId={saleOrderLineId}
        className="customer-infor-modal"
        onCancel={() => setComment(false)}
        onRating={() => onRating && onRating(saleOrderLineId)}
        visible={comment}
        footer={null}
        closeIcon={
          <XIcon
            style={{
              top: "50%",
              right: "50%",
              transform: "translate(25%, -50%)",
            }}
          />
        }
      />
    </div>
  );
};

export default CardReviewProduct;
