import type { Metadata } from "next";

import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";
import AdminMessage from "@/socket/AdminMessage";

export const metadata: Metadata = {
  title: "Snapcart | 10 minutes grocery Delivery App",
  description: "10 minutes grocery Delivery App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full ">
        <Provider>
          <StoreProvider>
            <InitUser />
            <AdminMessage>{children}</AdminMessage>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
