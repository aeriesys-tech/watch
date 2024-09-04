import React from "react";
import Sidebar from "../Components/Sidebar/Sidebar";

function Layout({ children }) {
  return (
    <div>
      <div>
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
