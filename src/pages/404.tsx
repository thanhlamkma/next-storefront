import gsap, { Linear } from "gsap";
import { useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";

type Props = {
  type?: string;
};

const Custom404 = ({ type }: Props) => {
  const { t } = useTranslation();
  const cog1 = useRef(null);
  const cog2 = useRef(null);

  // wait until DOM has been rendered
  useEffect(() => {
    gsap.to(cog1.current, {
      transformOrigin: "50% 50%",
      rotation: "+=360",
      repeat: -1,
      ease: Linear.easeNone,
      duration: 8,
    });
    gsap.to(cog2.current, {
      transformOrigin: "50% 50%",
      rotation: "-=360",
      repeat: -1,
      ease: Linear.easeNone,
      duration: 8,
    });
  });

  return (
    <Draggable>
    <div
      id="page-not-found"
      className="w-full h-[100vh] flex items-center justify-center text-[30px] font-semibold"
    >
      <div className="container">
        <h1 className="first-four">4</h1>
        <div className="cog-wheel1">
          <div className="cog1" ref={cog1}>
          {/* <div className="cog1"> */}
            <div className="top"></div>
            <div className="down"></div>
            <div className="left-top"></div>
            <div className="left-down"></div>
            <div className="right-top"></div>
            <div className="right-down"></div>
            <div className="left"></div>
            <div className="right"></div>
          </div>
        </div>

        <div className="cog-wheel2">
          <div className="cog2" ref={cog2}>
          {/* <div className="cog2"> */}
            <div className="top"></div>
            <div className="down"></div>
            <div className="left-top"></div>
            <div className="left-down"></div>
            <div className="right-top"></div>
            <div className="right-down"></div>
            <div className="left"></div>
            <div className="right"></div>
          </div>
        </div>
        <h1 className="second-four">4</h1>
        <p className="wrong-para">Page not found!</p>
      </div>
    </div>
    </Draggable>
  );
};

export default Custom404;
