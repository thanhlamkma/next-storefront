import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Images from "src/assets/images";
import { ProductCategory2 } from "src/models/Product";
import { Swiper, SwiperSlide } from "swiper/react";

interface CategoryProps {
  categoryData: ProductCategory2[] | [];
}

const listCategory: Array<{ name: string; image: string }> = [
  { name: "products:sports", image: Images.category.sport },
  { name: "products:babies", image: Images.category.babies },
  { name: "products:sneakers", image: Images.category.sneakers },
  { name: "products:cameras", image: Images.category.cameras },
  { name: "products:games", image: Images.category.games },
  { name: "products:kitchen", image: Images.category.kitchen },
  { name: "products:watches", image: Images.category.watches },
  { name: "products:clothes", image: Images.category.clothes },
];

const Category = ({ categoryData }: CategoryProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [cateParent, setCateParent] = useState<ProductCategory2[]>(() => {
    const parent: ProductCategory2[] = [];
    categoryData.map((item) => {
      if (item.parentId === null) {
        parent.push(item);
      }
    });
    return parent;
  });

  const cateId = Number(router.query.category);

  const dataCategory = useMemo(() => {
    const options = listCategory.map((x) => ({ ...x, name: t(x.name) }));
    return options;
  }, [listCategory]);

  const handleRedirectProduct = useCallback((categoryId: number) => {
    router.push(
      router.basePath +
        `/products?category=${categoryId}&page=1&limit=9&sort=default`
    );
  }, []);

  return (
    <div id="category">
      <div className="title-common">
        <span>{t("products:catalogs")}</span>
      </div>
      <Swiper
        spaceBetween={8}
        breakpoints={{
          300: {
            slidesPerView: 3,
          },
          576: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
          1280: {
            slidesPerView: 7,
          },
        }}
        // slidesPerView={7}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        pagination={{ clickable: true }}
      >
        {cateParent.map((category) => (
          <SwiperSlide key={category.name}>
            <div
              className={`cursor-pointer category-item category-item-custom hover:bg-[#336699] ${
                cateId === category.id ? "bg-[#336699]" : ""
              }`}
              onClick={() => handleRedirectProduct(category.id)}
            >
              {/* <div className="item-media flex justify-center hover:scale-110 p-5">
                <img
                  className="rounded-[50%] md:w-[120px] md:h-[120px] w-[60px] h-[60px]"
                  src={category.image}
                />
              </div> */}
              <h4
                className={`md:text-base text-xs text-center md:font-bold font-semibold capitalize truncate-h hover:text-white ${
                  cateId === category.id ? "text-white" : ""
                }`}
                data-line="1"
              >
                {category.name}
              </h4>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Category;
