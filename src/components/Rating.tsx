import { Rate, RateProps, Tooltip } from "antd";
import classnames from "classnames";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface RatingProps extends RateProps {
  className?: string;
  reviews?: number | string;
  fontReview?: number | string;
  width?: "auto" | "full";
  // onChange?: (value: number) => void;
}

const Rating = ({
  className,
  width = "full",
  reviews,
  fontReview = 14,
  // onChange,
  ...props
}: RatingProps) => {
  const [valueRating, setValueRating] = useState<number>(
    props.defaultValue || 0
  );

  useEffect(() => {
    if (props.defaultValue) {
      setValueRating(props.defaultValue);
    } else {
      setValueRating(0);
    }
  }, [props.defaultValue]);

  const { t } = useTranslation();

  const onChangeRating = useCallback((value: number) => {
    setValueRating(value);
    // onChange && onChange(value);
  }, []);

  return (
    <div
      className={classnames([
        "rating flex xs:flex-col flex-row md:items-start justify-between gap-1",
        { "w-full": width === "full" },
        { "w-auto": width === "auto" },
        className,
      ])}
    >
      <Tooltip placement="top" trigger="hover" title={valueRating}>
        <div>
          <Rate
            className="rating-star"
            {...props}
            value={valueRating}
            style={{
              color: "#f93",
              fontSize: 14,
              marginRight: 8,
              whiteSpace: "nowrap",
            }}
            // onChange={onChangeRating}
            onHoverChange={onChangeRating}
          />
        </div>
      </Tooltip>
      {reviews !== null && reviews !== undefined && (
        <Link href={"#"}>
          <div className="w-full flex justify-center">
            <a
              className="reviews text-gray-99 text-sm"
              style={{ fontSize: fontReview }}
            >
              ({reviews} <span>{t("products:reviews")}</span>)
            </a>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Rating;
