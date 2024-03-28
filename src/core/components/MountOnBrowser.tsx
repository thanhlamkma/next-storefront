import { memo, ReactNode } from "react";

interface MountOnBrowserProps {
  children: ReactNode;
}

const MountOnBrowser = memo(({ children }: MountOnBrowserProps) => {
  return <>{typeof window !== "undefined" && children}</>;
});

export default MountOnBrowser;
