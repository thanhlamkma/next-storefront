import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { catchError, map, of } from "rxjs";
import { useJob } from "src/core/hooks";
import { ProductCategory2 } from "src/models/Product";
import CategoryRepository from "src/repositories/CategoryRepository";

type Props = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

type CategoryParent = {
  id: number;
  name: string;
};

const LeftSideBar = ({ show, setShow }: Props) => {
  const router = useRouter();
  const [cateParent, setCateParent] = useState<CategoryParent[]>([]);
  const { run: getListCategory } = useJob(() => {
    return CategoryRepository.get().pipe(
      map(({ data }: { data: ProductCategory2[] }) => {
        const tempCateParent: CategoryParent[] = [];
        data.map((item) => {
          if (item.parentId === null) {
            tempCateParent.push({
              id: item.id,
              name: item.name,
            });
          }
        });
        setCateParent(tempCateParent);
      }),
      catchError((err) => {
        console.log("get list cate err", err);
        return of(err);
      })
    );
  });

  useEffect(() => {
    getListCategory();
  }, []);

  const handleRedirectCategory = useCallback((categoryId: number) => {
    router.push(
      router.basePath +
        `/products?category=${categoryId}&page=1&limit=9&sort=default`
    );
  }, []);

  // const [currentMenu, setCurrentMenu] = useState<"main-menu" | "categories">(
  //   "main-menu"
  // );
  const [currentMenu, setCurrentMenu] = useState<"categories">("categories");

  const { t } = useTranslation();

  useEffect(() => {
    const bodyElement = document.querySelector("body") as HTMLBodyElement;
    const mainLoading = document.querySelector(
      "#main-spin-container"
    ) as HTMLDivElement;
    if (show) {
      document
        .querySelector("#layout")!
        .classList.remove("side-bar-disappeared");
      document.querySelector("#layout")!.classList.add("show-left-side-bar");

      mainLoading.style.overflow = "hidden";
      bodyElement.style.overflow = "hidden";
    }
    if (!show) {
      document.querySelector("#layout")!.classList.remove("show-left-side-bar");
      mainLoading.style.overflowY = "auto";
      bodyElement.style.overflowY = "auto";
      setTimeout(() => {
        mainLoading.style.overflowX = "unset";
        bodyElement.style.overflowX = "unset";
      }, 500);
    }
  }, [show]);

  const handleMaskClicked = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <div
      className="fixed left-side-bar-wrapper w-[100vw] h-[100vh] top-0 left-0 z-100 opacity-1"
      style={{
        visibility: `${show ? "visible" : "hidden"}`,
        opacity: `${show ? 1 : 0}`,
      }}
    >
      <div
        onClick={handleMaskClicked}
        className="left-side-bar-mask bg-[#222] absolute top-0 left-0 w-[100%] h-[100%] z-[-1] opacity-50"
      ></div>
      <div className="left-side-bar h-[100%] px-[15px] py-[20px] absolute top-0 -left-left-side-bar w-left-side-bar bg-[#067fc2]">
        {/* <div className="left-side-bar-search rounded-[2px] items-center w-[100%] flex mb-[30px]">
          <input
            placeholder="Search"
            className="search-input bg-transparent w-[90%] px-[20px] py-[8px] text-[12px]"
            type="text"
          />
          <button className="border-none outline-none bg-transparent flex items-center w-[36px] p-[6px] justify-center">
            <BiSearch
              className="search-icon w-[100%] h-[100%] block"
              fontSize={24}
              color="white"
            />
          </button>
        </div> */}
        <div className="left-side-bar-content text-[white]">
          <div className="content-title-wrapper flex">
            {/* <div
              className={`content-title ${
                currentMenu === "categories" ? "content-title-active" : ""
              } text-center px-[16px] cursor-pointer py-[6px] uppercase`}
              onClick={() => setCurrentMenu("categories")}
            > */}
            <div
              className={`content-title text-center px-[16px] cursor-pointer py-[6px] uppercase`}
              onClick={() => setCurrentMenu("categories")}
            >
              {t("layout:categories")}
            </div>
            {/* <div
              className={`content-title ${
                currentMenu === "categories" ? "content-title-active" : ""
              } text-center px-[16px] cursor-pointer py-[6px] uppercase`}
              onClick={() => setCurrentMenu("categories")}
            >
              {t("layout:categories")}
            </div> */}
          </div>
          <div className="content-menu-wrapper py-[12px]">
            <ul
              className={`categories ${
                currentMenu === "categories" ? "active-menu" : ""
              }`}
            >
              <li className="side-bar-item relative cursor-pointer">
                <span
                  className="px-[8px] py-[13px] block"
                  onClick={() => {
                    handleMaskClicked();
                    router.push("/");
                  }}
                >
                  {t("layout:home")}
                </span>
                {/* {menu.items && (
                      <AiOutlineRight
                        className="side-bar-item-arrow"
                        fontSize={8}
                      />
                    )} */}
              </li>
              {cateParent.map((item, index) => (
                <li
                  className="side-bar-item relative cursor-pointer"
                  key={`category-side-bar-${index}`}
                >
                  <span
                    className="px-[8px] py-[13px] flex items-center"
                    onClick={() => {
                      handleMaskClicked();
                      handleRedirectCategory(item.id);
                    }}
                  >
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
            {/* <ul
              className={`categories-menu ${
                currentMenu === "categories" ? "active-menu" : ""
              }`}
            >
              {cateParent.map((item, index) => (
                <li
                  className="side-bar-item relative cursor-pointer"
                  key={`category-side-bar-${index}`}
                >
                  <span
                    className="px-[8px] py-[13px] flex items-center"
                    onClick={() => handleRedirectCategory(item.id)}
                  >
                    {item.name}
                  </span>
                </li>
              ))}
            </ul> */}
            {/* {categories.map((menu, index) => {
                const Logo = genLogo[menu.title as CategoriesType];
                return (
                  <li
                    className="side-bar-item relative cursor-pointer"
                    key={`category-side-bar-${index}`}
                  >
                    <span className="px-[8px] py-[13px] flex items-center">
                      {Logo && (
                        <div className="text-[24px] mr-[12px] flex items-center">
                          <Logo className="inline-block" />
                        </div>
                      )}
                      {menu.title}
                    </span>
                    {menu.items && (
                      <AiOutlineRight
                        className="side-bar-item-arrow"
                        fontSize={8}
                      />
                    )}
                  </li>
                );
              })} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
