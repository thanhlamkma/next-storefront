import React, { useMemo } from "react";
import { AiOutlineRight } from "react-icons/ai";
import { ItemsDropdown } from "src/components/layout/Header/ThirdRow/mockData";

type Props = {
  items?: Array<ItemsDropdown>;
};

type Position = {
  top?: string | number;
  left?: string | number;
  bottom?: string | number;
  right?: string | number;

  translateX?: string;
  translateY?: string;
};

interface MenuContainerType
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLUListElement>,
      HTMLUListElement
    >,
    Position {
  show?: boolean;
}

const MenuContainer = ({
  top,
  left,
  bottom,
  right,
  translateX,
  translateY,
  className,
  style,
  show = true,
  children,
  ...props
}: MenuContainerType) => {
  const translateGen = useMemo(() => {
    if (translateX !== undefined) {
      return translateY !== undefined
        ? `translate(${translateX}, ${translateY})`
        : `translateX(${translateX})`;
    } else if (translateY !== undefined) {
      return translateX !== undefined
        ? `translate(${translateX}, ${translateY})`
        : `translateY(${translateY})`;
    } else return "";
  }, [translateX, translateY]);

  return show ? (
    <ul
      className={`menu-container bg-white hidden py-[18px] ${className || ""}`}
      style={{
        top,
        left,
        bottom,
        right,
        transform: translateGen,
      }}
      {...props}
    >
      {children}
    </ul>
  ) : (
    <></>
  );
};

type ItemDropdownType = {
  haveSubMenu?: boolean;
  title?: string;
  titleClassName?: string;
} & React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;

const ItemDropdown = ({
  children,
  className,
  haveSubMenu,
  title = "",
  titleClassName,
}: ItemDropdownType) => {
  return (
    <li
      className={`px-[12px] relative flex items-center ${
        haveSubMenu ? "justify-between" : "justify-start"
      } ${className || ""}`}
      onMouseEnter={(e) => {
        const a = e.currentTarget as HTMLElement;
        const b = a.querySelector(".menu-container") as HTMLElement;
        if (b) {
          b.classList.remove("hidden");
          b.classList.add("block");
        }
      }}
      onMouseLeave={(e) => {
        const a = e.currentTarget as HTMLElement;
        const b = a.querySelector(".menu-container") as HTMLElement;

        if (b) {
          b.classList.remove("block");
          b.classList.add("hidden");
        }
      }}
    >
      {title.trim() != "" && (
        <span className={`m-0 relative text-menu-item ${titleClassName || ""}`}>
          {title.split(" ").map((word, index, arr) => {
            return index < arr.length - 1 ? (
              <React.Fragment
                key={`add-space-${Math.random() * 10000 * index}`}
              >
                {word}&nbsp;
              </React.Fragment>
            ) : (
              <React.Fragment
                key={`add-space-${Math.random() * 10000 * index}`}
              >
                {word}
                &emsp;&emsp;&emsp;&emsp;&emsp;
              </React.Fragment>
            );
          })}
        </span>
      )}
      {haveSubMenu && <AiOutlineRight fontSize={12} />}
      {haveSubMenu && children}
    </li>
  );
};

const DropdownMenu = ({
  items = [
    {
      title: "Store Listing",
      item: ["Store Listing 1", "Store Listing 2", "Store Listing 3"],
    },
    {
      title: "Vendor Store",
      item: ["Vendor Store 1", "Vendor Store 2", "Vendor Store 3"],
    },
  ],
}: Props) => {
  return (
    <MenuContainer top="100%" left={0}>
      {items.map((item, index) => {
        return (
          <ItemDropdown
            haveSubMenu={item.item ? true : false}
            className="third-row-item-drop"
            key={`third-row-item-drop-${Math.random() * 10000 * index}`}
            title={item.title}
          >
            {item.item && (
              <MenuContainer
                className="sub-menu-container"
                top={-16}
                left="100%"
              >
                {item.item.map((item, index) => {
                  return (
                    <ItemDropdown
                      className="thrid-row-sub-item"
                      key={`sub-${Math.random() * 10000 * index}`}
                      title={item}
                    />
                  );
                })}
              </MenuContainer>
            )}
          </ItemDropdown>
        );
      })}
    </MenuContainer>
  );
};

export default DropdownMenu;
