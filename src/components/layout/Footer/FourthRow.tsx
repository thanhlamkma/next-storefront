import Image from "next/image";
import { useTranslation } from "react-i18next";
import Images from "src/assets/images";
import Container from "src/components/Container";

type Props = {};

function FourthRow({}: Props) {
  const { t } = useTranslation("layout");
  return (
    <div className="footer-fourth-row-wrapper border-t">
      <Container className="footer-fourth-row py-[20px] xs:flex-col md:flex-row flex justify-between items-center">
        <div className="copyright-text-side text-[13.6px]">
          Copyright © 2022 Tii24h.com. All Rights Reserved.
        </div>
        <div className="payment-side xs:flex-col md:flex-row flex items-center">
          <div className="payment-text text-[13.6px]">
            {t("layout:salePaymentFor")}
          </div>
          <div className="payment-img ml-2">
            <Image
              src={Images.logo.paymentLogo}
              width={159}
              height={25}
              objectFit="contain"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default FourthRow;
