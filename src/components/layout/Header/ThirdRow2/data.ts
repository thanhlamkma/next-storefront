import { IconType } from "react-icons";

// Menu type
type MenuType = {
  id?: string | number;
  name: string;
  href?: string;
  children?: NavSubMenu[];
  expandIcon?: IconType;
};

// Title nav menu
export type NavMenu = MenuType & {
  directionRender?: "horizontal" | "vertical";
};

export type NavSubMenu = MenuType & {
  content?: (NavSubMenu & ItemAttributes)[];
};

export type ItemAttributes = {
  tipTop?: "hot" | "new";
};

export const navMenuData: NavMenu[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shop",
    directionRender: "horizontal",
    children: [
      {
        name: "SHOP PAGES",
        content: [
          {
            name: "Banner With Sidebar",
          },
          {
            name: "Boxed Banner",
          },
          {
            name: "Full Width Banner",
          },
          {
            name: "Horizontal Filter",
            tipTop: "hot",
          },
          {
            name: "Off Canvas Sidebar",
            tipTop: "new",
          },
          {
            name: "Infinite Ajax Scroll",
          },
          {
            name: "Right Sidebar",
          },
          {
            name: "Both Sidebar",
          },
        ],
      },
      {
        name: "SHOP LAYOUTS",
        content: [
          {
            name: "3 Columns Mode",
          },
          {
            name: "4 Columns Mode",
          },
          {
            name: "5 Columns Mode",
          },
          {
            name: "6 Columns Mode",
          },
          {
            name: "7 Columns Mode",
          },
          {
            name: "8 Columns Mode",
          },
          {
            name: "List Mode",
          },
          {
            name: "List Mode With Sidebar",
          },
        ],
      },
      {
        name: "PRODUCT PAGES",
        content: [
          {
            name: "Variable Product",
          },
          {
            name: "Featured & Sale",
          },
          {
            name: "Data In Accordion",
          },
          {
            name: "Data In Sections",
          },
          {
            name: "Image Swatch",
          },
          {
            name: "Extended Info",
          },
          {
            name: "Without Sidebar",
          },
          {
            name: "360o & Video",
          },
        ],
      },
      {
        name: "PRODUCT LAYOUTS",
        content: [
          {
            name: "Default",
            tipTop: "hot",
          },
          {
            name: "Vertical Thumbs",
          },
          {
            name: "Grid Images",
          },
          {
            name: "Masonry",
          },
          {
            name: "Gallery",
          },
          {
            name: "Sticky Info",
          },
          {
            name: "Sticky Thumbs",
          },
          {
            name: "Sticky Both",
          },
        ],
      },
    ],
  },
  {
    name: "Vendor",
    children: [
      {
        name: "Store Listing",
        children: [
          {
            name: "Store Listing 1",
          },
          {
            name: "Store Listing 2",
          },

          {
            name: "Store Listing 3",
          },

          {
            name: "Store Listing 4",
          },
        ],
      },
      {
        name: "Vendor Store",
        children: [
          {
            name: "Vendor Store 1",
          },
          {
            name: "Vendor Store 2",
          },

          {
            name: "Vendor Store 3",
          },

          {
            name: "Vendor Store 4",
          },
        ],
      },
    ],
  },
  {
    name: "Blog",
    children: [
      {
        name: "Classic",
      },
      {
        name: "Listing",
      },
      {
        name: "Grid",
        children: [
          {
            name: "Grid 2 Columns",
          },
          {
            name: "Grid 3 Columns",
          },
          {
            name: "Grid 4 Columns",
          },
        ],
      },
      {
        name: "Masonry",
        children: [
          {
            name: "Masonry 2 Columns",
          },
          {
            name: "Masonry 3 Columns",
          },
          {
            name: "Masonry 4 Columns",
          },
        ],
      },
      {
        name: "Mask",
        children: [
          {
            name: "Blog Mask Grid",
          },
          {
            name: "Blog Mask Masonry",
          },
        ],
      },
      {
        name: "Single Post",
      },
    ],
  },
  {
    name: "Pages",
    children: [
      {
        name: "About Us",
      },
      {
        name: "Become A Vendor",
      },
      {
        name: "Contact Us",
      },
      {
        name: "FAQs",
      },
      {
        name: "Error 404",
      },
      {
        name: "Coming Soon",
      },
      {
        name: "Wishlist",
      },
      {
        name: "Cart",
      },
      {
        name: "Checkout",
      },
      {
        name: "My Account",
      },
      {
        name: "Compare",
      },
    ],
  },
  {
    name: "Elements",
    children: [
      {
        name: "Accordions",
      },
      {
        name: "Alert & Notification",
      },
      {
        name: "Blog Posts",
      },
      {
        name: "Buttons",
      },
      {
        name: "Call to Action",
      },
      {
        name: "Icons",
      },
      {
        name: "Icon Boxes",
      },
      {
        name: "Instagrams",
      },
      {
        name: "Product Category",
      },
      {
        name: "Products",
      },
      {
        name: "Tabs",
      },
      {
        name: "Testimonials",
      },
      {
        name: "Titles",
      },
      {
        name: "Typography",
      },
      {
        name: "Vendors",
      },
    ],
  },
];
