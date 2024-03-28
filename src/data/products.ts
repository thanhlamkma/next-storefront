import Images from "src/assets/images";

export interface Product {
  id?: string | number;
  image?: string;
  name?: string;
  reviews?: number;
  price?: string;
  priceReal?: string;
  type?: "electronics" | "fashion" | "beauty" | "sport";
  star?: number;
  categoryName?: string;
  categoryId?: number;
  quantity?: number;
  saleOrderLineId?: number;
}

export enum Size {
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
  ExtraLarge = "ExtraLarge",
}

export const listProduct: Array<Product> = [
  {
    id: 1,
    image: Images.product.tivi,
    name: "3D Televition",
    reviews: 3,
    price: "$220.00 - $230.00",
    type: "electronics",
    star: 5,
  },
  {
    id: 2,
    image: Images.product.clock,
    name: "Alarm Clock With Lamp",
    reviews: 10,
    price: "$30.00",
    priceReal: "$60.00",
    type: "electronics",
    star: 3,
  },
  {
    id: 3,
    image: Images.product.macbook,
    name: "Apple Laptop",
    reviews: 5,
    price: "$1,000.00",
    type: "electronics",
    star: 4,
  },
  {
    id: 4,
    image: Images.product.alarm,
    name: "Attachable Charge Alarm",
    reviews: 7,
    price: "$15.00",
    type: "electronics",
    star: 3,
  },
  {
    id: 5,
    image: Images.product.bag,
    name: "Best Travel Bag",
    reviews: 4,
    price: "$15.00",
    type: "fashion",
    star: 3,
  },
  {
    id: 6,
    image: Images.product.moto,
    name: "Black Stunt Motor",
    reviews: 12,
    price: "$374.00",
    type: "sport",
    star: 5,
  },
  {
    id: 7,
    image: Images.product.baglo,
    name: "Blue Sky Trunk",
    reviews: 9,
    price: "$85.00",
    type: "fashion",
    star: 5,
  },
  {
    id: 8,
    image: Images.product.bodyCare,
    name: "Blue Sky Trunk",
    reviews: 4,
    price: "$25.00",
    type: "beauty",
    star: 3,
  },
  {
    id: 9,
    image: Images.product.phone,
    name: "Blue Sky Trunk",
    reviews: 4,
    price: "$950.00",
    type: "electronics",
    star: 4,
  },
  {
    id: 10,
    image: Images.product.bag,
    name: "Cavin Fashion Suede Handbag",
    reviews: 4,
    price: "$163.00",
    type: "fashion",
    star: 4,
  },
  {
    id: 11,
    image: Images.product.iWatch,
    name: "Charming Design Watch",
    reviews: 10,
    price: "$30.00",
    type: "electronics",
    star: 5,
  },
  {
    id: 12,
    image: Images.product.bagGray,
    name: "Classic Simple Blackpack",
    reviews: 9,
    price: "$85.00",
    type: "fashion",
    star: 5,
  },
];

export const categoryHome = [
  { title: "Fashion", image: Images.category.shirt },
  { title: "Furniture", image: Images.category.sofa },
  { title: "Shoes", image: Images.category.shoes },
  { title: "Sports", image: Images.category.dumbbell },
  { title: "Games", image: Images.category.psGame },
  { title: "Computers", image: Images.category.lap },
];
