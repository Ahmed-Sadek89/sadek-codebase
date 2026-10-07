import React from "react";
import { Header } from "./components/header";

const AuthPageLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default AuthPageLayoutWrapper;
