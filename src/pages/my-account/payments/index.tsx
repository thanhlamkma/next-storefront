import { Button, Col, Row } from "antd";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Images from "src/assets/images";
import Layout from "src/components/layout";
import LayoutAccount from "src/components/layout/LayoutAccount";
import { Payment, payments as paymentsData } from "src/data/payments";
interface PaymentsProps {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  const session = await getSession(context);

  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "vi")),
    },
  };
};

const Payments: PageComponent = (linkContent: PaymentsProps) => {
  const [payments, setPayments] = useState<Array<Payment> | []>(paymentsData);
  const removePayment = () => {
    setPayments([]);
  };

  return (
    <div id="payment" className="mb-5 max-w-[550px]">
      <Row gutter={20} className="mt-3">
        {payments && payments.length > 0 ? (
          payments.map((item) => (
            <Col xs={24} lg={12} className="mb-4">
              <div className="h-[110px] flex border rounded-[10px] box-shadow">
                <div className="center relative w-[30%] max-w-[135px]">
                  <div className="shape shape__top"></div>
                  <div className="shape shape__bottom"></div>
                  <div className="text-[11px] text-center pt-2">
                    <img className="block w-[60px] mb-1" src={item.image} />
                    {item.name}
                  </div>
                </div>
                <div className="center flex-1 p-3 pl-5 pr-3 border-l border-dashed text-left">
                  <div className="flex-item w-[100%] items-start">
                    <div>
                      <div className="font-semibold">{item.accountNumber}</div>
                    </div>
                    <div className="cursor-pointer absolute top-[-4px] right-[-1px]">
                      <Button className="btn-icon" onClick={removePayment}>
                        <AiFillCloseCircle
                          style={{ fontSize: "1.125rem", color: "#000000" }}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center py-4 w-[100%] center">
            <div>
              <img className="block mb-1" src={Images.errors.failData} />
            </div>
            <div className="mb-4 text-m text-center">
              Lưu lại thông tin thanh toán giúp bạn đặt hàng nhanh chóng và dễ
              dàng hơn
            </div>
            <div className="text-gray-99 mb-1 uppercase text-[11px] w-full text-center">
              <div className="contents items-center gap-3">
                <Button className="btn-main uppercase text-sm">
                  Tiếp tục mua sắm
                </Button>
              </div>
            </div>
          </div>
        )}
      </Row>
    </div>
  );
};

Payments.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default Payments;
