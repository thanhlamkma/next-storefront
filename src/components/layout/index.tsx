import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineArrowDropUp } from "react-icons/md";
import Images from "src/assets/images";
import Footer from "src/components/layout/Footer";
import Header from "src/components/layout/Header";
import CartSideBar from "src/components/layout/Header/CartSideBar";
import LeftSideBar from "src/components/layout/Header/LeftSideBar";
interface LayoutProps {
  children: any;
}

const Layout = ({ children }: LayoutProps) => {
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const [showCardSideBar, setShowCartSideBar] = useState<boolean>(false);
  const scrollToTopRef = useRef<HTMLDivElement | null>(null);
  const a = 26 * Math.PI * 2;
  const circleRef = useRef<SVGCircleElement | null>(null);

  const calculateCircleProgress = useCallback(() => {
    if (circleRef.current) {
      const html = document.documentElement;
      const percent = (window.scrollY + window.innerHeight) / html.scrollHeight;

      const radius = circleRef.current.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      circleRef.current.style.strokeDasharray = `${circumference} ${circumference}`;
      circleRef.current.style.strokeDashoffset = circumference.toString();

      circleRef.current.style.strokeDashoffset = (
        circumference -
        percent * circumference
      ).toString();
    }
  }, [circleRef]);

  useEffect(() => {
    const showScrollToTop = (e: Event) => {
      if (scrollToTopRef.current) {
        if (window.scrollY > 300) {
          scrollToTopRef.current.classList.add("show-scroll-to-top-btn");

          calculateCircleProgress();
        } else {
          scrollToTopRef.current.classList.remove("show-scroll-to-top-btn");
        }
      }
    };
    window.addEventListener("scroll", showScrollToTop);
  }, [scrollToTopRef]);
  return (
    <div id="layout">
      <Head key={1234}>
        <link rel="icon" href={Images.icons.iconHeader} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="crossorigin"
        />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        ></link> */}
      </Head>
      <Header
        setShowSideBar={setShowSideBar}
        setShowCardSidebar={setShowCartSideBar}
      />
      <LeftSideBar show={showSideBar} setShow={setShowSideBar} />
      <CartSideBar show={showCardSideBar} setShow={setShowCartSideBar} />
      <div
        ref={scrollToTopRef}
        className="scroll-to-top-btn z-999 cursor-pointer hover:opacity-90 w-[40px] h-[40px] rounded-[30px] fixed z-[9999] bottom-[-5%] right-[2.5%] opacity-0  bg-[#333] text-white"
        onClick={() => {
          const header = document.getElementById("header");
          if (header) {
            header.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }}
      >
        <MdOutlineArrowDropUp className="scroll-to-top-arrow" fontSize={40} />
        <svg className="progress-ring" width="40" height="40">
          <circle
            ref={circleRef}
            className="progress-ring__circle"
            strokeDashoffset={a}
            stroke="#2C67E7"
            strokeWidth="2"
            fill="transparent"
            r="16"
            cx="20"
            cy="20"
          />
        </svg>
      </div>
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
