import { Modal, ModalProps } from "antd";
import React from "react";

type Props = ModalProps;

const InfomationCoin = (props: Props) => {
  return (
    <Modal {...props}>
      <p className="text-sm text-justify">
        Tiki Xu (còn gọi tắt là Xu) - một đơn vị qui đổi có giá trị qui ước 1 Xu
        = 1 vnđ, dùng để trao đổi và tiến hành các giao dịch mua sắm trên sàn
        thương mại điện tử Tiki (tiki.vn) hoặc trên sàn giao dịch Tiki Exchange
        (https://ti.ki/exchange).
      </p>
      <p className="text-sm mt-2 text-justify">
        Người dùng có thể sở hữu Tiki Xu thông qua một số phương thức khác nhau
        như: Phiếu Quà Tặng hoặc Nạp Tiki Xu trực tiếp vào tài khoản. Các giao
        dịch nạp Tiki Xu vào tài khoản sẽ không thể Huỷ / Trả. Tiki Xu chưa thể
        tặng, hoặc chuyển qua lại trực tiếp giữa các tài khoản.
      </p>
    </Modal>
  );
};

export default InfomationCoin;
