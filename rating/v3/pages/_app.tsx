import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppContextWrapper } from "../components/context/app.context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextWrapper>
      <Component {...pageProps} />
    </AppContextWrapper>
  );
}

export default MyApp;
