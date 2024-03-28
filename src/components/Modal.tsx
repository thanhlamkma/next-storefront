import { Modal as AntModal, ModalProps as AntModalProps } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import classnames from "classnames";
import Button from "src/components/Button";

export interface ModalProps extends AntModalProps {
  className?: any;
  title: string;
  onClose?: () => void;
  onConfirm?: () => void;
  textConfirm?: string;
  width?: number;
  children: any;
  top?: "center" | string;
  style?: any;
  colorBtn?: "outline-blue" | "blue";
  disableConfirm?: boolean;
}

const Modal = ({
  className,
  onConfirm,
  title,
  children,
  top = "center",
  width,
  style,
  textConfirm,
  colorBtn = "blue",
  disableConfirm = false,
  ...props
}: ModalProps) => {
  const { md } = useBreakpoint();
  return (
    <AntModal
      className={classnames(["modal-wrapper-component", className])}
      destroyOnClose={true}
      footer={
        props.footer || (
          <div className="modal-footer">
            {textConfirm && (
              <Button
                className={classnames([
                  "modal-confirm-btn",
                  `btn-${colorBtn}`,
                  { disable: disableConfirm },
                ])}
                onClick={!disableConfirm ? onConfirm : () => {}}
              >
                {textConfirm}
              </Button>
            )}
          </div>
        )
      }
      centered={top === "center"}
      width={width}
      style={{
        top: top !== "center" && top,
        ...style,
      }}
      {...props}
    >
      <div className="modal-header">{title}</div>
      <div className="modal-content">{children}</div>
    </AntModal>
  );
};

export default Modal;
