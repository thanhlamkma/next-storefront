import { default as classNames, default as classnames } from "classnames";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosHeartEmpty } from "react-icons/io";
import { RiScales3Line } from "react-icons/ri";
import { catchError, map, of } from "rxjs";
import Images from "src/assets/images";
import { Button, Rating } from "src/components";
import LoginModal from "src/components/modal/LoginForm";
import ActionBar from "src/components/products/ActionBar";
import XIcon from "src/components/XIcon";
import { useJob } from "src/core/hooks";
import { Product } from "src/data/products";
import { FavouriteProductRequest } from "src/models/Product";
import BuyLaterProductRepository from "src/repositories/BuyLaterProductRepository";
import FavouriteProductRepository from "src/repositories/FavouriteProductRepository";
import ViewedProductRepository from "src/repositories/ViewedProductRepository";

interface CardProductProps extends Product {
  className?: string;
  positionContent?: "right" | "left" | "center";
  typeView?: "col" | "row";
  // Để hiện thị trong danh sách sản phẩm yêu thích
  isFavorite?: boolean;
  // Để hiện thị trong danh sách sản phẩm chung
  isFavorIcon?: boolean;
  isSaveLater?: boolean;
  isSaveLaterIcon?: boolean;
  showActionBar?: boolean;

  onClick?: () => void;
  onRemoveFavor?: () => void;
  onRemoveBuyLater?: () => void;
}

const CardProduct = ({
  id,
  image,
  name,
  price,
  quantity,
  reviews,
  star,
  type,
  priceReal,
  className = "",
  positionContent = "center",
  typeView = "col",
  isFavorite = false,
  isFavorIcon,
  isSaveLater = false,
  isSaveLaterIcon,
  showActionBar = false,
  onClick,
  onRemoveFavor,
  onRemoveBuyLater,
}: CardProductProps) => {
  const { t } = useTranslation();
  const session = useSession();
  const router = useRouter();

  const [modalAuth, setModalAuth] = useState<boolean>(false);

  // Call API
  const { run: addFavouriteProductApi } = useJob(
    useCallback((data: FavouriteProductRequest) => {
      return FavouriteProductRepository.addFavouriteProduct(data).pipe(
        map((res: any) => {
          console.log("add favor success:", res);
        }),
        catchError((err) => {
          console.log("add favor err", err);
          return of(err);
        })
      );
    }, [])
  );

  const { run: addBuyLaterProductApi } = useJob(
    useCallback((productTemplateId: number) => {
      return BuyLaterProductRepository.addBuyLaterProduct(
        productTemplateId
      ).pipe(
        map((data: any) => {
          console.log("addSuccess:", data);
        }),
        catchError((err) => {
          console.log("addErr", err);
          return of(err);
        })
      );
    }, [])
  );

  const { run: removeBuyLaterProductApi } = useJob(
    (productTemplateId: number) => {
      return BuyLaterProductRepository.removeBuyLaterProduct(
        productTemplateId
      ).pipe(
        map((data: any) => {
          console.log("remove success:", data);
        }),
        catchError((err) => {
          console.log("addErr", err);
          return of(err);
        })
      );
    }
  );

  const { run: addViewedProductApi } = useJob(
    useCallback((productTemplateId: number) => {
      return ViewedProductRepository.addViewedProduct(productTemplateId).pipe(
        map((res: any) => {
          console.log("add viewed success:", res);
        }),
        catchError((err) => {
          console.log("add viewed err", err);
          return of(err);
        })
      );
    }, [])
  );

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

  const isTypeRow = useMemo(() => typeView === "row", [typeView]);

  const renderRating = useMemo(() => {
    return (
      <Rating
        className={classNames({ "mb-2": isTypeRow })}
        allowHalf
        defaultValue={star}
        disabled
        count={5}
        fontReview={12}
        reviews={reviews}
        width="auto"
      />
    );
  }, [star, reviews]);

  const [isFavoriteProduct, setIsFavouriteProduct] = useState<boolean>(
    isFavorIcon ? isFavorIcon : false
  );
  const handleFavoutite = () => {
    if (session.status === "authenticated") {
      const isFavor: boolean = isFavoriteProduct;
      setIsFavouriteProduct(!isFavor);
      addFavouriteProductApi({
        productTemplateId: Number(id),
        isFavourite: !isFavor,
      });
    } else
      router.push({
        pathname: "/auth/login",
      });
    // setModalAuth(true);
  };

  const [isBuyLaterProduct, setIsBuyLaterProduct] = useState<boolean>(
    isSaveLaterIcon ? isSaveLaterIcon : false
  );
  const handleBuyLater = useCallback(() => {
    if (session.status === "authenticated") {
      const isBuyLater: boolean = isBuyLaterProduct;
      if (isBuyLater === true) removeBuyLaterProductApi(Number(id));
      setIsBuyLaterProduct(!isBuyLater);
      addBuyLaterProductApi(Number(id));
    } else
      router.push({
        pathname: "/auth/login",
      });
    // setModalAuth(true);
  }, []);

  const handleRemoveItem = () => {
    onRemoveFavor && onRemoveFavor();
    onRemoveBuyLater && onRemoveBuyLater();
  };

  // Handle redirect path
  const handleRedirectProduct = useCallback((id: number) => {
    if (session.status === "authenticated") addViewedProductApi(id);
    router.push(router.basePath + `/products/${id}`);
  }, []);

  return (
    <div
      id="card-product"
      className={classnames([
        className,
        {
          "flex gap-5 cursor-pointer": isTypeRow,
        },
        isFavorite || isSaveLater ? "relative" : "",
      ])}
    >
      {(isFavorite || isSaveLater) && (
        <div
          className="cursor-pointer absolute md:top-[-11px] md:right-[-11px] top-[-6px] right-[-6px]"
          style={{ zIndex: 1 }}
        >
          <Button className="btn-icon" onClick={handleRemoveItem}>
            <AiFillCloseCircle className="md:text-[26px] text-[20px] text-black" />
          </Button>
        </div>
      )}
      {/* 2sm:w-[40%] md:w-[unset] */}
      {/* With row type view => set width with percent */}
      <div
        className={`cursor-pointer flex items-center justify-center ${
          typeView === "row" ? "2sm:w-[40%] md:w-[unset]" : "relative"
        }`}
        onClick={() => handleRedirectProduct(Number(id))}
      >
        {typeView === "col" ? (
          <div className="product-img-wrapper relative">
            <Image
              src={image ? image : Images.product.noProductImg}
              width="300px"
              height="338px"
              objectFit="contain"
              onClick={() => handleRedirectProduct(Number(id))}
            />
            {showActionBar && (
              <ActionBar
                isFavourite={isFavoriteProduct}
                onClickFavouriteIcon={handleFavoutite}
                isBuyLater={isBuyLaterProduct}
                onClickBuyLaterIcon={handleBuyLater}
                className="absolute xxs:w-[140px] xxs:text-[30px] xxs:h-[30px] xxs:bottom-[20px] xxs:left-[50%] xxs:translate-x-[-50%] 2sm:w-[36px] 2sm:text-[36px] 2sm:h-[100px] 2sm:left-[unset] 2sm:right-[10px] 2sm:top-[15px] 2sm:translate-x-[unset] z-50"
              />
            )}
          </div>
        ) : (
          <div className="2sm:w-[100%] md:w-[unset] md:min-w-[260px]">
            <Image
              src={image ? image : Images.product.noProductImg}
              width="260px"
              height="290px"
              objectFit="cover"
              onClick={() => handleRedirectProduct(Number(id))}
            />
          </div>
        )}
      </div>
      <div
        className={classnames([
          "pt-4 flex flex-col cursor-pointer",
          {
            "flex-grow items-start justify-start": isTypeRow,
            "items-center justify-center": !isTypeRow,
          },
        ])}
        style={{ width: isTypeRow ? "calc(100% - 260px)" : "auto" }}
        onClick={() => handleRedirectProduct(Number(id))}
      >
        {/* kind and name */}
        <div
          className={`text-gray-99 mb-1 uppercase text-[11px] w-full text-${positionContent}`}
          style={{ textAlign: isTypeRow ? "left" : positionContent }}
        >
          {type}
        </div>
        <div
          className={classnames([`product-name text-${positionContent}`])}
          style={{
            textAlign: isTypeRow ? "left" : positionContent,
            fontSize: isTypeRow ? "18px" : "",
          }}
        >
          {name}
        </div>
        {/* rating and reviews */}
        {renderRating}
        {/* price */}
        <div
          className={classnames([
            "mt-2 flex items-center w-full",
            justifyPosition,
            { "mb-2": isTypeRow, "pb-4": !isTypeRow },
          ])}
        >
          {priceReal === "0" ? (
            <div
              className="new-price"
              style={{ fontSize: isTypeRow ? "18px" : "" }}
            >
              {t("utilities:currency", { val: price })}
            </div>
          ) : (
            <>
              {quantity === 0 ? (
                <div className="font-semibold text-base">
                  {t("products:outOfStock")}
                </div>
              ) : (
                <>
                  <div
                    className="new-price mr-2"
                    style={{ fontSize: isTypeRow ? "18px" : "" }}
                  >
                    {t("utilities:currency", { val: priceReal })}
                  </div>
                  <div
                    className="old-price"
                    style={{ fontSize: isTypeRow ? "18px" : "" }}
                  >
                    {t("utilities:currency", { val: price })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {isTypeRow && (
          <div className="expand-info">
            {/* <p className="description mb-10">
              Ultrices eros in cursus turpis massa cursus mattis. Volutpat ac
              tincidunt vitae semper quis lectus. Aliquam id diam maecenas
              ultricies…
            </p> */}
            {!isFavorite && (
              <div className="flex items-center gap-3 mt-3">
                {/* <Button className="button-add-cart uppercase text-sm">
                  <BiShoppingBag className="text-[18px] mr-2" />
                  {t("common:addToCart")}
                </Button> */}
                <span className="cursor-pointer text-2xl">
                  <IoIosHeartEmpty className="hover:text-red-400" />
                </span>
                <span className="cursor-pointer text-2xl">
                  <RiScales3Line className="hover:text-blue-33" />
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      <LoginModal
        className="customer-infor-modal"
        onCancel={() => setModalAuth(false)}
        centered
        visible={modalAuth}
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

export default CardProduct;
