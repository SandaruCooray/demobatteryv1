//* This layout goint to wrap to aal componenets
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        // console.log({ user });
      }

      // Continue processing with the 'user' object
    } catch (error) {
      console.error("Error parsing user JSON data:", error);
      // Handle the error or provide a default value
    }
  }, []);

  /*  Outlet let you Have multiple children under (in) it*/
  return (
    <div>
      {/* <div styles={{}}>{!showAdminBoard &&  currentUser && <CustomerMsgList />}</div> */}
      <Outlet />
    </div>
  );
};
export default Layout;
