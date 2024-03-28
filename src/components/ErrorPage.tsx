import { Typography } from "antd";

interface ErrorPageProps {
  title: string;
  subTitle: string;
  description: string;
  image: any;
  width?: string | number;
  height?: string | number;
}

const ErrorPage = ({
  title,
  subTitle,
  description,
  image,
  width = "100vw",
  height = "100vh",
}: ErrorPageProps) => {
  return (
    <div
      id="error-boundary-page"
      style={{ backgroundImage: `url(${image})`, width, height }}
    >
      <Typography.Title>{title}</Typography.Title>
      <Typography.Title level={2}>{subTitle}</Typography.Title>
      <Typography.Title level={5}>{description}</Typography.Title>
    </div>
  );
};

export default ErrorPage;
