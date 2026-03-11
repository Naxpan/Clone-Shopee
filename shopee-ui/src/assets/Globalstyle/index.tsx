import { JSX } from "react";
import "./GlobalStyles.scss";

function GlobalStyles({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <>{children}</>;
}

export default GlobalStyles;
