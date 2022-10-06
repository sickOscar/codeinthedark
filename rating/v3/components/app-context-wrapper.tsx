import { createContext, useEffect, useState, ReactNode } from "react";
import io, { Socket } from "socket.io-client";
import * as auth0 from "auth0-js";
import Head from "next/head";

// -----------------------------------
// USER
// -----------------------------------

export type User = {
  isAuthenticated: boolean;
  username: string;
};

export const UserContext = createContext<User | undefined>(undefined);


// -----------------------------------
// SOCKET
// -----------------------------------
//const HOST = "http://localhost:3000";
export const HOST = "https://admin.codeinthedark.interlogica.it/";
export const SocketContext = createContext<Socket | undefined>(undefined);



export function AppContextWrapper({ children }: { children?: ReactNode }) {

  const [user, setUser] = useState<User>({
    isAuthenticated: false,
    username: "",
  });

  const [expiredAt, setExpiredAt] = useState<string>("1");

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const isExpired = new Date().getTime() > parseInt(localStorage.getItem("expires_at") || "1");

    if (isExpired) {

      const webAuth = new auth0.WebAuth({
        domain: process.env.authUrl ?? "",
        clientID: process.env.authClientId ?? "",
        responseType: "token id_token",
        scope: "openid",
        redirectUri: `${location.protocol}//${location.host}${location.port && location.host.indexOf(":") === -1 ? `:${location.port}` : ""}`,
      });

      webAuth.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {

          const expiresAtCalc = JSON.stringify((authResult.expiresIn ?? 2000) * 1000 + new Date().getTime());
          localStorage.setItem("access_token", authResult.accessToken);
          localStorage.setItem("id_token", authResult.idToken);
          localStorage.setItem("expires_at", expiresAtCalc);
          setExpiredAt(expiresAtCalc);

          webAuth.client.userInfo(authResult.accessToken, (err, profile) => {
            localStorage.setItem("username", profile.sub);
            setUser({ username: profile.sub, isAuthenticated: true });
          });

        } else if (err) {
          console.log(err);
          console.log(err.errorDescription);
        } else {
          console.log("webAuth.authorize");
          webAuth.authorize();
        }
      });
    } else {
      setUser({ isAuthenticated: true, username: localStorage.getItem("username") ?? "" })
    }


    if (!isExpired && !socket) {
      const s = io(HOST, { transports: ["websocket"], reconnection: true });
      setSocket(s);
    }
  }, [expiredAt, socket]);

  return (
    <>
      <Head>
        <style>
          @import
          url("https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@500&display=swap");
        </style>
      </Head>

      <SocketContext.Provider value={socket}>
        <UserContext.Provider value={user}>
          {children}
        </UserContext.Provider>
      </SocketContext.Provider>
    </>
  )
}
