import React from "react";
import BannerTop from "src/components/layout/Header/BannerTop";
import FirstRow from "src/components/layout/Header/FirstRow";
import SecondRow from "src/components/layout/Header/SecondRow";
import ThirdRow2 from "src/components/layout/Header/ThirdRow2";

type Props = {
  setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCardSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ setShowSideBar, setShowCardSidebar }: Props) => {
  return (
    <div id="header" className="flex flex-col">
      <BannerTop />
      <FirstRow />
      <SecondRow
        setShowSideBar={setShowSideBar}
        setShowCartSideBar={setShowCardSidebar}
      />
      <ThirdRow2 />
    </div>
  );
};

export default Header;
