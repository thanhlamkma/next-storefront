import { useTranslation } from "react-i18next";
import { BsChevronDown } from "react-icons/bs";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import Container from "src/components/Container";
import CategoriesDropdownMenu from "src/components/layout/Header/ThirdRow/CategoriesDropdownMenu";
import { navMenuData } from "src/components/layout/Header/ThirdRow2/data";
import NavMenu from "src/components/layout/Header/ThirdRow2/NavMenu";

type Props = {};

const ThirdRow2 = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className="third-row2">
      <Container className="xs:hidden mlg:flex">
        <div
          className="wrapper-categories-btn relative w-[25%] max-w-[271px] "
          // onMouseEnter={handleHoverCategoriesDropdown}
          // onMouseLeave={handleUnHoverCategoriesDropdown}
        >
          <div className="first-drop-down p-[14px]">
            <p className="text-[14px] font-semibold uppercase flex items-center w-[100%]">
              <HiOutlineMenuAlt1 fontSize={20} />
              <span className="mx-[8px] md:pr-0 2lg:pr-[36px] max-w-[232px] w-[85%] text-ellipsis overflow-hidden whitespace-nowrap">
                {t("layout:browseCategories")}
              </span>
              <BsChevronDown className="ml-[4px]" fontSize={8} />
            </p>
          </div>
          <CategoriesDropdownMenu />
        </div>
        <NavMenu menus={navMenuData} />
        {/* <div className="daily-deals">
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
        </div> */}
      </Container>
    </div>
  );
};

export default ThirdRow2;
