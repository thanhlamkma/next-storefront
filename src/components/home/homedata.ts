import Images from "src/assets/images";

export type BlogType = {
  author: string;
  time: string;
  name: string;
  img?: string;
};

export const blogData: Array<BlogType> = [
  {
    author: "John Doe",
    time: "03.05.2021",
    name: "Aliquam tincidunt mauris eurisus",
    img: Images.outBlog.blog1,
  },
  {
    author: "John Doe",
    time: "03.05.2021",
    name: "Cras ornare tristique elit",
    img: Images.outBlog.blog2,
  },
  {
    author: "John Doe",
    time: "03.05.2021",
    name: "Vivamus vestibulum ntulla nec ante",
    img: Images.outBlog.blog3,
  },
  {
    author: "John Doe",
    time: "03.05.2021",
    name: "Fusce lacinia arcuet nulla",
    img: Images.outBlog.blog4,
  },
];

export type RecentView = {
  title: string;
  img?: string;
};

export const recentProduct = [
  {
    title: "Woman's Fasion HandBag",
    img: Images.product.recentProduct.product1,
  },
  {
    title: "Electric Frying Pan",
    img: Images.product.recentProduct.product2,
  },
  {
    title: "Black Winter Skating",
    img: Images.product.recentProduct.product3,
  },
  {
    title: "HD Television",
    img: Images.product.recentProduct.product4,
  },
  {
    title: "Home Sofa",
    img: Images.product.recentProduct.product5,
  },
  {
    title: "USB Receipt",
    img: Images.product.recentProduct.product6,
  },
  {
    title: "Electric Rice-Cooker",
    img: Images.product.recentProduct.product7,
  },
  {
    title: "Table Lamp",
    img: Images.product.recentProduct.product8,
  },
];
