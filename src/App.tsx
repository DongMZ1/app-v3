import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tappstate } from "./redux/reducers";
import {checkUserLogined, getUserRole} from './Service/APIs'
import apiRequest from "./Service/apiRequest";
import { Home, Project } from "./pages";
import "./styles/index.scss";
import { userInfo } from "os";
import { stat } from "fs";
const App = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: Tappstate) => state)
  //get role first
  useEffect(
    () => {
        dispatch(checkUserLogined());
        dispatch(getUserRole());
    }, []
  );
  useEffect(
    () => {
      //if userInfo updated then check if this external user has a organization, if not then create one, have to wait for 5 second to let other data get fetched first
      setTimeout(
        () => {
          createExternalUserOrganization();
        }
        , 5000)
    }, [state.userInfo]
  );

  //check first time user login, does he have a organiztion, if so that skip, else create a organization
  const createExternalUserOrganization = async () => {
    let isOwner:boolean = false;
    state?.userRole?.organizations.forEach((each: any) => {if(each?.role.includes('owner')){
      isOwner = true;
    }});
    if (state?.userInfo?.type?.includes('external') && (!isOwner)) {
      const res = await apiRequest({
        url: '/api/fhapp-service/organization',
        method: 'POST'
      })
      dispatch(getUserRole());
    }
  }

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
