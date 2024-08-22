import React from "react";
// import Forbidden from "../pages/Forbidden";
import ForgotPassword from "../auth/ForgotPassword";
import ChangePassword from "../auth/ChangePassword";
// import InternalServerError from "../pages/InternalServerError";
// import LockScreen from "../pages/LockScreen";
import NotFound from "../pages/NotFound";
// import ServiceUnavailable from "../pages/ServiceUnavailable";
import Signin from "../auth/Signin";
// import Signup from "../pages/Signup";
// import VerifyAccount from "../pages/VerifyAccount";

const publicRoutes = [
  { path: "auth/login", element: <Signin /> },
  // { path: "auth/signup", element: <Signup /> },
  // { path: "pages/verify", element: <VerifyAccount /> },
  { path: "auth/forgot", element: <ForgotPassword /> },
  { path: "auth/reset", element: <ChangePassword /> },
  // { path: "pages/lock", element: <LockScreen /> },
  { path: "auth/error-404", element: <NotFound /> },
  // { path: "pages/error-500", element: <InternalServerError /> },
  // { path: "pages/error-503", element: <ServiceUnavailable /> },
  // { path: "pages/error-505", element: <Forbidden /> }
];

export default publicRoutes;