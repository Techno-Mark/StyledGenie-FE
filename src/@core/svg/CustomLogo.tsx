// React Imports
import type { SVGAttributes } from "react";

const CustomLogo = ({ collapsed }: { collapsed: boolean }) => {
  if (!collapsed) {
    return (
      <img
        src="/images/styledgenie.png"
        className="w-[110px] h-[30px]"
      />
    );
  }
  return <img src="/images/icon.png" className="h-[30px]" />;
};

export default CustomLogo;
