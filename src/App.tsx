import { useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tappstate } from "./redux/reducers";
import { checkUserLogined, getUserRole, showMessageAction } from './redux/Actions'
import apiRequest from "./Service/apiRequest";
import { Home, Project } from "./pages";
import MessageModal from "./Components/MessageModal/MessageModal";
import "./styles/index.scss";
const App = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: Tappstate) => state.userRole);
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
      createExternalUserOrganization()
    }, [userRole]
  );

  //check first time user login, does he have a organiztion, if so that skip, else create a organization
  const createExternalUserOrganization = async () => {
    let isOwner: boolean = false;
    userRole?.organizations.forEach((each: any) => {
      if (each?.role.includes('owner')) {
        isOwner = true;
        return;
      }
    });
    if (userRole && (!isOwner)) {
      const res = await apiRequest({
        url: '/api/fhapp-service/organization',
        method: 'POST'
      })
      if (res?.message === "An internal user cannot create an organization, contact a Fulhaus admin to invite you to Fulhaus organization") {
        dispatch(
          showMessageAction(
            true,
            "An internal user cannot create an organization, contact a Fulhaus admin to invite you to Fulhaus organization"
          )
        )
        return;
      }
      if (res?.success) {
        dispatch(getUserRole());
      } else {
        console.log(res?.message);
      }
    }
  }

  return (
    <>
      <MessageModal />
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
