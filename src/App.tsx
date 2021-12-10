import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tappstate } from "./redux/reducers";
import {checkUserLogined, getUserRole} from './Service/APIs'
import apiRequest from "./Service/apiRequest";
import { Home, Project } from "./pages";
import "./styles/index.scss";
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
      //if userInfo updated then check if this external user has a organization, if not then create one, have to wait until userInfo updated to call this function
      setTimeout(() =>
      createExternalUserOrganization(), 5000)
    }, [state.userRole]
  );

  //check first time user login, does he have a organiztion, if so that skip, else create a organization
  const createExternalUserOrganization = async () => {
    let isOwner:boolean = false;
    state?.userRole?.organizations.forEach((each: any) => {if(each?.role.includes('owner')){
      isOwner = true;
      return;
    }});
    //if his userRole data is fetched and not a external user and not a owner for any organization
    if (state?.userInfo?.type?.includes('external') && (!isOwner) && state.userRole) {
      const res = await apiRequest({
        url: '/api/fhapp-service/organization',
        method: 'POST'
      })
      if(res?.success){
      dispatch(getUserRole());
      }else{
        console.log('create organization failed')
      }
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
