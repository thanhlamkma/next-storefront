import { Col, Divider, Row } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineRight } from "react-icons/ai";
import { catchError, map, of } from "rxjs";
import {
  CategoriesSubMenuType,
  SubMenuCategoriesImages,
} from "src/components/layout/Header/ThirdRow/mockData";
import { convertWordNotWrap } from "src/components/layout/Header/ThirdRow/ShopDropdownMenu";
import { useJob } from "src/core/hooks";
import { ProductCategory2 } from "src/models/Product";
import CategoryRepository from "src/repositories/CategoryRepository";

// Merge custom class name with default class name of component
const genCustomClassname = (className: string, customClassname?: string) => {
  return `${className} ${customClassname || ""}`;
};

// Short hand HTML Element Props
type UlType = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;

type LiType = React.DetailedHTMLProps<
  React.LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
>;

type H1Type = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

// Component to reuse
const CategoriesComponent = {
  CategoriesMenuContainer: ({ children, className, ...props }: UlType) => (
    <ul
      className={genCustomClassname(
        "categories-sub-menu hidden absolute top-[0] left-[100%] pl-[24px] bg-white z-10",
        className
      )}
      {...props}
    >
      {children}
    </ul>
  ),

  CategoriesDropdownMenuItem: ({ children, className, ...props }: LiType) => (
    <li
      className={genCustomClassname(
        "py-[20px] pr-[16px] category-dropdown-menu-item",
        className
      )}
      {...props}
    >
      {children}
    </li>
  ),

  TitleCategoriesSubMenu: ({ children, className, ...props }: H1Type) => (
    <h1
      className={genCustomClassname(
        "title-categories-sub-menu font-semibold text-[14px] uppercase pb-[8px] mb-[12px]",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  ),
  MenuSubMenuCategories: ({ children, className, ...props }: UlType) => (
    <ul
      className={genCustomClassname("menu-sub-menu-categories", className)}
      {...props}
    >
      {children}
    </ul>
  ),

  ItemSubMenuCategories: ({ children, className, ...props }: LiType) => (
    <li
      className={genCustomClassname(
        "item-sub-menu-categories py-[6px] text-menu-item",
        className
      )}
      {...props}
    >
      {children}
    </li>
  ),
};

// Drop down sub menu Component  type 1
const CategoriesSubMenuComponent = ({
  item,

  ...props
}: {
  item: CategoriesSubMenuType;
} & LiType) => {
  return (
    <CategoriesComponent.CategoriesDropdownMenuItem {...props}>
      <CategoriesComponent.TitleCategoriesSubMenu>
        {item.title}
      </CategoriesComponent.TitleCategoriesSubMenu>
      <CategoriesComponent.MenuSubMenuCategories>
        {item.items.map((subItem, index) => {
          return (
            <CategoriesComponent.ItemSubMenuCategories
              key={`${item.title}-${subItem}-${Math.random() * 10000 * index}`}
            >
              {convertWordNotWrap(subItem, 3)}
            </CategoriesComponent.ItemSubMenuCategories>
          );
        })}
      </CategoriesComponent.MenuSubMenuCategories>
    </CategoriesComponent.CategoriesDropdownMenuItem>
  );
};

const CategoriesSubMenuComponentType2 = ({
  item,
  isTablet,
  ...props
}: {
  item: CategoriesSubMenuType;
  isTablet?: boolean;
} & LiType) => {
  return (
    <CategoriesComponent.CategoriesDropdownMenuItem {...props}>
      <CategoriesComponent.TitleCategoriesSubMenu>
        {convertWordNotWrap(item.title)}
      </CategoriesComponent.TitleCategoriesSubMenu>
      <CategoriesComponent.MenuSubMenuCategories>
        {item.items.map((subItem, index) => {
          return (
            <CategoriesComponent.ItemSubMenuCategories
              key={`${item.title}-${subItem}-${Math.random() * 10000 * index}`}
            >
              {isTablet ? subItem : convertWordNotWrap(subItem, 3)}
            </CategoriesComponent.ItemSubMenuCategories>
          );
        })}
      </CategoriesComponent.MenuSubMenuCategories>
    </CategoriesComponent.CategoriesDropdownMenuItem>
  );
};

// Items Categories Component
type ItemCategoriesProps = {
  cateParent: CategoryParent;
  cateChild1?: CategoryChild[];
  cateChild2?: CategoryChild[];
};

const ItemCategories: React.FC<ItemCategoriesProps> = ({
  cateParent,
  cateChild1,
  cateChild2,
}) => {
  return cateParent ? (
    <li className="relative item-categories-wrapper w-[100%] flex px-[8px]">
      <ul className="item-categories w-[100%] p-[14px] flex justify-between items-center">
        <span className="text-[14px] leading-[14px] ml-[8px] normal-case font-normal">
          {cateParent.name}
        </span>
        {cateChild1 && <AiOutlineRight fontSize={12} />}
        {cateChild1?.map((item) => (
          <li>{item.name}</li>
        ))}
      </ul>
    </li>
  ) : (
    <></>
  );
};

// const ItemCategories: React.FC<ItemCategoriesProps> = ({
//   item,
//   item2,
//   items3,
//   type,
// }) => {
//   // const Logo = item?.title ? genLogo[item.title] : undefined;
//   // const handleHoverCategories = useCallback(
//   //   (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
//   //     const a = e.currentTarget as HTMLElement;
//   //     const b = a.querySelector(".categories-sub-menu");
//   //     if (b) {
//   //       b.classList.add("flex");
//   //       b.classList.remove("hidden");
//   //     }
//   //   },
//   //   []
//   // );

//   // const handleUnHoverCategories = useCallback(
//   //   (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
//   //     const a = e.currentTarget as HTMLElement;
//   //     const b = a.querySelector(".categories-sub-menu");
//   //     if (b) {
//   //       b.classList.add("hidden");
//   //       b.classList.remove("flex");
//   //     }
//   //   },
//   //   []
//   // );

//   return item2 ? (
//     <li
//       className="relative item-categories-wrapper w-[100%] flex px-[8px]"
//       // onMouseEnter={handleHoverCategories}
//       // onMouseLeave={handleUnHoverCategories}
//     >
//       <span className="item-categories w-[100%] p-[14px] flex justify-between items-center">
//         <span className="flex items-center">
//           {/* {Logo && <Logo fontSize={20} />} */}
//           <span className="text-[14px] leading-[14px] ml-[8px] normal-case font-normal">
//             {item2?.name}
//           </span>
//         </span>
//         {items3 && <AiOutlineRight fontSize={12} />}
//       </span>
//       {/* {type !== 2 ? (
//         <CategoriesDropdownSubMenu
//           // img={item.image as SubMenuCategoriesImages}
//           col={2}
//           items2={items3}
//         />
//       ) : (
//         <CategoriesDropdownSubMenuType2 items2={[item2]} />
//       )} */}
//     </li>
//   ) : (
//     <></>
//   );
// };

type CategoriesDropdownSubMenuProps = {
  items?: Array<CategoriesSubMenuType>;
  items2?: Array<ProductCategory2>;
  col?: 2 | 4;
  img?: SubMenuCategoriesImages;
} & UlType;

const CategoriesDropdownSubMenu = ({
  items,
  col,
  img,
}: CategoriesDropdownSubMenuProps) => {
  const cluster1 =
    items && col === 2 ? items.filter((item, index) => index % 2 === 0) : items;
  const cluster2 =
    items && col === 2
      ? items.filter((item, index) => index % 2 !== 0)
      : undefined;

  return items ? (
    <CategoriesComponent.CategoriesMenuContainer>
      {[cluster1, cluster2].map((cluster, i) => {
        return cluster ? (
          <div className={`${col !== 2 ? "flex" : ""}`}>
            {cluster.map((item, index) => {
              return (
                item.items && (
                  <CategoriesSubMenuComponent
                    item={item}
                    key={`sub-category-${item.title}-${i}-${index}`}
                  />
                )
              );
            })}
          </div>
        ) : (
          <React.Fragment key={`sub-categories-${i}`}></React.Fragment>
        );
      })}
      {img && (
        <div className="img-area w-[235px] ">
          <Image
            src={img.src}
            width={img.size.width}
            height={img.size.height}
            layout="responsive"
            objectFit="cover"
          />
        </div>
      )}
    </CategoriesComponent.CategoriesMenuContainer>
  ) : (
    <></>
  );
};

type CategoriesDropdownSubMenuType2Type = {
  items?: Array<CategoriesSubMenuType>;
  items2?: Array<ProductCategory2>;
  img?: Array<SubMenuCategoriesImages>;
} & UlType;

const CategoriesDropdownSubMenuType2 = ({
  items,
  items2,
  img,
}: CategoriesDropdownSubMenuType2Type) => {
  const cluster1 = items && items.slice(0, 2);
  const cluster2 = items && items.slice(2);

  const [isTablet, setIsTablet] = useState<boolean>(false);
  const checkSizeTablet = useCallback(() => {
    setIsTablet(window.innerWidth < 1200);
  }, []);
  useEffect(() => {
    checkSizeTablet();
    window.addEventListener("resize", checkSizeTablet);

    return () => {
      window.removeEventListener("resize", checkSizeTablet);
    };
  }, []);

  return cluster1 && cluster2 ? (
    <CategoriesComponent.CategoriesMenuContainer>
      {[cluster1, cluster2].map((cluster, index) => {
        return (
          <div
            className="flex flex-col justify-between"
            key={`type2-sub-menu-${index}`}
          >
            <div className="type2-sub-menu-text flex">
              {cluster.map((item, index) => {
                return (
                  item.items && (
                    <CategoriesSubMenuComponentType2
                      className={`${isTablet ? "w-[170px]" : ""}`}
                      isTablet={isTablet}
                      item={item}
                      key={`category-${item.title}-${Math.random() * 1000}`}
                    />
                  )
                );
              })}
            </div>
            <div
              className={`type2-sub-menu-img w-[100%] ${
                isTablet ? "h-[96px]" : "flex-1"
              }`}
            >
              {img && (
                <Image
                  className="w-[90%] rounded-4px"
                  src={img[index].src}
                  width={img[index].size.width}
                  height={img[index].size.height}
                  layout="responsive"
                  objectFit="cover"
                />
              )}
            </div>
          </div>
        );
      })}
    </CategoriesComponent.CategoriesMenuContainer>
  ) : (
    <></>
  );
};

type CategoriesDropdownMenuProps = {};

type CategoryParent = {
  id: number;
  name: string;
};

type CategoryChild = {
  id: number;
  name: string;
  parentId: number | null;
};

const CategoriesDropdownMenu = (props: CategoriesDropdownMenuProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [cateParent, setCateParent] = useState<CategoryParent[]>([]);
  const [cateChild1, setCateChild1] = useState<CategoryChild[]>([]);
  const [cateChild2, setCateChild2] = useState<CategoryChild[]>([]);

  // Call API
  const { run: getListCategory } = useJob(() => {
    return CategoryRepository.get().pipe(
      map(({ data }: { data: ProductCategory2[] }) => {
        const tempCateParent: CategoryParent[] = [];
        const tempCateChild1: CategoryChild[] = [];
        const tempCateChild2: CategoryChild[] = [];
        data.map((item) => {
          if (item.parentId === null) {
            tempCateParent.push({
              id: item.id,
              name: item.name,
            });
          }
        });
        setCateParent(tempCateParent);

        tempCateParent.map((cate) => {
          data.map((item) => {
            var arrLen = item.parentPath.split("/");
            if (arrLen.length === 3 && cate.id === Number(arrLen[0])) {
              tempCateChild1.push({
                id: item.id,
                name: item.name,
                parentId: item.parentId,
              });
            }
          });
        });
        setCateChild1(tempCateChild1);

        tempCateChild1.map((cate) => {
          data.map((item) => {
            var arrLen = item.parentPath.split("/");
            if (arrLen.length === 4 && cate.id === Number(arrLen[1])) {
              tempCateChild2.push({
                id: item.id,
                name: item.name,
                parentId: item.parentId,
              });
            }
          });
        });
        setCateChild2(tempCateChild2);
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

  return (
    <ul className="categories-drop-down hidden w-[100%] flex-col py-[6px] absolute top-[100%] left-0 ">
      {/* {categories.map((category, index, arr) => {
        return (
          <ItemCategories
            key={`${index}-categories-${category.title}`}
            item={category}
            type={index === 3 ? 2 : 1}
          />
        );
      })} */}
      {cateParent?.map((cate, index) => {
        var tempCateChild1 = cateChild1.filter(
          (item) => item.parentId === cate.id
        );
        return (
          <li className="parent px-[14px] py-[6px]" key={`parent-${cate.id}`}>
            <span
              className="w-[100%] flex items-center justify-between"
              onClick={() => handleRedirectCategory(cate.id)}
            >
              <span className="font-medium">{cate.name}</span>
              {tempCateChild1.length > 0 && (
                <AiOutlineRight className="icon" fontSize={12} />
              )}
            </span>
            <Divider
              className={`mt-3 mb-0 w-[100%] ${
                index === cateParent.length - 1 ? "hidden" : ""
              }`}
            />
            {tempCateChild1.length > 0 ? (
              <ul className={`child ${tempCateChild1.length === 1 ? 'w-[70%]' : 'w-[140%]'}`}>
                <Row gutter={[10, 20]}>
                  {tempCateChild1.map((child1) => (
                    <Col span={tempCateChild1.length === 1 ? 24 : 12} key={`child-1-${child1.id}`}>
                      <span
                        className="font-semibold text-base"
                        onClick={() => handleRedirectCategory(child1.id)}
                      >
                        {child1.name}
                      </span>
                      <Divider className="my-2" />
                      <ul>
                        {cateChild2.map((child2) => {
                          if (child2.parentId === child1.id) {
                            return (
                              <li
                                className="pt-2"
                                key={`child-2-${child2.id}`}
                                onClick={() =>
                                  handleRedirectCategory(child2.id)
                                }
                              >
                                {child2.name}
                              </li>
                            );
                          }
                        })}
                      </ul>
                    </Col>
                  ))}
                </Row>
              </ul>
            ) : (
              ""
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default CategoriesDropdownMenu;
