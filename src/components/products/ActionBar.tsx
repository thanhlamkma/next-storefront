import { Col, Row, RowProps } from "antd";
import React, { memo, useCallback } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdOutlineWatchLater, MdWatchLater } from "react-icons/md";

type Props = {
  isFavourite?: boolean;
  isBuyLater?: boolean;
  isInCart?: boolean;

  onClickFavouriteIcon?: (
    e?: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onClickBuyLaterIcon?: (
    e?: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onClickIsCartIcon?: (
    e?: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
} & RowProps;

const ActionBar = ({
  className,
  onClickFavouriteIcon,
  onClickBuyLaterIcon,
  onClickIsCartIcon,
  isFavourite,
  isBuyLater,
}: Props) => {
  const handleClickFavourite = useCallback(
    (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e?.stopPropagation();
      onClickFavouriteIcon && onClickFavouriteIcon(e);
    },
    [onClickFavouriteIcon]
  );

  const handleClickBuyLater = useCallback(
    (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e?.stopPropagation();
      onClickBuyLaterIcon && onClickBuyLaterIcon(e);
    },
    [onClickBuyLaterIcon]
  );
  return (
    <Row className={`action-bar ${className || ""}`}>
      <Col xs={12} sm={24}>
        <div
          onClick={handleClickFavourite}
          className={`action-icon-container wish-list-action ${
            isFavourite ? "actived-action" : ""
          }`}
        >
          <AiFillHeart className="active-action-icon" />

          <AiOutlineHeart className="action-icon" />

          {/* <AiFillHeart /> */}
        </div>
      </Col>
      {/* <Col xs={8} sm={24}>
        <div
          onClick={handleClickBuyLater}
          className={`action-icon-container add-to-order-action ${
            isBuyLater ? "actived-action" : ""
          }`}
        >
          <BsFillCartCheckFill className="active-action-icon" />

          <BsCartPlus className="action-icon" />

        </div>
      </Col> */}
      <Col xs={12} sm={24}>
        <div
          onClick={handleClickBuyLater}
          className={`action-icon-container add-to-buy-later-action ${
            isBuyLater ? "actived-action" : ""
          }`}
        >
          <MdWatchLater className="active-action-icon" />

          <MdOutlineWatchLater className="action-icon" />

          {/* <MdWatchLater /> */}
        </div>
      </Col>
    </Row>
  );
};

export default memo(ActionBar);
