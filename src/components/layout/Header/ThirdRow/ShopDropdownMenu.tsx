import React from "react";
import { ShopMenuDataType } from "src/components/layout/Header/ThirdRow/mockData";

type Props = {
  data?: Array<ShopMenuDataType>;
};

export const convertWordNotWrap = (words: string, space?: number) => {
  return (
    <>
      {words.split(" ").map((word, index, arr) => {
        const arrSpace = space ? Array.from(new Array(space), () => 0) : [];
        if (space) {
          if (index < arr.length - 1)
            return <React.Fragment key={index}>{word}&nbsp;</React.Fragment>;
          else
            return (
              <React.Fragment
                key={`${word}-${space}-${Math.random() * 10000 * index}`}
              >
                {word}
                {arrSpace.map((count) => (
                  <React.Fragment key={count}>&#8195;</React.Fragment>
                ))}
              </React.Fragment>
            );
        } else {
          return <React.Fragment key={index}>{word}&nbsp;</React.Fragment>;
        }
      })}
    </>
  );
};

const SpecialText = ({ text }: { text: "hot" | "new" }) => {
  return (
    <>
      <span className={`special ${text} uppercase`}>{text}</span>&emsp;&emsp;
    </>
  );
};

const ShopDropdownMenu = ({ data }: Props) => {
  return data ? (
    <ul className="shop-dropdown hidden absolute top-[100%] bg-[white] px-[10px]">
      {data.map((item, index) => {
        return (
          <li
            className="px-[10px] py-[20px]"
            key={`shop-dropdown-${Math.random() * 10000 * index}`}
          >
            <h1 className="shop-menu-col-title mb-[8px] uppercase">
              {convertWordNotWrap(item.title)}
            </h1>
            <ul>
              {item.items.map((menuItem, index) => {
                return (
                  <li
                    className="shop-menu-col-item py-[4px] flex items-center"
                    key={`shop-menu-col-${Math.random() * 10000 * index}`}
                  >
                    <span className="text-menu-item">
                      {convertWordNotWrap(menuItem.text)}
                    </span>
                    {menuItem.special && (
                      <>
                        &nbsp;
                        <SpecialText text={menuItem.special} />
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  ) : (
    <></>
  );
};

export default ShopDropdownMenu;
