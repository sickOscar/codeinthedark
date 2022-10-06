import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppContextWrapper } from "../components/app-context-wrapper";
import LogoHeader from "../components/logo-header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="fullview flex flex-col">
      <LogoHeader />
      <AppContextWrapper>
        <div className="flex-1 overflow-y-auto">
          <Component {...pageProps} />
        </div>
      </AppContextWrapper>
    </div>
  );
}

export default MyApp;
