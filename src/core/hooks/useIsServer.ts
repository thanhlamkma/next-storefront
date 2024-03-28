import { useRef } from "react";
import getIsServer from "src/core/utilities/getIsServer";

export default function useIsServer() {
  const isServer = useRef(getIsServer());

  return isServer.current;
}
