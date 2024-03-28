import { Button as AntButton, Modal, Popconfirm, PopconfirmProps } from "antd";
import {
  ButtonGroupProps as AntButtonGroupProps,
  ButtonProps as AntButtonProps,
} from "antd/lib/button";
import { ModalFuncProps } from "antd/lib/modal";
import Link, { LinkProps } from "next/link";
import React, { ReactNode, useCallback, useMemo } from "react";

export interface ButtonProps extends AntButtonProps {
  warning?: boolean;
  success?: boolean;
  light?: boolean;
  iconRight?: boolean;
  hover?: "light" | "primary" | "success" | "warning" | "danger";
  underline?: boolean;
}

const Button = ({
  warning,
  success,
  light,
  size = "middle",
  iconRight,
  hover,
  underline,
  ...props
}: ButtonProps) => {
  const className = useMemo(() => {
    let btnClasses = (props.className || "") + " ant-btn-custom";

    if (warning) {
      btnClasses += " ant-btn-warning";
    } else if (success) {
      btnClasses += " ant-btn-success";
    }

    if (light) {
      btnClasses += " ant-btn-light";
    }

    if (hover) {
      btnClasses += ` ant-btn-hover-${hover}`;
    }

    if (underline) {
      btnClasses += " ant-btn-hover-underline";
    }

    if (iconRight) {
      btnClasses += " ant-btn-icon-right";
    }

    return btnClasses;
  }, [props.className, warning, success, light, hover]);

  return <AntButton {...props} className={className} size={size} />;
};

interface ButtonConfirmProps extends ButtonProps {
  modalConfig: ModalFuncProps;
}

Button.Confirm = ({ modalConfig, ...props }: ButtonConfirmProps) => {
  const openModal = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      Modal.confirm({
        ...modalConfig,
      });
    },
    [modalConfig]
  );

  return <Button {...props} onClick={openModal} />;
};

Button.ConfirmDelete = (props: ButtonConfirmProps) => {
  return (
    <Button.Confirm
      {...props}
      modalConfig={{
        okButtonProps: {
          danger: true,
        },
        ...props.modalConfig,
      }}
    />
  );
};

type ButtonPopConfirmProps = Omit<ButtonProps, "onClick" | "title"> &
  Pick<
    PopconfirmProps,
    | "title"
    | "onCancel"
    | "onConfirm"
    | "okButtonProps"
    | "cancelButtonProps"
    | "icon"
    | "placement"
  >;

Button.PopConfirm = ({
  title,
  onCancel,
  onConfirm,
  okButtonProps,
  cancelButtonProps,
  icon,
  placement,
  ...props
}: ButtonPopConfirmProps) => {
  return (
    <Popconfirm
      title={title}
      onCancel={onCancel}
      onConfirm={onConfirm}
      okButtonProps={okButtonProps}
      cancelButtonProps={cancelButtonProps}
      icon={icon}
      placement={placement}
    >
      <Button {...props} />
    </Popconfirm>
  );
};

type ButtonLinkProps = {} & Omit<ButtonProps, "href" | "onClick"> &
  Omit<LinkProps, "passHref">;

Button.Link = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  locale,
  ...props
}: ButtonLinkProps) => {
  return (
    <Link
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
      passHref
    >
      <Button {...props} />
    </Link>
  );
};

interface ButtonGroupProps extends AntButtonGroupProps {
  shape?: "round";
  children: ReactNode;
}

Button.Group = ({ shape, ...props }: ButtonGroupProps) => (
  <AntButton.Group
    {...props}
    className={`${props.className || ""}${
      shape === "round" ? " ant-btn-group-round" : ""
    }`}
  />
);

export default Button;
