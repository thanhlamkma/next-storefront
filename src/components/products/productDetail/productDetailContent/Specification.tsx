import { useEffect, useState } from "react";
import { ProductDetailResponse } from "src/models/Product";

const dataSpecification = [
  { title: "Model", content: "Skysuite 320" },
  { title: "Color", content: "Black" },
  { title: "Size", content: "Large, Small" },
  { title: "Guarantee Time", content: "3 Months" },
];

interface SpecificationProps {
  productDetail?: ProductDetailResponse | null;
}

type SpecialList = {
  id: string;
  name: string;
  value: string;
};

const Specification = ({ productDetail }: SpecificationProps) => {
  const [attrList, setAttrList] = useState<SpecialList[]>([]);

  useEffect(() => {
    if (productDetail) {
      const array: SpecialList[] = [];
      productDetail.attributesOdoosLst[0].value.map((item) => {
        array.push({
          id: item._id,
          name: productDetail.attributesOdoosLst[0].name,
          value: item.Name,
        });
      });
      setAttrList(array);
    }
  }, [productDetail]);

  console.log("productDetail", productDetail);

  return (
    <div id="specification">
      <ul className="list">
        {attrList.map((item) => (
          <li className="flex items-center mb-2" key={item.id}>
            <label className="max-w-xs w-[200px] text-black-33 capitalize">
              {item.name}
            </label>
            <p className="mb-0 text-gray-66">{item.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Specification;
