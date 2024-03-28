import { Badge, Select } from "antd";
import { SelectValue } from "antd/lib/select";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineMenu } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { BsCart, BsChevronDown } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { catchError, map, of } from "rxjs";
import Images from "src/assets/images";
import Container from "src/components/Container";
import LoginModal from "src/components/modal/LoginForm";
import XIcon from "src/components/XIcon";
import { useJob } from "src/core/hooks";
import { DataSelect } from "src/data/filter";
import { GetCartResponse } from "src/models/Carts";
import { ProductCategory } from "src/models/Product";
import { RootReducer } from "src/redux";
import cartModule from "src/redux/modules/cart";
import CartRepository from "src/repositories/CartRepository";
import CategoryRepository from "src/repositories/CategoryRepository";

type Props = {
  setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCartSideBar: React.Dispatch<React.SetStateAction<boolean>>;
};

const SecondRow = ({ setShowSideBar, setShowCartSideBar }: Props) => {
  const router = useRouter();
  const session = useSession();
  const { t } = useTranslation("layout");
  const [categoryData, setCategoryData] = useState<ProductCategory[]>([]);

  const dispatch = useDispatch();
  const cartRedux = useSelector((state: RootReducer) => state.cart);
  const { setCart } = cartModule.actions.creators;
  const [modalAuth, setModalAuth] = useState<boolean>(false);

  // Call API
  const {
    run: getListCategories,
    result,
    state,
  } = useJob(() => {
    return CategoryRepository.getListCategories().pipe(
      map((data) => {
        setCategoryData(data.data);
      })
    );
  });

  const { run: getCartApi } = useJob(() => {
    return CartRepository.get().pipe(
      map(({ data }: { data: GetCartResponse }) => {
        const cart: {
          productId: number;
          quantity: number;
          unitPrice: number;
        }[] = [];
        if (data) {
          data.cartItems.map((item) => {
            cart.push({
              productId: item.productId,
              quantity: item.productUomQty,
              unitPrice: item.priceUnit,
            });
          });
        }
        dispatch(setCart(cart));
      }),
      catchError((err) => {
        console.log("get cart", err);
        return of(err);
      })
    );
  });

  // const [categories, setCategories] = useState<DataSelect<number | null>[]>([]);

  // useMount(() => {
  //   getListCategories();
  // });

  // useDidUpdate(() => {
  //   if (state === JobState.Success && result) {
  //     console.log("result", result);
  //     const categoriesSelect: DataSelect<number | null>[] = [];

  //     result.forEach((category) => {
  //       if (category.parentId === null) {
  //         categoriesSelect.push({
  //           value: category.id,
  //           label: category.name,
  //         });
  //       }
  //     });

  //     setCategories(categoriesSelect);
  //   }
  // }, [state]);
  useEffect(() => {
    getListCategories();
    if (session.status === "authenticated") {
      getCartApi();
    }
  }, [session.status]);

  // Category selected
  const [category, setCategory] = useState<number | null>(() => {
    const categoriesSelect: DataSelect<number | null>[] = [];
    categoryData.map((cate) => {
      if (cate.parentId === null) {
        categoriesSelect.push({
          label: cate.name,
          value: cate.id,
        });
      }
    });
    if (router.query.category) {
      return Number.isInteger(Number(router.query.category))
        ? Number(router.query.category)
        : categoriesSelect[0]?.value;
    }
    return categoriesSelect[0]?.value;
  });

  const handleChangeCategory = useCallback((value: SelectValue) => {
    setCategory(value as number | null);
  }, []);

  const [searchText, setSearchText] = useState<string>("");

  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    []
  );

  const handleSearch = useCallback(() => {
    const search = searchText.trim().toLocaleLowerCase() || undefined;
    const page = search === undefined ? "1" : "";
    const cloneQuery = {
      ...router.query,
      search,
      category: category || "",
    } as ParsedUrlQuery & {
      search: string | string[] | undefined;
      category: string | string[] | undefined;
    };

    if (cloneQuery && !searchText) {
      delete cloneQuery.search;
    }

    router.push({
      pathname: "/products",
      query: {
        ...cloneQuery,
        page: page,
      },
    });
  }, [searchText, category, categoryData]);

  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.keyCode === 13 && handleSearch();
    },
    [handleSearch]
  );

  const handleClickSearch = useCallback(() => {
    handleSearch();
  }, [handleSearch]);

  useEffect(() => {
    if (router.query.search === "")
      setSearchText(router.query.search?.toString());
  }, [router.query.search]);

  return (
    <div className="second-row w-[100%] md:py-[34px] pb-[10px] pt-4">
      <Container className="flex items-center">
        <div
          className="menu-btn mlg:hidden cursor-pointer"
          onClick={() => setShowSideBar(true)}
        >
          <AiOutlineMenu className="text-[#067fc2]" fontSize={28} />
        </div>
        <div className="logo-and-search sm:mr-[16px] flex items-center flex-1 xs:justify-center sm:justify-start">
          <div
            className="logo mx-[14px] mlg:ml-0 flex items-center cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            {/* <Image
              src={Images.logo.pageWolmartLogoPC}
              width={144}
              height={45}
              objectFit="contain"
            /> */}
          </div>
          <div className="search-group hidden sm:hidden md:flex flex-1 h-[100%] min-w-auto max-w-[720px] pl-[10px] mx-auto border-[2px] border-hover-color border-solid rounded-lg">
            <Select
              className="filter-select w-[144px]"
              // value={category || undefined}
              placeholder={t("layout:categories")}
              suffixIcon={<BsChevronDown className="ml-[4px]" fontSize={8} />}
              // options={categories}
              onChange={handleChangeCategory}
              style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                fontSize: "13px",
              }}
            >
              <Select.Option value="">{t("layout:categories")}</Select.Option>
              {categoryData.map((cate) => {
                if (cate.parentId === null) {
                  return (
                    <Select.Option value={cate.id} key={cate.id}>
                      {cate.name}
                    </Select.Option>
                  );
                }
              })}
              {/* <Select.Option value={t("layout:allCategories")}>
                {t("layout:allCategories")}
              </Select.Option>
              <Select.Option value="Fashion">Fashion</Select.Option> */}
            </Select>
            <div className="search-bar w-[100%] flex items-center">
              <input
                className="search-input h-[100%] w-[100%] px-[12px]"
                value={searchText}
                onChange={handleSearchInput}
                onKeyUp={handleEnter}
                type="text"
                placeholder={t("layout:searchOnTii")}
              />
              <div
                className="sm:w-[40px] md:w-[155px] h-[100%] py-2 flex items-center justify-center gap-2 bg-[#2275e2] text-white rounded sm:text-sm hover:opacity-80 cursor-pointer"
                onClick={handleClickSearch}
              >
                <span>
                  <BiSearchAlt fontSize={24} />
                </span>
                <span className="md:block hidden">{t("layout:search")}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-and-btn xs:hidden mlg:flex items-center">
          {/* Show cart */}
          <div
            className="btn mr-[80px]"
            onClick={() => {
              if (session.status === "authenticated") {
                setShowCartSideBar(true);
                getCartApi();
              } else
                router.push({
                  pathname: "/auth/login",
                });
              // else setModalAuth(true);
            }}
          >
            <Badge
              className="hover"
              count={cartRedux && cartRedux.length > 0 ? cartRedux.length : 0}
            >
              <BsCart className="btn-icon" fontSize={30} />
            </Badge>
            <span className="mt-1">{t("layout:cart")}</span>
          </div>
          <div className="banner-promotion">
            <Image
              src={Images.banner.bannerPromotion}
              width={188}
              height={45}
            />
          </div>
        </div>
        {/* <div className="contact-and-btn xs:hidden mlg:flex items-center">
          <div className="contact flex pr-[24px]">
            <IoCallOutline className="call-icon mx-[8px]" fontSize={32} />
            <div className="chat-or-call flex flex-col">
              <p className="live-chat text-[12px] leading-[12px] mb-[2px] h-fit">
                <span className="hover:text-hover-color hover:cursor-pointer font-normal">
                  Live Chat
                </span>
                <span className="text-[#999]"> or:</span>
              </p>
              <p className="call m-0">0(800)123-456</p>
            </div>
          </div>
          <div className="right-side pl-[24px] flex">
            <div className="btn">
              <AiOutlineHeart className="btn-icon" fontSize={30} />
              <span>Wishlist</span>
            </div>
            <div className="btn">
              <FaBalanceScale className="btn-icon" fontSize={30} />
              <span>Compare</span>
            </div>
            <div className="btn" onClick={() => setShowCartSideBar(true)}>
              <BsCart className="btn-icon" fontSize={30} />
              <span>Cart</span>
            </div>
          </div>
        </div> */}

        <div className="contact-and-btn xs:flex mlg:hidden items-center mr-2">
          {/* <IoCallOutline
            className="btn-icon-tablet xs:hidden sm:block mx-[8px]"
            fontSize={30}
          />
          <AiOutlineHeart
            className="btn-icon-tablet xs:hidden sm:block mx-[8px]"
            fontSize={30}
          />
          <FaBalanceScale
            className="btn-icon-tablet xs:hidden sm:block mx-[8px]"
            fontSize={30}
          /> */}
          <div
            className="btn"
            onClick={() => {
              if (session.status === "authenticated") {
                setShowCartSideBar(true);
                getCartApi();
              } else
                router.push({
                  pathname: "/auth/login",
                });
              // else setModalAuth(true);
            }}
          >
            <Badge
              count={cartRedux && cartRedux.length > 0 ? cartRedux.length : 0}
              size="small"
            >
              <BsCart
                className="btn-icon-tablet text-[#067fc2]"
                fontSize={24}
              />
            </Badge>
          </div>
        </div>
      </Container>
      <div className="search-group mt-5 mx-4 xs:flex md:hidden h-[100%] min-w-auto max-w-[720px] pl-[12px] bg-gray-100 border-solid rounded-lg">
        <div className="search-bar w-[100%] h-[40px] flex items-center text-gray-500">
          <span>
            <BiSearchAlt fontSize={24} onClick={handleClickSearch} />
          </span>
          <input
            className="search-input h-[100%] w-[100%] px-[12px] bg-gray-100 rounded-lg"
            value={searchText}
            onChange={handleSearchInput}
            onKeyUp={handleEnter}
            type="text"
            placeholder={t("layout:searchOnTii")}
          />
        </div>
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

export default SecondRow;
