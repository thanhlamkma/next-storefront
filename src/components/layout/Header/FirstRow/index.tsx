import { LogoutOutlined } from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { VscAccount } from "react-icons/vsc";
import { catchError, map, of } from "rxjs";
import Images from "src/assets/images";
import Container from "src/components/Container";
import { convertWordNotWrap } from "src/components/layout/Header/ThirdRow/ShopDropdownMenu";
import LoginModal from "src/components/modal/LoginForm";
import XIcon from "src/components/XIcon";
import { useJob } from "src/core/hooks";
import { GetBaseProfileResponse } from "src/models/InfoUser";
import InfoUserRepository from "src/repositories/InfoUserRepository";

interface PropsFirstRowHeader {}

const FirstRow = (props: PropsFirstRowHeader) => {
  const { t } = useTranslation("layout");
  const session = useSession();
  const router = useRouter();

  const [curLanguage, setCurLanguage] = useState<"en" | "vi">(() => {
    return router.locale as "en" | "vi";
  });
  const [infoUser, setInfoUser] = useState<GetBaseProfileResponse>();
  const [modalAuth, setModalAuth] = useState<boolean>(false);

  const { run: getUserApi } = useJob(() => {
    return InfoUserRepository.getBaseProfile().pipe(
      map(({ data }: { data: GetBaseProfileResponse }) => {
        console.log("get user success", data);
        setInfoUser(data);
      }),
      catchError((err) => {
        console.log("get user err", err);
        return of(err);
      })
    );
  });

  useEffect(() => {
    if (session.status === "authenticated") getUserApi();
  }, [session.status]);

  const handleChoosingLanguage = useCallback(
    (language: "en" | "vi") => {
      // document.cookie = `locale=${language}`;
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
          },
        },
        undefined,
        {
          locale: language,
        }
      );
      // setTimeout(() => {
      //   window.location.reload();
      // }, 2000);
    },
    [router]
  );

  return (
    <div className="first-row w-[100%] bg-[#f5f6f8]">
      <Container className="flex justify-between items-center">
        <div className="header-left">
          <span className="left-text text-menu-header py-[12px]">
            {convertWordNotWrap(`${t("layout:welcomeBrand")}`, 0)}
          </span>
        </div>
        <div className="nav-menu py-[12px]">
          <div className="first-nav-menu">
            {/* <li className="first-nav-item item-get-arrow relative">
              USD
              <BsChevronDown className="ml-[4px]" />
              <DropdownMenu>
                <div dropdown-item>USD</div>
                <div dropdown-item>EUR</div>
              </DropdownMenu>
            </li> */}

            {/* Language */}
            {/* <li className="first-nav-item item-get-arrow relative" {...props}>
              <div className="flex">
                <div className="flag-img-wrapper">
                  <Image
                    src={
                      curLanguage === "en"
                        ? Images.icons.engFlag
                        : Images.icons.viFlag
                    }
                    width={14}
                    height={8}
                    objectFit="contain"
                  />
                </div>
                <span className="ml-[2px]">
                  {curLanguage.toLocaleUpperCase()}
                </span>
              </div>
              <BsChevronDown className="ml-[4px]" />
              <DropdownMenu className="max-w-[80px]">
                <div className="flex">
                  <div className="flag-img-wrapper w-[20px]">
                    <Image
                      src={Images.icons.engFlag}
                      width={14}
                      height={8}
                      objectFit="contain"
                    />
                  </div>
                  <span
                    className="ml-[2px] dropdown-item"
                    onClick={() => handleChoosingLanguage("en")}
                  >
                    EN
                  </span>
                </div>
                <div className="flex">
                  <div className="flag-img-wrapper w-[20px]">
                    <Image
                      src={Images.icons.viFlag}
                      width={14}
                      height={8}
                      objectFit="contain"
                    />
                  </div>
                  <span
                    className="ml-[2px] dropdown-item"
                    onClick={() => handleChoosingLanguage("vi")}
                  >
                    VI
                  </span>
                </div>
              </DropdownMenu>
            </li> */}

            {/* <li className="first-nav-item">Blog</li> */}
            {/* <li className="first-nav-item">{t("layout:saveMoreWithApp")}</li>
            <li className="first-nav-item">{t("layout:checkYourOrder")}</li> */}
            {session.status === "authenticated" && (
              <Fragment>
                <li className="first-nav-item">
                  <Link href={{ pathname: "/my-account/order" }}>
                    {t("layout:checkYourOrder")}
                  </Link>
                </li>
                <li className="first-nav-item infor">
                  <Link href={{ pathname: "/my-account/information" }}>
                    <div className="flex items-center gap-[6px]">
                      {/* {session.data?.user.image ? (
                      <img
                        src={session.data.user.image}
                        className="first-nav-item avatar w-7 rounded-full mr-1"
                      />
                    ) : (
                      <VscAccount
                        className="first-nav-item avatar inline-block mr-[4px]"
                        fontSize={16}
                      />
                    )} */}
                      <img
                        className="rounded-full"
                        src={infoUser?.avatar ? infoUser.avatar : Images.avatar}
                        width={20}
                        height={20}
                        style={{ objectFit: "cover" }}
                        onError={() => {}}
                      />
                      <span className="w-[60px] inline-block mr-1 text-ellipsis overflow-hidden">
                        {infoUser
                          ? infoUser.name
                            ? infoUser.name
                            : infoUser.nickName
                          : ""}
                      </span>
                    </div>
                  </Link>
                </li>
                <li className="first-nav-item">|</li>
              </Fragment>
            )}
            <li className="first-nav-item auth items-baseline">
              {session.status === "unauthenticated" ? (
                <span>
                  <VscAccount className="inline-block mr-[4px]" fontSize={16} />
                  <Link
                    href={{
                      pathname: "/auth/login",
                    }}
                  >
                    {t("layout:signIn")}
                  </Link>
                  {" / "}
                  <Link
                    href={{
                      pathname: "/auth/login",
                      search: "tab=signUp",
                    }}
                  >
                    {t("layout:register")}
                  </Link>
                </span>
              ) : (
                // <span
                //   onClick={() => setModalAuth(true)}
                //   className="inline cursor-pointer"
                // >
                //   <VscAccount className="inline-block mr-[4px]" fontSize={16} />
                //   {t("layout:signIn")} / {t("layout:register")}
                // </span>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => signOut({ callbackUrl: `/${router.locale}/` })}
                >
                  {t("auth:logOut")}
                  <LogoutOutlined />
                </div>
              )}
            </li>
          </div>
        </div>
      </Container>
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

export default FirstRow;
