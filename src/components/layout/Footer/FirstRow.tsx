import { Fragment } from "react";
import { useTranslation } from "react-i18next";

type Props = {};

const FirstRow = (props: Props) => {
  const { t } = useTranslation("layout");

  return (
    // <div className="first-row-footer-wrapper w-[100%] bg-hover-color py-[28px]">
    //   <RowContainer
    //     className="mx-[auto!important] xs:px-[12px] sm:px-[20px]"
    //     gutter={{
    //       lg: 24,
    //     }}
    //   >
    //     <Col
    //       className="left-footer-email-text flex xs:flex-col md:flex-row xs:justify-center mlg:justify-start items-center xs:mb-[20px] mlg:mb-0"
    //       xs={24}
    //       lg={12}
    //     >
    //       <MdOutlineMail
    //         className="mail-icon text-white  mr-[12px]"
    //         fontSize={50}
    //       />
    //       <div className="left-footer-text flex flex-col justify-center">
    //         <h1 className="text-white text-[16px] uppercase font-semibold xs:text-center md:text-left mb-0">
    //           {t("layout:subscribeNewsletter")}
    //         </h1>
    //         <span className="text-white text-[12px] xs:text-center sm:text-left">
    //           {t("layout:getInforEvents")}
    //         </span>
    //       </div>
    //     </Col>
    //     <Col className="right-email-input-group sm:py-[4px]" xs={24} lg={12}>
    //       {/* <div className=" flex xs:w-[100%] md:w-[75%] mlg:w-[100%] mx-auto xs:items-center xs:flex-col sm:flex-row">
    //         <input
    //           placeholder={t("layout:yourEmail")}
    //           className="email-input xs:leading-[24px] sm:leading-[26px] sm:flex-1 xs:w-[100%] sm:w-auto rounded-[4px] px-[20px] py-[8.5px] text-[#999]"
    //           type="text"
    //         />
    //         <button className="subcribe-btn xs:mt-[20px] sm:mt-0 sm:ml-[12px] flex items-center text-white font-semibold bg-[#333333] hover:opacity-90 rounded-[4px] px-[26px] py-[13px]">
    //           <span className="xs:text-[13px] xs:leading-[14px] sm:text-[15px] sm:leading-[15px] uppercase">
    //             {t("layout:subscribe")}
    //           </span>
    //           <HiArrowNarrowRight className="ml-[6px]" fontSize={18} />
    //         </button>
    //       </div> */}
    //     </Col>
    //   </RowContainer>
    // </div>
    <Fragment></Fragment>
  );
};

export default FirstRow;
