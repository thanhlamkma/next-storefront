const Images = {
  get commingSoon() {
    return new URL("./images/coming-soon.png", import.meta.url).href;
  },
  get errors() {
    return {
      get accessDenied() {
        return new URL("./images/access_denied.svg", import.meta.url).href;
      },
      get default() {
        return new URL("./images/error.svg", import.meta.url).href;
      },
      get notFound() {
        return new URL("./images/404.svg", import.meta.url).href;
      },
      get errorImage() {
        return new URL("./images/error-img.svg", import.meta.url).href;
      },
      get failData() {
        return new URL("./images/mascot_fail.svg", import.meta.url).href;
      },
    };
  },

  get logo() {
    return {
      get pageWolmartLogoPC() {
        return new URL("./images/logo(PCandtablet).svg", import.meta.url).href;
      },
      get pageWolmartLogoSmartphone() {
        return new URL("./images/logo(smartphone).svg", import.meta.url).href;
      },

      get paymentLogo() {
        return new URL("./images/payment.png", import.meta.url).href;
      },
      get shippingWayLogo() {
        return {
          get tikiFast() {
            return new URL(
              "./images/tiki-shipping-way-logo.png",
              import.meta.url
            ).href;
          },
          get tikiNow() {
            return new URL("./images/tiki-now.png", import.meta.url).href;
          },
        };
      },
      get bankLogo() {
        return {
          get eximbankLogo() {
            return new URL(
              "./images/logo/bank/eximbank-logo.png",
              import.meta.url
            ).href;
          },
          get mastercardLogo() {
            return new URL(
              "./images/logo/bank/mastercard-logo.jpg",
              import.meta.url
            ).href;
          },
          get scbLogo() {
            return new URL("./images/logo/bank/scb-logo.png", import.meta.url)
              .href;
          },
          get techLogo() {
            return new URL("./images/logo/bank/tech-logo.png", import.meta.url)
              .href;
          },
          get vibLogo() {
            return new URL("./images/logo/bank/vib-logo.png", import.meta.url)
              .href;
          },
          get vietcombankLogo() {
            return new URL(
              "./images/logo/bank/vietcombank-logo.png",
              import.meta.url
            ).href;
          },
          get cityLogo() {
            return new URL("./images/logo/bank/city-logo.png", import.meta.url)
              .href;
          },
        };
      },

      get brandLogo() {
        return {
          get BrandLogo1() {
            return new URL(
              `./images/logo/brand/brand-logo1.png`,
              import.meta.url
            ).href;
          },
          get BrandLogo2() {
            return new URL(
              `./images/logo/brand/brand-logo2.png`,
              import.meta.url
            ).href;
          },
          get BrandLogo3() {
            return new URL(
              `./images/logo/brand/brand-logo3.png`,
              import.meta.url
            ).href;
          },
          get BrandLogo4() {
            return new URL(
              `./images/logo/brand/brand-logo4.png`,
              import.meta.url
            ).href;
          },
          get BrandLogo5() {
            return new URL(
              `./images/logo/brand/brand-logo5.png`,
              import.meta.url
            ).href;
          },
          get BrandLogo6() {
            return new URL(
              `./images/logo/brand/brand-logo6.png`,
              import.meta.url
            ).href;
          },
          get BrandLogo7() {
            return new URL(
              `./images/logo/brand/brand-logo7.png`,
              import.meta.url
            ).href;
          },
          get BrandLogo8() {
            return new URL(
              `./images/logo/brand/brand-logo8.png`,
              import.meta.url
            ).href;
          },
          get BrandLogo9() {
            return new URL(
              `./images/logo/brand/brand-logo9.png`,
              import.meta.url
            ).href;
          },
          get BrandLogo10() {
            return new URL(
              `./images/logo/brand/brand-logo10.png`,
              import.meta.url
            ).href;
          },
          get BrandLogo11() {
            return new URL(
              `./images/logo/brand/brand-logo11.png`,
              import.meta.url
            ).href;
          },
          get BrandLogo12() {
            return new URL(
              `./images/logo/brand/brand-logo12.png`,
              import.meta.url
            ).href;
          },
        };
      },
    };
  },

  get partner() {
    return {
      get drnutri() {
        return new URL("./images/partner/drnutri.svg", import.meta.url).href;
      },
      get purecle() {
        return new URL("./images/partner/pureclé.svg", import.meta.url).href;
      },
      get lotte() {
        return new URL("./images/partner/lotte.svg", import.meta.url).href;
      },
      get jenkit() {
        return new URL("./images/partner/jenkit.svg", import.meta.url).href;
      },
      get kuchen() {
        return new URL("./images/partner/kuchen.svg", import.meta.url).href;
      },
      get lacsell() {
        return new URL("./images/partner/lacsell.svg", import.meta.url).href;
      },
      get samsung() {
        return new URL("./images/partner/samsung.svg", import.meta.url).href;
      },
      get oaio() {
        return new URL("./images/partner/oaio.png", import.meta.url).href;
      },
    };
  },

  get banner() {
    return {
      get banner1() {
        return new URL("./images/banner/banner1.png", import.meta.url).href;
      },
      get banner1Tablet() {
        return new URL("./images/banner/banner1-tablet.jpg", import.meta.url)
          .href;
      },
      get banner1Mobile() {
        return new URL("./images/banner/banner1-mobile.jpg", import.meta.url)
          .href;
      },
      get banner2() {
        return new URL("./images/banner/banner-2.jpg", import.meta.url).href;
      },
      get banner3() {
        return new URL("./images/banner/banner-3.jpg", import.meta.url).href;
      },
      get banner4() {
        return new URL("./images/banner/banner-4.jpg", import.meta.url).href;
      },
      get banner5() {
        return new URL("./images/banner/banner-5.jpg", import.meta.url).href;
      },
      get banner6() {
        return new URL("./images/banner/banner-6.jpg", import.meta.url).href;
      },
      get bannerVendor() {
        return new URL("./images/banner/vendor-banner.jpg", import.meta.url)
          .href;
      },
      get bds() {
        return new URL("./images/banner/banner_bds.jpg", import.meta.url).href;
      },
      get bannerAds1() {
        return new URL("./images/banner/banner_ads_1.jpg", import.meta.url)
          .href;
      },
      get bannerAds2() {
        return new URL("./images/banner/banner_ads_2.jpg", import.meta.url)
          .href;
      },
      get bannerAds3() {
        return new URL("./images/banner/banner_ads_3.jpg", import.meta.url)
          .href;
      },
      get bannerTop() {
        return new URL("./images/banner/banner-top.png", import.meta.url).href;
      },
      get bannerPromotion() {
        return new URL("./images/banner/banner-promotion.png", import.meta.url)
          .href;
      },
    };
  },

  get category() {
    return {
      get babies() {
        return new URL("./images/category/babies.jpg", import.meta.url).href;
      },
      get cameras() {
        return new URL("./images/category/cameras.jpg", import.meta.url).href;
      },
      get clothes() {
        return new URL("./images/category/clothes.jpg", import.meta.url).href;
      },
      get games() {
        return new URL("./images/category/games.jpg", import.meta.url).href;
      },
      get kitchen() {
        return new URL("./images/category/kitchen.jpg", import.meta.url).href;
      },
      get sneakers() {
        return new URL("./images/category/sneakers.jpg", import.meta.url).href;
      },
      get sport() {
        return new URL("./images/category/sport.jpg", import.meta.url).href;
      },
      get watches() {
        return new URL("./images/category/watches.jpg", import.meta.url).href;
      },
      get shirt() {
        return new URL("./images/category/shirt.jpg", import.meta.url).href;
      },
      get sofa() {
        return new URL("./images/category/sofa.jpg", import.meta.url).href;
      },
      get shoes() {
        return new URL("./images/category/shoes.jpg", import.meta.url).href;
      },
      get psGame() {
        return new URL("./images/category/ps-game.jpg", import.meta.url).href;
      },
      get lap() {
        return new URL("./images/category/lap.jpg", import.meta.url).href;
      },
      get dumbbell() {
        return new URL("./images/category/dumbbell.jpg", import.meta.url).href;
      },
    };
  },

  get product() {
    return {
      get test() {
        return new URL("./images/products/new/Amilac.png", import.meta.url)
          .href;
      },
      get bag() {
        return new URL("./images/products/bag.jpg", import.meta.url).href;
      },
      get bagGray() {
        return new URL("./images/products/balo_xam.jpg", import.meta.url).href;
      },
      get baglo() {
        return new URL("./images/products/balo.jpg", import.meta.url).href;
      },
      get clock() {
        return new URL("./images/products/clock.jpg", import.meta.url).href;
      },
      get bodyCare() {
        return new URL("./images/products/hop_phan.jpg", import.meta.url).href;
      },
      get iWatch() {
        return new URL("./images/products/i_watch.jpg", import.meta.url).href;
      },
      get alarm() {
        return new URL("./images/products/loa.jpg", import.meta.url).href;
      },
      get macbook() {
        return new URL("./images/products/macbook.jpg", import.meta.url).href;
      },
      get moto() {
        return new URL("./images/products/moto.jpg", import.meta.url).href;
      },
      get phone() {
        return new URL("./images/products/phone.jpg", import.meta.url).href;
      },
      get tivi() {
        return new URL("./images/products/tivi.jpg", import.meta.url).href;
      },

      get product1() {
        return new URL("./images/products/product-1.jpg", import.meta.url).href;
      },
      get product2() {
        return new URL("./images/products/product-2.jpg", import.meta.url).href;
      },
      get cartProduct12() {
        return new URL("./images/products/cart-product-12.jpg", import.meta.url)
          .href;
      },
      get cartProduct13() {
        return new URL("./images/products/cart-product-13.jpg", import.meta.url)
          .href;
      },
      get noProductFound() {
        return new URL(
          "./images/products/no-product-found.png",
          import.meta.url
        ).href;
      },
      get noProductImg() {
        return new URL("./images/products/no-product-img.png", import.meta.url)
          .href;
      },

      get recentProduct() {
        return {
          get product1() {
            return new URL(
              "./images/products/recent/product-recent-1.jpg",
              import.meta.url
            ).href;
          },
          get product2() {
            return new URL(
              "./images/products/recent/product-recent-2.jpg",
              import.meta.url
            ).href;
          },
          get product3() {
            return new URL(
              "./images/products/recent/product-recent-3.jpg",
              import.meta.url
            ).href;
          },
          get product4() {
            return new URL(
              "./images/products/recent/product-recent-4.jpg",
              import.meta.url
            ).href;
          },
          get product5() {
            return new URL(
              "./images/products/recent/product-recent-5.jpg",
              import.meta.url
            ).href;
          },
          get product6() {
            return new URL(
              "./images/products/recent/product-recent-6.jpg",
              import.meta.url
            ).href;
          },
          get product7() {
            return new URL(
              "./images/products/recent/product-recent-7.jpg",
              import.meta.url
            ).href;
          },
          get product8() {
            return new URL(
              "./images/products/recent/product-recent-8.jpg",
              import.meta.url
            ).href;
          },
        };
      },
    };
  },

  get icons() {
    return {
      get iconHeader() {
        return new URL("./images/icons/icon-header.png", import.meta.url).href;
      },
      get engFlag() {
        return new URL("./images/icons/eng.png", import.meta.url).href;
      },
      get fraFlag() {
        return new URL("./images/icons/fra.png", import.meta.url).href;
      },
      get viFlag() {
        return new URL("./images/icons/vietnamFlag.svg", import.meta.url).href;
      },
      get isSaved() {
        return new URL("./images/saved.svg", import.meta.url).href;
      },
      get paymentIcon() {
        return {
          get codPaymentMethodIcon() {
            return new URL(
              "./images/icons/payment/icon-payment-method-cod.svg",
              import.meta.url
            ).href;
          },
          get creditPaymentMethodIcon() {
            return new URL(
              "./images/icons/payment/icon-payment-method-credit.svg",
              import.meta.url
            ).href;
          },
          get momoPaymentMethodIcon() {
            return new URL(
              "./images/icons/payment/icon-payment-method-momo.svg",
              import.meta.url
            ).href;
          },
          get viettelPaymentMethodIcon() {
            return new URL(
              "./images/icons/payment/icon-payment-method-viettelmoney.png",
              import.meta.url
            ).href;
          },
          get vnpayPaymentMethodIcon() {
            return new URL(
              "./images/icons/payment/icon-payment-method-vnpay.png",
              import.meta.url
            ).href;
          },
          get zalopayPaymentMethodIcon() {
            return new URL(
              "./images/icons/payment/icon-payment-method-zalopay.svg",
              import.meta.url
            ).href;
          },
          get atmPaymentIcon() {
            return new URL(
              "./images/icons/payment/icon-payment-method-atm.svg",
              import.meta.url
            ).href;
          },
          get tikiPaymentIcon() {
            return new URL(
              "./images/icons/payment/icon-payment-tiki.svg",
              import.meta.url
            ).href;
          },
          get visaPaymentIcon() {
            return new URL(
              "./images/icons/payment/icon-payment-visa.png",
              import.meta.url
            ).href;
          },
          get masterCardPaymentIcon() {
            return new URL(
              "./images/icons/payment/icon-payment-master-card.svg",
              import.meta.url
            ).href;
          },
          get typeJobPaymentIcon() {
            return new URL(
              "./images/icons/payment/icon-payment-type-job.svg",
              import.meta.url
            ).href;
          },
          get dealsIcon() {
            return new URL(
              "./images/icons/payment/icon-deals.svg",
              import.meta.url
            ).href;
          },
        };
      },
      get MenuIcons() {
        return {
          get doiSong() {
            return new URL("./images/icons/menu/doi-song.svg", import.meta.url)
              .href;
          },
          get dongHo() {
            return new URL("./images/icons/menu/dong-ho.svg", import.meta.url)
              .href;
          },
          get sacDep() {
            return new URL("./images/icons/menu/sac-dep.svg", import.meta.url)
              .href;
          },
          get sucKhoe() {
            return new URL("./images/icons/menu/suc-khoe.svg", import.meta.url)
              .href;
          },
          get thietBiGiaDung() {
            return new URL(
              "./images/icons/menu/thiet-bi-dien-gia-dung.svg",
              import.meta.url
            ).href;
          },
          get thietBiDienTu() {
            return new URL(
              "./images/icons/menu/thiet-bi-dien-tu.svg",
              import.meta.url
            ).href;
          },
          get thoiTrangMeVaBe() {
            return new URL(
              "./images/icons/menu/thoi-trang-me-va-be.svg",
              import.meta.url
            ).href;
          },
          get thucPhamBoSung() {
            return new URL(
              "./images/icons/menu/thuc-pham-bo-sung.svg",
              import.meta.url
            ).href;
          },
        };
      },
    };
  },

  get watch() {
    return {
      get watchFront() {
        return new URL("./images/products/watch_front.jpg", import.meta.url)
          .href;
      },
      get watchBehind() {
        return new URL("./images/products/watch_behind.jpg", import.meta.url)
          .href;
      },
      get watchBeside() {
        return new URL("./images/products/watch_beside.jpg", import.meta.url)
          .href;
      },
      get watchAbove() {
        return new URL("./images/products/watch_above.jpg", import.meta.url)
          .href;
      },
    };
  },

  get productVideo() {
    return {
      get image() {
        return new URL(
          "./images/video_product/video-banner-610x300.jpg",
          import.meta.url
        ).href;
      },
      get video() {
        return new URL(
          "./images/video_product/memory-of-a-woman.mp4",
          import.meta.url
        ).href;
      },
    };
  },

  get avatar() {
    return new URL("./images/person/default_avatar.png", import.meta.url).href;
  },

  get slideLanding() {
    return {
      get background() {
        return new URL(
          "./images/slide_landing/slide-background.jpg",
          import.meta.url
        ).href;
      },
    };
  },

  get outBlog() {
    return {
      get blog1() {
        return new URL("./images/blog/blog-1.jpg", import.meta.url).href;
      },
      get blog2() {
        return new URL("./images/blog/blog-2.jpg", import.meta.url).href;
      },
      get blog3() {
        return new URL("./images/blog/blog-3.jpg", import.meta.url).href;
      },
      get blog4() {
        return new URL("./images/blog/blog-4.jpg", import.meta.url).href;
      },
    };
  },

  get coupon() {
    return {
      get zalo() {
        return new URL("./images/coupon/zalo.png", import.meta.url).href;
      },
      get momo() {
        return new URL("./images/coupon/momo.jpg", import.meta.url).href;
      },
      get moca() {
        return new URL("./images/coupon/moca.jpg", import.meta.url).href;
      },
    };
  },

  get cart() {
    return {
      get noProduct() {
        return new URL("./images/cart/no-product.png", import.meta.url).href;
      },
    };
  },

  get order() {
    return {
      get noOrder() {
        return new URL("./images/order/no-order.png", import.meta.url).href;
      },
    };
  },
};

export default Images;
