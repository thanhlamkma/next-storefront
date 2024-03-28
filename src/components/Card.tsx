import { Card as AntCard, CardProps as AntCardProps } from "antd";

export interface CardProps extends AntCardProps {}

const Card = ({ bordered = false, className, ...props }: CardProps) => {
  return (
    <AntCard {...props} className={`${className || ""}`} bordered={bordered} />
  );
};

export default Card;
