import { ConfigProvider } from "antd";
import "antd/dist/antd.css";
import faIR from "antd/es/locale/fa_IR";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import CheckAuth from "./CheckAuth";
import NotificationComponent from "./pages/NotificationComponent";

// to track maximize and minimize app
// import VisibilityTracker from "./VisibilityTracker ";

const isRunningStandalone = window.matchMedia(
  "(display-mode: standalone)"
).matches;
console.log(window.screen.width);
const customTableConfig = {
  table: {
    // Customize the global font size for the Table component
    fontSize: "18px",
  },
  // Additional configurations for other components can be added here
};

ReactDOM.render(
  <>
    {/* <VisibilityTracker /> */}
    <CheckAuth />
    
    <BrowserRouter>
      <ConfigProvider {...customTableConfig} direction="rtl" locale={faIR}>
        <App />
      </ConfigProvider>
    </BrowserRouter>

  </>,
  document.getElementById("root")
);

if (!isRunningStandalone && window.screen.width < 900) {
  // The app is opened in a browser, not in standalone mode
  showAddToHomeScreenMessage();
}

function showAddToHomeScreenMessage() {
  const messageContainer = document.createElement("div");
  messageContainer.style.position = "fixed";
  messageContainer.style.bottom = "0";
  messageContainer.style.left = "0";
  messageContainer.style.width = "100%";
  messageContainer.style.backgroundColor = "#f8d7da"; // Use your desired background color
  messageContainer.style.color = "#721c24"; // Use your desired text color
  messageContainer.style.padding = "10px";
  messageContainer.style.textAlign = "center";
  messageContainer.innerHTML =
    "برای تجربه بهتر برنامه را به صفحه اصلی موبایل خود اضافه کنید.";

  document.body.appendChild(messageContainer);
}
