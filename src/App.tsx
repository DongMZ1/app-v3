import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { Home, Project, StartNewProject } from "./pages";
import "./styles/index.scss";
import { appUrl, accountsPageUrl } from "./Constant/url.constant";
const App = () => {
  const loginState = true;
  useEffect(
    () => {
      if(!loginState){
        //open app url
        window.location.assign('http://www.google.com');
      }
    },[]
  );
  return loginState ? (
    <>
      <Switch>
        <Route exact path={`/`} component={Home} />
        <Route exact path={`/project/quote`} component={Project} />
        <Route exact path={`/project/design`} component={Project} />
        <Route exact path={`/start-new-project`} component={StartNewProject} />
      </Switch>
    </>
  ) : (
    <Redirect to={`/404`} />
  );
};

export default withRouter(App);
