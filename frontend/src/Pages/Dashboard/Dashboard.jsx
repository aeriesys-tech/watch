import React from "react";

import Bespoke_logo_svg from "../../Assets/assets/img/Bespoke_logo_svg 1.png";
import Sidebar from "../../Components/Sidebar/Sidebar";

function Dashboard() {
  return (
    <>
      <Sidebar />

      <div class="main main-app p-3 p-lg-4">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div>
            <ol class="breadcrumb fs-sm mb-1">
              <li class="breadcrumb-item">
                <a href="s">Dashboard</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                Website Analytics
              </li>
            </ol>
            <h4 class="main-title mb-0">Welcome to Dashboard</h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
