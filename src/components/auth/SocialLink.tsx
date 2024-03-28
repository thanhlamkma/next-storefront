import { Divider, Tooltip } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { HiHeart } from "react-icons/hi";
import { RiScalesLine } from "react-icons/ri";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialPinterest,
  TiSocialTwitter,
} from "react-icons/ti";
import { VscHeart } from "react-icons/vsc";
import { catchError, map, of } from "rxjs";
import { useJob } from "src/core/hooks";
import { FavouriteProductRequest } from "src/models/Product";
import FavouriteProductRepository from "src/repositories/FavouriteProductRepository";

interface SocialLinkProps {
  type?: "signIn" | "signUp";
  productId?: number;
  isFavourite?: boolean;
}

const SocialLink = ({ type, productId, isFavourite }: SocialLinkProps) => {
  const session = useSession();
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [favor, setFavor] = useState<boolean | undefined>(isFavourite);

  const { run: addFavouriteApi } = useJob((data: FavouriteProductRequest) => {
    return FavouriteProductRepository.addFavouriteProduct(data).pipe(
      map((res: any) => {
        console.log("addSuccess:", res);
      }),
      catchError((err) => {
        console.log("addErr", err);
        return of(err);
      })
    );
  });

  // Handle change favourite product
  const handleFavourite = () => {
    setFavor(!favor);
    setLoading(true);
    addFavouriteApi({
      productTemplateId: productId,
      isFavourite: !favor,
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    setFavor(isFavourite);
  }, [isFavourite]);

  return (
    <>
      <div
        id="social-link"
        // className="py-[26px] flex justify-center items-center flex-col"
        className={
          type === undefined
            ? "flex items-start flex-col"
            : "py-[26px] flex justify-center items-center flex-col"
        }
      >
        <div className="mb-5 text-sm text-gray-66">
          {type === "signIn"
            ? t("auth:signInWithSocial")
            : type === "signUp"
            ? t("auth:signUpWithSocial")
            : ""}
        </div>
        {session.status === "authenticated" ? (
          <div className="social-link-wrap flex items-center gap-2">
            <div className="flex gap-2">
              <a href="#" className="social-product social-product-facebook">
                <TiSocialFacebook />
              </a>
              <a href="#" className="social-product social-product-twitter">
                <TiSocialTwitter />
              </a>
              <a href="#" className="social-product social-product-pinterest">
                <TiSocialPinterest />
              </a>
              <a href="#" className="social-product social-product-whatsapp">
                <AiOutlineWhatsApp />
              </a>
              <a href="#" className="social-product social-product-linkedin">
                <TiSocialLinkedin />
              </a>
            </div>
            <Divider className="h-[18px]" type="vertical" />
            <a className="heart" onClick={handleFavourite}>
              <div className={loading ? "hidden" : ""}>
                <Tooltip title={t("myAccount:addFavoriteProduct")}>
                  {favor ? <HiHeart color="red" /> : <VscHeart />}
                </Tooltip>
              </div>
              <div className={loading ? "loader" : "hidden"}></div>
            </a>
            <a href="#" className="heart">
              <Tooltip title={t("myAccount:compareProduct")}>
                <RiScalesLine />
              </Tooltip>
            </a>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default SocialLink;
