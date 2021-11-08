import React, { useState } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { Home } from "./pages";
import "./styles/index.scss";
import { appUrl, accountsPageUrl } from "./Constant/url.constant";
const App = () => {
  const loginState = true;
  return loginState ? (
    <>
      <Switch>
        <Route exact path={`/`} component={Home} />
      </Switch>
    </>
  ) : (
    <Redirect to={`/404`} />
  );
};

export default withRouter(App);
