import React from "react";
import FirstRow from "src/components/layout/Footer/FirstRow";
import FourthRow from "src/components/layout/Footer/FourthRow";
import SecondRow from "src/components/layout/Footer/SecondRow";
import ThirdRow from "src/components/layout/Footer/ThirdRow";

type Props = {};

const Footer = ({}: Props) => {
  return (
    <div id="footer">
      <FirstRow />
      <SecondRow />
      <ThirdRow />
      <FourthRow />
    </div>
  );
};

export default Footer;
