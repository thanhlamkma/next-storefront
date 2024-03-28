import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  contactAndService,
  ContactAndServiceDataType,
} from "src/components/layout/Header/ThirdRow/mockData";

type Props = {};

const ContactAndServiceComponent: React.FC<{
  data: ContactAndServiceDataType;
}> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="title-contact-service pb-[6px] mb-[20px] text-[14.5px] leading-[14.5px] font-semibold uppercase">
        {t(data.title)}
      </h1>
      <ul className="cluster-contact-service">
        {data &&
          data.items?.map((item) => {
            return (
              <li
                className="item-contact-service mb-[15px] text-[13px] leading-[14px] text-[#666]"
                key={`${contactAndService[0].title}-${item}`}
              >
                {item}
              </li>
            );
          })}
      </ul>
    </>
  );
};

const SecondRow = ({}: Props) => {
  const { t } = useTranslation("layout");
  return (
    // <div className="second-row-footer-wrapper w-[100%] pt-[68px] pb-[8px]">
    //   <RowContainer className="second-row-footer px-[20px]">
    //     <Col xs={24} lg={13}>
    //       <Row>
    //         <Col className="mb-[40px]" sm={12} xs={24} lg={16}>
    //           <div className="footer-logo">
    //             {/* <Image
    //               className="w-[100%]"
    //               src={Images.logo.pageWolmartLogoPC}
    //               objectFit="contain"
    //               width={220}
    //               height={45}
    //             /> */}
    //           </div>
    //           <span className="text-1 text-[12px] leading-[27px] mb-[10px] block">
    //             {t("layout:gotQuestionAndCall")}
    //           </span>
    //           <h1 className="phone-number text-[18px] font-semibold mb-[10px]">
    //             1-800-570-7777
    //           </h1>
    //           <p className="text-2 text-[13px] leading-[28px] mb-[20px] max-w-[280px]">
    //             {t("layout:reminder")}
    //           </p>
    //           <ul className="social flex">
    //             {social.map((item) => {
    //               const Icon = genIcon[item.name as SocialNametype];
    //               return (
    //                 Icon && (
    //                   <li
    //                     key={item.name}
    //                     style={{
    //                       backgroundColor: item.color,
    //                     }}
    //                     className={`social-icon rounded-[16px] p-[4px]`}
    //                   >
    //                     <Icon fontSize={22} className="text-white" />
    //                   </li>
    //                 )
    //               );
    //             })}
    //           </ul>
    //         </Col>
    //         <Col className="mb-[40px]" sm={12} xs={24} lg={8}>
    //           <ContactAndServiceComponent data={contactAndService[0]} />
    //         </Col>
    //       </Row>
    //     </Col>
    //     <Col xs={24} lg={11}>
    //       <Row>
    //         <Col
    //           className="mb-[40px]"
    //           lg={{
    //             span: 9,
    //             offset: 3,
    //           }}
    //           sm={12}
    //           xs={24}
    //         >
    //           <ContactAndServiceComponent data={contactAndService[1]} />
    //         </Col>
    //         <Col
    //           className="mb-[40px]"
    //           lg={{
    //             span: 9,
    //             offset: 3,
    //           }}
    //           sm={12}
    //           xs={24}
    //         >
    //           <ContactAndServiceComponent data={contactAndService[2]} />
    //         </Col>
    //       </Row>
    //     </Col>
    //   </RowContainer>
    // </div>
    <Fragment></Fragment>
  );
};

export default SecondRow;
