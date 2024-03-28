export interface DataCheckBox {
  lable: string;
  name: string;
  checked: boolean;
}

export interface DataSelect<Value = string> {
  label: string;
  value: Value;
}

export const dataFilterSize: Array<DataCheckBox> = [
  { name: "extraSize", lable: "size:extraSize", checked: false },
  { name: "large", lable: "size:large", checked: true },
  { name: "medium", lable: "size:medium", checked: false },
  { name: "small", lable: "size:small", checked: false },
];

export const dataFilterBrand: Array<DataCheckBox> = [
  { name: "elegantGroup", lable: "Elegant Auto Group", checked: false },
  { name: "greenGrass", lable: "Green Grass", checked: true },
  { name: "nodeJs", lable: "Node Js", checked: false },
  { name: "ns8", lable: "NS8", checked: false },
  { name: "red", lable: "Red", checked: false },
  { name: "skysuiteTech", lable: "Skysuite Tech", checked: false },
  { name: "sterling", lable: "Sterling", checked: false },
];

export const dataFilterColor: Array<DataCheckBox> = [
  { name: "black", lable: "colors:black", checked: false },
  { name: "blue", lable: "colors:blue", checked: true },
  { name: "brown", lable: "colors:gray", checked: false },
  { name: "green", lable: "colors:green", checked: false },
  { name: "gray", lable: "colors:gray", checked: false },
  { name: "orange", lable: "colors:orange", checked: false },
  { name: "yellow", lable: "colors:yellow", checked: false },
];

////////////////////////////////////////////////////////////////////////////////////////////////
export interface Category {
  name: string;
}

export const dataCategory: Array<Category> = [
  { name: "Accessories" },
  { name: "Babies" },
  { name: "Beauty" },
  { name: "Decoration" },
  { name: "Electronics" },
  { name: "Fashion" },
  { name: "Food" },
  { name: "Furniture" },
  { name: "Kitchen" },
  { name: "Medical" },
  { name: "Sports" },
  { name: "Watches" },
];

//////////////////////////////////////////////////////////////////////////////////////////////////
export interface Price {
  name: string;
  value: {
    min: number | string;
    max?: number | string;
  };
}

export const dataPrice: Array<Price> = [
  { name: "$0.00 - $100.00", value: { min: 0, max: 100 } },
  { name: "$100.00 - $200.00", value: { min: 100, max: 200 } },
  { name: "$200.00 - $300.00", value: { min: 200, max: 300 } },
  { name: "$300.00 - $500.00", value: { min: 300, max: 500 } },
  { name: "$500.00+", value: { min: 500 } },
];

export type SortValue =
  | "default"
  | "popular"
  | "average_rating"
  | "newest"
  | "price_asc"
  | "price_desc";

export const optionSort: Array<DataSelect<SortValue>> = [
  { label: "filters:defaultSorting", value: "default" },
  { label: "filters:sortPopular", value: "popular" },
  { label: "filters:sortAverageRating", value: "average_rating" },
  { label: "filters:sortLatest", value: "newest" },
  { label: "filters:sortFromLow", value: "price_asc" },
  { label: "filters:sortFromHigh", value: "price_desc" },
];

export type LimitValue = "9" | "12" | "24" | "36";
export const optionViewer: Array<DataSelect<LimitValue>> = [
  { label: "Show 9", value: "9" },
  { label: "Show 12", value: "12" },
  // { label: "Show 24", value: "24" },
  // { label: "Show 36", value: "36" },
];

export type FilterValue = {
  limit: LimitValue;
  sort: SortValue;
  page: number;
  min: number;
  max: number;
  // "attributeId": [1, 2, 3],
  attribute?: string;
  // "categoryOdooId": 1,
  category?: string;
  search?: string;
};
