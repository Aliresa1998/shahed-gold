import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
///import "./najva-messaging-sw";
import NotificationComponent from "./pages/NotificationComponent";
// import { Notifications } from 'react-push-notification';

import Setting from "./pages/Setting";
import Order from "./pages/Order";
import Home from "./pages/Home";
import Customer from "./pages/Customer";
import Price from "./pages/Price";
import Tables from "./pages/Tables";
import Billing from "./pages/Billing";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import SignInUser from "./pages/SignInUser";
import Main from "./components/layout/Main";
import NotFound from "./pages/NotFound";
import ChangePassword from "./pages/ChangePassword";
import CustomerCreateOrder from "./pages/CustomerCreateOrder";
import AdminMessage from "./pages/AdminMessage";
import CreateOrderByAdmin from "./pages/CreateOrderByAdmin";
// customer page
import CostomerOrderList from "./pages/CostomerOrderList";
import CustomerReport from "./pages/CustomerReport";
import Report from "./pages/Report";

import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { controller } from "./assets/controller/controller";
import { updateAtom } from './store';
import { useAtom } from 'jotai';
const App = () => {
  const location = useLocation(); // We get access to the location object using useLocation hook.

  // These routes are the only ones that will show the Main layout (including sidebar etc.)
  const mainLayoutRoutes = [
    // admin :
    "/admin-shahed/login",
    "/admin-messages",
    "/report",
    "/setting",
    "/price",
    "/order-management",
    "/change-password",
    "/dashboard",
    "/tables",
    "/billing",
    "/rtl",
    "/profile",
    "/customer-management",
    // customer :
    "/customer-order-list",
    "/customer-create-order",
    "/customer-report",
    "/create-order-admin",
  ];
  const showMainLayout =
    localStorage.getItem("user") &&
    mainLayoutRoutes.includes(location.pathname); // Check if the current path should use the Main layout

  const [checkUserToken, setCheckUserToken] = useState(false);
  // useEffect(() => {

  //     window.najvaUserSubscribed = function (najva_user_token, e) {
  //         console.log(najva_user_token);
  //         console.log(e);
  //         // you have user specific najva_user_token, add your logic here
  //     };
  // }, [])



  const [update, setUpdate] = useAtom(updateAtom);


  return checkUserToken ? (
    <> </>
  ) : (
    <div className="App">
      <NotificationComponent  />
      {/* <Notifications /> */}
      {/* <NotificationComponent /> */}
      <Switch>
        {/* Define routes that should not use the Main layout */}
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/sign-in" exact component={SignInUser} />
        <Route path="/admin-shahed/login" exact component={SignIn} />

        {/* Redirect root URL to "/sign-in" */}
        <Route exact path="/" render={() => <Redirect to="/sign-in" />} />

        {/* If the current path should use Main layout, render this Switch */}
        {showMainLayout && (
          <Main>
            {localStorage.getItem("isAdmin") &&
              localStorage.getItem("isAdmin") == "true" ? (
              <Switch>
                <Route exact path="/report" component={Report} />
                <Route exact path="/setting" component={Setting} />
                <Route
                  exact
                  path="/create-order-admin"
                  component={CreateOrderByAdmin}
                />
                <Route exact path="/order-management" component={Order} />
                <Route exact path="/dashboard" component={Home} />
                <Route exact path="/price" component={Price} />
                <Route exact path="/customer-management" component={Customer} />
                <Route exact path="/tables" component={Tables} />
                <Route exact path="/billing" component={Billing} />
                <Route exact path="/rtl" component={Rtl} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/admin-messages" component={AdminMessage} />
                <Route
                  exact
                  path="/change-password"
                  component={ChangePassword}
                />
                <Route path="*" component={NotFound} />
              </Switch>
            ) : (
              <Switch>
                <Route
                  exact
                  path="/customer-report"
                  component={CustomerReport}
                />
                <Route
                  exact
                  path="/customer-order-list"
                  component={CostomerOrderList}
                />
                <Route
                  exact
                  path="/change-password"
                  component={ChangePassword}
                />
                <Route
                  exact
                  path="/customer-create-order"
                  component={CustomerCreateOrder}
                />
                <Route path="*" component={NotFound} />
              </Switch>
            )}
          </Main>
        )}

        {/* If the current path should NOT use Main layout (including for 404 NotFound), render this Route */}
        {!showMainLayout && <Route path="*" component={NotFound} />}
      </Switch>
    </div>
  );
};

export default App;
