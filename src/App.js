import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/basiccomponents/Layout/Layout";

import TestScreen from "./components/screencomponents/TestScreen/TestScreen";

import EventBus from "./common/EventBus";

import { GlobalStateProvider } from "./global/global";

function App() {


  const [currentUser, setCurrentUser] = useState(false);

  const logOut = () => {
    localStorage.removeItem("user");


    setCurrentUser(undefined);
  };

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        console.log({ user });

        setCurrentUser(user);

    
      }

      // Continue processing with the 'user' object
    } catch (error) {
      console.error("Error parsing user JSON data:", error);
      // Handle the error or provide a default value
    }

    // if (
    //   window.location.pathname === "/mcq" ||
    //   window.location.pathname === "/sellstock" ||
    //   window.location.pathname === "/inquiry" ||
    //   window.location.pathname === "/consult"
    // ) {
    //   console.log(window.location.pathname);
    // } else {
    //   console.log(window.location.pathname);
    //   navigate("/");
    // }

    // console.log("crr window path -> ", window.location.pathname);

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  let content = null;

  content = (
    <>
      <GlobalStateProvider>
        <Routes>
          {!currentUser ? (
            <Route path="/" element={<Layout />}>
              <Route index element={<TestScreen />} />{" "}
              {/* Updated to Home for QR scanning */}
              <Route path="sn/:serialNumber" element={<TestScreen />} />{" "}
              {/* Battery details route */}
            </Route>
          ) : (
            <>
              <Route path="/" element={<Layout />}>
                <Route index element={<TestScreen />} />{" "}
                {/* Updated to Home for QR scanning */}
                <Route path="sn/:serialNumber" element={<TestScreen />} />{" "}
                {/* Battery details route */}
              </Route>
            </>
          )}
        </Routes>
      </GlobalStateProvider>
    </>
  );

  return content;
}

export default App;
