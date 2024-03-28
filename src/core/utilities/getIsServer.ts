export default function getIsServer() {
  return typeof window === "undefined";
}
