import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { BsChevronDown } from "react-icons/bs";
import { GiPriceTag } from "react-icons/gi";
import { GoLocation } from "react-icons/go";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import Container from "src/components/Container";
import CategoriesDropdownMenu from "src/components/layout/Header/ThirdRow/CategoriesDropdownMenu";
import DropdownMenu from "src/components/layout/Header/ThirdRow/DropdownMenu";
import {
  ItemsDropdown,
  mainMenuData,
  ShopMenuDataType,
} from "src/components/layout/Header/ThirdRow/mockData";
import ShopDropdownMenu from "src/components/layout/Header/ThirdRow/ShopDropdownMenu";

type Props = {};

const ThirdRow = (props: Props) => {
  const { t } = useTranslation();
  const hoverInDropDownItem = useCallback((e: any) => {
    const a = e.currentTarget as HTMLElement;

    const b = a.querySelector(".hover-text-animation") as HTMLDivElement;
    if (b) {
      b.classList.remove("runOutAnimation");
      b.classList.add("runInAnimation");
    }
  }, []);

  const unHoverDropDownItem = useCallback((e) => {
    const a = e.currentTarget as HTMLElement;
    const b = a.querySelector(".hover-text-animation") as HTMLDivElement;

    if (b) {
      b.classList.remove("runInAnimation");
      b.classList.add("runOutAnimation");
    }
  }, []);

  const handleHoverOtherDropdown = useCallback((e) => {
    const a = e.currentTarget as HTMLElement;
    const menu = a.querySelector(".menu-container");
    if (menu) {
      menu.classList.remove("hidden");
      menu.classList.add("block");
    }
    hoverInDropDownItem(e);
  }, []);

  const handleUnHOverOtherDropdown = useCallback((e) => {
    const a = e.currentTarget as HTMLElement;

    const menu = a.querySelector(".menu-container");
    if (menu) {
      menu.classList.remove("block");
      menu.classList.add("hidden");
    }
    unHoverDropDownItem(e);
  }, []);

  const handleHoverShopDropdown = useCallback((e) => {
    const a = e.currentTarget as HTMLElement;
    const menu = a.querySelector(".shop-dropdown");

    if (menu) {
      menu.classList.remove("hidden");
      menu.classList.add("flex");
    }
    hoverInDropDownItem(e);
  }, []);

  const handleUnHoverShopDropdown = useCallback((e) => {
    const a = e.currentTarget as HTMLElement;

    const menu = a.querySelector(".shop-dropdown");
    if (menu) {
      menu.classList.remove("flex");
      menu.classList.add("hidden");
    }
    unHoverDropDownItem(e);
  }, []);

  // const handleHoverCategoriesDropdown = useCallback((e) => {
  //   const a = e.currentTarget as HTMLElement;
  //   const menu = a.querySelector(".categories-drop-down");
  //   console.log(a);

  //   if (menu) {
  //     menu.classList.remove("hidden");
  //     menu.classList.add("flex");
  //   }
  // }, []);

  // const handleUnHoverCategoriesDropdown = useCallback((e) => {
  //   const a = e.currentTarget as HTMLElement;

  //   const menu = a.querySelector(".categories-drop-down");
  //   if (menu) {
  //     menu.classList.remove("flex");
  //     menu.classList.add("hidden");
  //   }
  // }, []);

  return (
    <div className="third-row w-[100%] xs:hidden mlg:flex">
      <Container className="flex justify-between">
        <div className="drop-down-group flex flex-1">
          <div
            className="wrapper-categories-btn relative"
            // onMouseEnter={handleHoverCategoriesDropdown}
            // onMouseLeave={handleUnHoverCategoriesDropdown}
          >
            <div className="first-drop-down p-[14px]">
              <p className="text-[14px] font-semibold uppercase flex items-center">
                <HiOutlineMenuAlt1 fontSize={20} />
                <span className="mx-[8px] md:pr-0 2lg:pr-[36px]">
                  {t("layout:browseCategories")}
                </span>
                <BsChevronDown className="ml-[4px]" fontSize={8} />
              </p>
            </div>
            <CategoriesDropdownMenu />
          </div>
          <ul className="other-drop-down flex flex-1 pl-2">
            <li className="item-dropdown">
              <div className="text-area">
                <p className="drop-down-text">{t(mainMenuData[0].title)}</p>
                <div className="hover-text-animation"></div>
              </div>
            </li>
            <li
              className="item-dropdown"
              onMouseEnter={handleHoverShopDropdown}
              onMouseLeave={handleUnHoverShopDropdown}
            >
              <div className="text-area">
                <p className="drop-down-text">{t(mainMenuData[1].title)}</p>
                <div className="hover-text-animation"></div>
              </div>
              <div className="arrow-dropdown-icon">
                <BsChevronDown className="arrow-dropdown-icon" />
              </div>
              {mainMenuData[1].items && (
                <ShopDropdownMenu
                  data={mainMenuData[1].items as ShopMenuDataType[]}
                />
              )}
            </li>
            {mainMenuData.map((menu, index) => {
              if (index <= 1)
                return (
                  <React.Fragment
                    key={`main-${menu.title}-${index}`}
                  ></React.Fragment>
                );
              return (
                <li
                  key={`main-menu-${index}-${t(menu.title)}`}
                  className="item-dropdown"
                  onMouseEnter={handleHoverOtherDropdown}
                  onMouseLeave={handleUnHOverOtherDropdown}
                >
                  <div className="text-area">
                    <p className="drop-down-text">{t(menu.title)}</p>
                    <div className="hover-text-animation"></div>
                  </div>
                  <div className="arrow-dropdown-icon">
                    <BsChevronDown className="arrow-dropdown-icon" />
                  </div>
                  {menu.items && (
                    <DropdownMenu items={menu.items as ItemsDropdown[]} />
                  )}
                </li>
              );
            })}
            {/* <li
              className="item-dropdown"
              onMouseEnter={handleHoverOtherDropdown}
              onMouseLeave={handleUnHOverOtherDropdown}
            >
              <div className="text-area">
                <p className="drop-down-text">Blog</p>
                <div className="hover-text-animation"></div>
              </div>
              <div className="arrow-dropdown-icon">
                <BsChevronDown className="arrow-dropdown-icon" />
              </div>
              <DropdownMenu items={blog} />
            </li>
            <li
              className="item-dropdown"
              onMouseEnter={handleHoverOtherDropdown}
              onMouseLeave={handleUnHOverOtherDropdown}
            >
              <div className="text-area">
                <p className="drop-down-text">Pages</p>
                <div className="hover-text-animation"></div>
              </div>
              <div className="arrow-dropdown-icon">
                <BsChevronDown className="arrow-dropdown-icon" />
              </div>
              <DropdownMenu items={pages} />
            </li>
            <li
              className="item-dropdown"
              onMouseEnter={handleHoverOtherDropdown}
              onMouseLeave={handleUnHOverOtherDropdown}
            >
              <div className="text-area">
                <p className="drop-down-text">Elements</p>
                <div className="hover-text-animation"></div>
              </div>
              <div className="arrow-dropdown-icon">
                <BsChevronDown className="arrow-dropdown-icon" />
              </div>
              <DropdownMenu items={elements} />
            </li> */}
          </ul>
        </div>
        <div className="daily-deals">
          <ul className="flex items-center h-[100%]">
            <li className="flex items-center xs:hidden 2lg:flex">
              <GoLocation fontSize={24} />
              <span className="text-[14px] font-semibold whitespace-nowrap">
                {t("layout:trackOrder")}
              </span>
            </li>
            <li className="flex items-center">
              <GiPriceTag fontSize={24} />
              <span className="text-[14px] font-semibold whitespace-nowrap">
                {t("layout:dailyDeals")}
              </span>
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default ThirdRow;
