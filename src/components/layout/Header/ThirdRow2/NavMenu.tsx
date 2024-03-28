import React, { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineRight } from "react-icons/ai";
import {
  ItemAttributes,
  NavMenu,
  NavSubMenu,
} from "src/components/layout/Header/ThirdRow2/data";

type TipTopTextProps = {
  typeText: "hot" | "new";
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
>;

const TipTopText = ({ typeText, className, ...props }: TipTopTextProps) => {
  return (
    <span
      className={`uppercase rounded-[2px] text-[10px] flex px-[5px] py-[2px] font-semibold text-[white] ${
        typeText === "hot" ? "bg-[#ff9742]" : "bg-[#336699]"
      } ${className || ""}`}
      {...props}
    >
      {typeText}
    </span>
  );
};

type NavSubMenuProps = {
  subMenus: NavSubMenu[];
  isContent?: boolean;
  directionRender?: "horizontal" | "vertical";
  menuKey?: string;
};

const NavSubMenu = ({
  subMenus,
  isContent,
  directionRender = "vertical",
  menuKey,
}: NavSubMenuProps) => {
  const renderContent = useMemo(() => {
    return subMenus.map((subMenu) => {
      const typeText = (subMenu as NavSubMenu & ItemAttributes).tipTop;

      if (subMenu.children) {
        return (
          <li
            key={`${menuKey}-${subMenu.name}`}
            className="nav-item nav-item-with-menu"
          >
            <span className="item-text">
              {subMenu.name} <AiOutlineRight fontSize={8} />
            </span>
            <NavSubMenu
              menuKey={`${menuKey}-${subMenu.name}`}
              subMenus={subMenu.children}
            />
          </li>
        );
      } else {
        if (subMenu.content) {
          return (
            <li
              key={`${menuKey}-${subMenu.name}`}
              className="title-item px-[10px] pt-[15px]"
            >
              <span className="title-text">{subMenu.name}</span>

              <NavSubMenu
                menuKey={`${menuKey}-${subMenu.name}`}
                isContent
                subMenus={subMenu.content}
              />
            </li>
          );
        }

        return (
          <li key={`${menuKey}-${subMenu.name}`} className="nav-item">
            <span className="item-text items-center">
              {subMenu.name}
              {typeText && (
                <TipTopText className="ml-[4px]" typeText={typeText} />
              )}
            </span>
          </li>
        );
      }
    });
  }, [subMenus]);
  return isContent ? (
    <ul className="content-menu min-w-[175px] bg-white">{renderContent}</ul>
  ) : (
    <ul
      className={`sub-menu bg-white ${
        directionRender === "horizontal" ? "horizontal-menu" : ""
      }`}
    >
      {renderContent}
    </ul>
  );
};

type NavMenuProps = {
  menus: NavMenu[];
};

const NavMenu = ({ menus }: NavMenuProps) => {
  const { t } = useTranslation();
  return (
    // <ul className="nav-title-menu">
    //   {menus.map((menu) => {
    //     const ExpandIcon = menu.expandIcon;
    //     return (
    //       <li
    //         key={menu.name}
    //         className={`nav-title-item ${
    //           menu.children ? "nav-title-with-menu-item" : ""
    //         }`}
    //       >
    //         {menu.href ? (
    //           <Link href={menu.href}>
    //             <a className="nav-title-text text-[#333] font-semibold">
    //               {t(menu.name.toLocaleLowerCase())}
    //             </a>
    //           </Link>
    //         ) : (
    //           <span className="nav-title-text font-semibold">
    //             {t(menu.name.toLocaleLowerCase())}
    //           </span>
    //         )}
    //         {menu.children &&
    //           (ExpandIcon ? (
    //             <ExpandIcon className="expand-icon" fontSize={8} />
    //           ) : (
    //             <BsChevronDown className="expand-icon" fontSize={8} />
    //           ))}
    //         {menu.children && (
    //           <NavSubMenu
    //             menuKey={menu.name}
    //             directionRender={menu.directionRender}
    //             subMenus={menu.children}
    //           />
    //         )}
    //       </li>
    //     );
    //   })}
    // </ul>
    <Fragment></Fragment>
  );
};

export default NavMenu;
