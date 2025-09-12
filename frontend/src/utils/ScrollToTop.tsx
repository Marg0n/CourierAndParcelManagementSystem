import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    //* Scroll to top on route change & on initial load
    window.scrollTo({ top: 0, behavior: "smooth" });
    //* window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;