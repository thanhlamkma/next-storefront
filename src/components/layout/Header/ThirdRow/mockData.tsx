import { IconBaseProps, IconType } from "react-icons";
import {
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineYoutube,
} from "react-icons/ai";
import { BiBed } from "react-icons/bi";
import { BsHouse } from "react-icons/bs";
import { FaHeartbeat } from "react-icons/fa";
import { FiMonitor } from "react-icons/fi";
import { GiBowlOfRice, GiSmartphone } from "react-icons/gi";
import { GoGift } from "react-icons/go";
import { IoDiamondOutline, IoGameControllerOutline } from "react-icons/io5";
import { RiCamera3Line, RiTShirtLine } from "react-icons/ri";
import { TiSocialFacebook, TiSocialPinterest } from "react-icons/ti";
import Images from "src/assets/images";
import { AddItemRequest } from "src/models/Carts";

// Header Data Type And Data Mocked
export type SubMenuCategoriesImages = {
  src: string;
  size: {
    width: number;
    height: number;
  };
};

export type MenuType<T, K = undefined> = {
  title: T;
  items?: Array<K>;
};

export type CategoriesDropdownItemsType = {
  image?: SubMenuCategoriesImages | SubMenuCategoriesImages[];
  type?: 1 | 2;
  col?: 2 | 4;
} & MenuType<CategoriesType, CategoriesSubMenuType>;

export type CategoriesSubMenuType = {
  title: string;
  items: Array<string>;
};

export const categories: Array<CategoriesDropdownItemsType> = [
  {
    title: "Fashion",
    image: {
      src: Images.banner.banner2,
      size: {
        width: 235,
        height: 356,
      },
    },
    items: [
      {
        title: "women",
        items: [
          "New Arrivals",
          "Best Sellers",
          "Trending",
          "Clothing",
          "Shoes",
          "Bags",
          "Accessories",
          "Jewlery & Watches",
        ],
      },
      {
        title: "men",
        items: [
          "New Arrivals",
          "Best Sellers",
          "Trending",
          "Clothing",
          "Shoes",
          "Bags",
          "Accessories",
          "Jewlery & Watches",
        ],
      },
    ],
  },
  {
    title: "Home & Garden",
    col: 2,
    image: {
      src: Images.banner.banner3,
      size: {
        width: 235,
        height: 473,
      },
    },
    items: [
      {
        title: "BEDROOM",
        items: [
          "Beds, Frames & Bases",
          "Dressers",
          "Nightstands",
          "Kid's Beds & Headboards",
          "Armoires",
        ],
      },
      {
        title: "Office",
        items: [
          "Office Chairs",
          " Desks",
          "Bookcases",
          " File Cabinets",
          "Breakroom Tables",
        ],
      },
      {
        title: "LIVING ROOM",
        items: [
          "Coffee Tables",
          "Chairs",
          "Tables",
          "Futons & Sofa Beds",
          "Cabinets & Chests",
        ],
      },
      {
        title: "KITCHEN & DINING",
        items: [
          " Dining Sets",
          "Kitchen Storage Cabinets",
          "Bashers Racks",
          "Dining Chairs",
          "Dining Room Tables",
          "Bar Stools",
        ],
      },
    ],
  },
  {
    title: "Electronics",
    col: 2,
    image: {
      src: Images.banner.banner4,
      size: {
        width: 235,
        height: 413,
      },
    },
    items: [
      {
        title: "LAPTOPS & COMPUTERS",
        items: [
          "Desktop Computers",
          "Monitors",
          "Laptops",
          "Hard Drives & Storage",
          "Computer Accessories",
        ],
      },
      {
        title: "DIGITAL CAMERAS",
        items: [
          "Digital SLR Cameras",
          "Sports & Action Cameras",
          "Camera Lenses",
          "Photo Printer",
          "Digital Memory Cards",
        ],
      },
      {
        title: "TV & VIDEO",
        items: [
          "TVs",
          "Home Audio Speakers",
          "Projectors",
          "Media Streaming Devices",
        ],
      },
      {
        title: "CELL PHONES",
        items: [
          "Carrier Phones",
          "Unlocked Phones",
          "Phone & Cellphone Cases",
          "Cellphone Chargers",
        ],
      },
    ],
  },
  {
    title: "Furniture",
    type: 2,
    image: [
      {
        src: Images.banner.banner5,
        size: {
          width: 410,
          height: 123,
        },
      },
      {
        src: Images.banner.banner6,
        size: {
          width: 410,
          height: 123,
        },
      },
    ],
    items: [
      {
        title: "Furniture",
        items: [
          "Sofas & Couches",
          "Armchairs",
          "Bed Frames",
          "Beside Tables",
          "Dressing Tables",
        ],
      },
      {
        title: "LIGHTING",
        items: [
          "Light Bulbs",
          "Lamps",
          "Celling Lights",
          "Wall Lights",
          "Bathroom Lighting",
        ],
      },
      {
        title: "HOME ACCESSORIES",
        items: [
          "Decorative Accessories",
          "Candals & Holders",
          "Home Fragrance",
          "Mirrors",
          "Clocks",
        ],
      },
      {
        title: "GARDEN & OUTDOORS",
        items: [
          "Garden Furniture",
          "Lawn Mowers",
          "Pressure Washers",
          "All Garden Tools",
          "Outdoor Dining",
        ],
      },
    ],
  },
  {
    title: "Healthy & Beauty",
  },
  {
    title: "Gift Ideas",
  },
  {
    title: "Toy & Games",
  },
  {
    title: "Cooking",
  },
  {
    title: "Smart Phones",
  },
  {
    title: "Cameras & Photo",
  },
  {
    title: "Accessories",
  },
];

export type CategoriesType =
  | "Fashion"
  | "Home & Garden"
  | "Electronics"
  | "Furniture"
  | "Healthy & Beauty"
  | "Gift Ideas"
  | "Toy & Games"
  | "Cooking"
  | "Smart Phones"
  | "Cameras & Photo"
  | "Accessories";

export type MainMenuTitleType =
  | "common:home"
  | "common:shop"
  | "common:vendor"
  | "common:blog"
  | "common:pages"
  | "common:elements";
export type GenLogoType<T extends string | number | symbol = string> = {
  [index in T]?: IconType;
};
// export const getLogoCategories = (type: CategoriesType): FunctionComponent => {
//   return () => {
//     return type === "Fashion" ?
//   }
// }

// export type GenLogoType = {
//   [index in CategoriesType]: string;
// };

// export const genLogo: GenLogoType = {
//   Fashion: "FashionLogo",
//   "Home & Garden": "HomeGardenLogo",
//   Electronics: "ElectronicsLogo",
//   Furniture: "FurnitureLogo",
//   "Healthy & Beauty": "HealthyBeautyLogo",
//   "Gift Ideas": "GiftIdeasLogo",
//   "Toy & Games": "ToyGamesLogo",
//   Cooking: "CookingLogo",
//   "Smart Phones": "SmartPhonesLogo",
//   "Cameras & Photo": "CamerasPhotoLogo",
//   Accessories: "AccessoriesLogo",
// };

export const genLogo: GenLogoType<CategoriesType> = {
  Fashion: (props: IconBaseProps) => <RiTShirtLine {...props} />,
  "Home & Garden": (props: IconBaseProps) => <BsHouse {...props} />,
  Electronics: (props: IconBaseProps) => <FiMonitor {...props} />,
  Furniture: (props: IconBaseProps) => <BiBed {...props} />,
  "Healthy & Beauty": (props: IconBaseProps) => <FaHeartbeat {...props} />,
  "Gift Ideas": (props: IconBaseProps) => <GoGift {...props} />,
  "Toy & Games": (props: IconBaseProps) => (
    <IoGameControllerOutline {...props} />
  ),
  Cooking: (props: IconBaseProps) => <GiBowlOfRice {...props} />,
  "Smart Phones": (props: IconBaseProps) => <GiSmartphone {...props} />,
  "Cameras & Photo": (props: IconBaseProps) => <RiCamera3Line {...props} />,
  Accessories: (props: IconBaseProps) => <IoDiamondOutline {...props} />,
};

export type ItemsDropdown = {
  title: string;
  item?: Array<string>;
};

export interface MainMenuDataType
  extends MenuType<MainMenuTitleType, ItemsDropdown | ShopMenuDataType> {}

export type ShopMenuDataType = {
  title: string;
  items: Array<{
    text: string;
    special?: "hot" | "new";
  }>;
};

export const shop: Array<ShopMenuDataType> = [
  {
    title: "SHOP PAGES",
    items: [
      {
        text: "Banner With Sidebar",
      },
      {
        text: "Boxed Banner",
      },
      {
        text: "Full Width Banner",
      },
      {
        text: "Horizontal Filter",
        special: "hot",
      },
      {
        text: "Off Canvas Sidebar",
        special: "new",
      },
      {
        text: "Infinite Ajax Scroll",
      },
      {
        text: "Right Sidebar",
      },
      {
        text: "Both Sidebar",
      },
    ],
  },

  {
    title: "SHOP LAYOUTS",
    items: [
      {
        text: "3 Columns Mode",
      },
      {
        text: "4 Columns Mode",
      },
      {
        text: "5 Columns Mode",
      },
      {
        text: "6 Columns Mode",
      },
      {
        text: "7 Columns Mode",
      },
      {
        text: "8 Columns Mode",
      },
      {
        text: "List Mode",
      },
      {
        text: "List Mode With Sidebar",
      },
    ],
  },
  {
    title: "PRODUCT PAGES",
    items: [
      {
        text: "Variable Product",
      },
      {
        text: "Featured & Sale",
      },
      {
        text: "Data In Accordion",
      },
      {
        text: "Data In Sections",
      },
      {
        text: "Image Swatch",
      },
      {
        text: "Extended Info",
      },
      {
        text: "Without Sidebar",
      },
      {
        text: "360o & Video",
        special: "new",
      },
    ],
  },
  {
    title: "PRODUCTS LAYOUT",
    items: [
      {
        text: "Default",
        special: "hot",
      },
      {
        text: "Vertical Thumbs",
      },
      {
        text: "Grid Images",
      },
      {
        text: "Masonry",
      },
      {
        text: "Gallery",
      },
      {
        text: "Sticky Info",
      },
      {
        text: "Sticky Thumbs",
      },
      {
        text: "Sticky Both",
      },
    ],
  },
];

export const vendor: Array<ItemsDropdown> = [
  {
    title: "Store Listing",
    item: ["Store Listing 1", "Store Listing 2", "Store Listing 3"],
  },
  {
    title: "Vendor Store",
    item: ["Vendor Store 1", "Vendor Store 2", "Vendor Store 3"],
  },
];

export const blog: Array<ItemsDropdown> = [
  {
    title: "Classic",
  },
  {
    title: "Listing",
  },
  {
    title: "Grid",
    item: [
      "Grid 2 Columns",
      "Grid 2 Columns",
      "Grid 2 Columns",
      "Grid sidebar",
    ],
  },
  {
    title: "Masonry",
    item: [
      "Masonry 2 Columns",
      "Masonry 2 Columns",
      "Masonry 2 Columns",
      "Masonry sidebar",
    ],
  },
  {
    title: "Mask",
    item: ["Blog mask grid", "Blog mask masonry"],
  },
  {
    title: "Single Post",
  },
];

export const pages: Array<ItemsDropdown> = [
  {
    title: "About Us",
  },
  {
    title: "Become A Vendor",
  },
  {
    title: "Contact Us",
  },
  {
    title: "FAQs",
  },
  {
    title: "Error 404",
  },
  {
    title: "Coming Soon",
  },
  {
    title: "Wishlist",
  },
  {
    title: "Cart",
  },
  {
    title: "Checkout",
  },
  {
    title: "My Account",
  },
  {
    title: "Compare",
  },
];

export const elements: Array<ItemsDropdown> = [
  {
    title: "Accordions",
  },
  {
    title: "Alert & Notification",
  },
  {
    title: "Blog Posts",
  },
  {
    title: "Buttons",
  },
  {
    title: "Call to Action",
  },
  {
    title: "Icons",
  },
  {
    title: "Icon Boxes",
  },
  {
    title: "Instagrams",
  },
  {
    title: "Product Category",
  },
  {
    title: "Products",
  },
  {
    title: "Tabs",
  },
  {
    title: "Testimonials",
  },
  {
    title: "Titles",
  },
  {
    title: "Typography",
  },
  {
    title: "Vendors",
  },
];

export const mainMenuData: Array<MainMenuDataType> = [
  {
    title: "common:home",
  },
  {
    title: "common:shop",
    items: shop,
  },
  {
    title: "common:vendor",
    items: vendor,
  },
  {
    title: "common:blog",
    items: blog,
  },
  {
    title: "common:pages",
    items: pages,
  },
  {
    title: "common:elements",
    items: elements,
  },
];

// Footer Data Type And Mock

// Contact And Service Type And Data Mocked
export type ContactAndServiceNameType =
  | "layout:company"
  | "layout:myAccount"
  | "layout:customService";

export interface ContactAndServiceDataType
  extends MenuType<ContactAndServiceNameType, string> {}

export const contactAndService: Array<ContactAndServiceDataType> = [
  {
    title: "layout:company",
    items: [
      "About Us",
      "Team Member",
      "Career",
      "Contact Us",
      "Affilate",
      "Order History",
    ],
  },
  {
    title: "layout:myAccount",
    items: [
      "Track My Order",
      "View Cart",
      "Sign In",
      "Help",
      "My Wishlist",
      "Privacy Policy",
    ],
  },
  {
    title: "layout:customService",
    items: [
      "Payment Methods",
      "Money-back guarantee!",
      "Product Returns",
      "Support Center",
      "Shipping",
      "Term and Conditions",
    ],
  },
];

// Social Type and Data Mocked

export type SocialNametype =
  | "Facebook"
  | "Twitter"
  | "Instagram"
  | "Youtube"
  | "Pinterest";

export type SocialDataType = {
  name: SocialNametype;
  link?: string;
  color?: string;
};

const genCommonLogo = (Icon: IconType) => {
  return (props: IconBaseProps) => <Icon {...props} />;
};

export const genIcon: GenLogoType<SocialNametype> = {
  Facebook: genCommonLogo(TiSocialFacebook),
  Twitter: genCommonLogo(AiOutlineTwitter),
  Instagram: genCommonLogo(AiOutlineInstagram),
  Youtube: genCommonLogo(AiOutlineYoutube),
  Pinterest: genCommonLogo(TiSocialPinterest),
};

export const social: Array<SocialDataType> = [
  {
    name: "Facebook",
    color: "#1b4f9b",
  },
  {
    name: "Twitter",
    color: "#00adef",
  },
  {
    name: "Instagram",
    color: "#cc0001",
  },
  {
    name: "Youtube",
    color: "#2c567e",
  },
  {
    name: "Pinterest",
    color: "#f96a02",
  },
];

type ProductCatgoriesNameType =
  | "Consumer Electric"
  | "Clothing & Apparel"
  | "Home, Garden & Kitchen"
  | "Health & Beauty"
  | "Jewelry & Watches"
  | "Computer & Technologies";

interface ProductCatgoriesDataType
  extends MenuType<ProductCatgoriesNameType, string> {}

export const productCategoriesData: Array<ProductCatgoriesDataType> = [
  {
    title: "Consumer Electric",
    items: [
      "TV Television",
      "Air Condition",
      "Refrigerator",
      "Washing Machine",
      "Audio Speaker",
      "Security Camera",
      "View All",
    ],
  },
  {
    title: "Consumer Electric",
    items: [
      "Men's T-shirt",
      "Dresses",
      "Men's Sneacker",
      "Leather Backpack",
      "Watches",
      "Jeans",
      "Sunglasses",
      "Boots",
      "Rayban",
      "Acccessories",
    ],
  },
  {
    title: "Consumer Electric",
    items: [
      "Sofa",
      "Chair",
      "Bed Room",
      "Living Room",
      "Cookware",
      "Utensil",
      "Blender",
      "Garden Equipments",
      "Decor",
      "Library",
    ],
  },
  {
    title: "Consumer Electric",
    items: [
      "Skin Care",
      "Body Shower",
      "Makeup",
      "Hair Care",
      "Lipstick",
      "Perfume",
      "View all",
    ],
  },
  {
    title: "Consumer Electric",
    items: [
      "Necklace",
      "Pendant",
      "Diamond Ring",
      "Silver Earing",
      "Leather Watcher",
      "Rolex",
      "Gucci",
      "Australian Opal",
      "Ammolite",
      "Sun Pyrite",
    ],
  },
  {
    title: "Consumer Electric",
    items: [
      "Laptop",
      "iMac",
      "Smartphone",
      "Tablet",
      "Apple",
      "Asus",
      "Drone",
      "Wireless Speaker",
      "Game Controller",
      "View all",
    ],
  },
];

export type CartProductDataType = {
  productId?: number;
  productTemplateId?: number;
  name?: string;
  price?: number;
  sale?: number;
  quantity?: number;
  total?: number;
  img?: string;
  status?: string | number;
};

// export const cartProductData: Array<CartProductDataType> = [
//   {
//     name: "Classic Simple Backpack",
//     store: "Tiki Trading",
//     price: 40.0,
//     sale: 30.0,
//     quantity: 1,
//     total: 10.0,
//     sku: "8935235210264",
//     img: Images.product.cartProduct12,
//     status: 1,
//   },
//   {
//     name: "Smart Watch",
//     store: "Shopee",
//     price: 60.0,
//     sale: 50.0,
//     quantity: 1,
//     total: 10.0,
//     sku: "2435751909810",
//     img: Images.product.cartProduct13,
//     status: 2,
//   },
// ];

export type CustomerInfoProperty =
  | "name"
  | "phoneNumber"
  | "country"
  | "city"
  | "details";

export type CustomerDataType = {
  [index in CustomerInfoProperty]: string;
};

export type DealsName =
  | "Giảm 50k"
  | "Giảm 100k"
  | "Giảm 30k"
  | "Giảm 1 triệu"
  | "Giảm 80k"
  | "Giảm 500k";

export type LeftType = "Số lượng có hạn" | "Đã hết lượt" | "Sắp cháy lượt";
export type ATMDealsType = {
  title: DealsName;
  require: string;
  left: LeftType;
  bankLogo: string;
};

export const dealsData: Array<ATMDealsType> = [
  {
    title: "Giảm 1 triệu",
    require: "Đơn từ 10 triệu, thẻ Ghi nợ",
    left: "Số lượng có hạn",
    bankLogo: Images.logo.bankLogo.cityLogo,
  },
  {
    title: "Giảm 100k",
    require: "Đơn từ 500l",
    left: "Đã hết lượt",
    bankLogo: Images.logo.bankLogo.vibLogo,
  },
  {
    title: "Giảm 50k",
    require: "Đơn từ 200k, thẻ Ghi nợ",
    left: "Số lượng có hạn",
    bankLogo: Images.logo.bankLogo.cityLogo,
  },
  {
    title: "Giảm 100k",
    require: "Đơn từ 1 triệu",
    left: "Số lượng có hạn",
    bankLogo: Images.logo.bankLogo.vietcombankLogo,
  },
  {
    title: "Giảm 100k",
    require: "Đơn từ 1 triệu",
    left: "Đã hết lượt",
    bankLogo: Images.logo.bankLogo.mastercardLogo,
  },
  {
    title: "Giảm 50k",
    require: "Đơn Tikigon tư2 500k",
    left: "Sắp cháy lượt",
    bankLogo: Images.logo.bankLogo.techLogo,
  },
];

export type RateType = {
  star: number;
  title: string;
};
export const rate: Array<RateType> = [
  {
    star: 1,
    title: "Rất không hài lòng",
  },
  {
    star: 2,
    title: "Không hài lòng",
  },
  {
    star: 3,
    title: "Bình thường",
  },
  {
    star: 4,
    title: "Hài lòng",
  },
  {
    star: 5,
    title: "Cực kì hài lòng",
  },
];
export type ReviewDataType = {
  titleProduct?: string;
  imageProduct?: string;
  comment: string;
  imagesComment?: Array<string>;
  rate: RateType;
  store?: string;
};

export const reviewsData: Array<ReviewDataType> = [
  {
    titleProduct: "Alarm Clock With Lamp",
    imageProduct: Images.product.clock,
    comment: "Sản phẩm chính hãng. Shop phục vụ nhiệt tình",
    imagesComment: [
      Images.product.clock,
      Images.product.macbook,
      Images.product.alarm,
      Images.product.bag,
    ],
    rate: rate[4],
    store: "Apple",
  },
  {
    titleProduct: "Apple Laptop",
    imageProduct: Images.product.macbook,
    comment: "Giao hành cực nhanh, Giao hàng nhiệt tình",
    imagesComment: [
      Images.product.baglo,
      Images.product.clock,
      Images.product.macbook,
      Images.product.alarm,
      Images.product.bag,
    ],
    rate: rate[3],
    store: "DAFC",
  },
  {
    titleProduct: "Attachable Charge Alarm",
    imageProduct: Images.product.alarm,
    comment:
      "Tai nghe rất vừa vặn, không rớt khi hoạt động mạnh hay đạp xe, chạy xe máy. Bluetooth kết nối nhanh, hôm nay mình đã sử dụng cả ngày, 1 tai hoặc cả 2 tai để không gặp vấn đề nào về kết nối. mình rất thích hoàn thiện của hộp đựng tai nghe, tuy nhiên loại nhựa nhám này dễ bám vân tay. ",
    imagesComment: [
      Images.product.clock,
      Images.product.macbook,
      Images.product.alarm,
      Images.product.bag,
    ],
    rate: rate[4],
    store: "DAFC",
  },
  {
    titleProduct: "Best Travel Bag",
    imageProduct: Images.product.bag,
    comment: "Sản phẩm chính hãng. Shop phục vụ nhiệt tình",
    imagesComment: [
      Images.product.clock,
      Images.product.macbook,
      Images.product.alarm,
      Images.product.bag,
    ],
    rate: rate[4],
    store: "DAFC",
  },
];
