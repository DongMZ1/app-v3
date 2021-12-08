import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { APP_ACCOUNTS_URL } from './Constant/url.constant'
import apiRequest from "./Service/apiRequest";
import { Home, Project } from "./pages";
import "./styles/index.scss";
const App = () => {
  const dispatch = useDispatch();
  useEffect(
    () => {
      const checkUserLogined = async () => {
        const res = await apiRequest({
          url: '/account/user',
          method: 'GET'
        })
        if (!res?.success) {
          window.location.assign(`${APP_ACCOUNTS_URL}/login`)
        } else {
          dispatch(
            {
              type: "userInfo",
              payload: res.data
            }
          )
        }
      }
      checkUserLogined();
    }, []
  );
  return (
    <>
      <Switch>
        <Route exact path={`/`} component={Home} />
        <Route exact path={`/project/quote`} component={Project} />
        <Route exact path={`/project/design`} component={Project} />
        <Route exact path={`/quote-only`} component={Project} />
        <Route exact path={`/design-only`} component={Project} />
      </Switch>
    </>
  )
};

export default withRouter(App);
