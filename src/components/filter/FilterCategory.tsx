import React from "react";
import { useTranslation } from "react-i18next";
import { Category, dataCategory } from "src/data/filter";
import WrapFilter from "./WrapFilter";

interface FilterCategoryProps {
  filterName: string;
}

const FilterCategory = ({ filterName }: FilterCategoryProps) => {
  const { t } = useTranslation();

  return (
    <div id="filter-category">
      <WrapFilter name={filterName}>
        {dataCategory.map((category: Category) => (
          <div className="text-filter" key={`filter-catgory-${category.name}`}>
            {t(category.name)}
          </div>
        ))}
      </WrapFilter>
    </div>
  );
};

export default FilterCategory;
