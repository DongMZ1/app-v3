import { useEffect, useState } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tappstate } from "./redux/reducers";
import { checkUserLogined, getUserRole, showMessageAction } from './redux/Actions'
import apiRequest from "./Service/apiRequest";
import { Home, Project, VerifyEmail } from "./pages";
import MessageModal from "./Components/MessageModal/MessageModal";
import "./styles/index.scss";
const App = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: Tappstate) => state.userRole);
  const [verifyUser, setverifyUser] = useState(false);
  //get role first
  useEffect(
    () => {
      dispatch(checkUserLogined(window.location.href));
      dispatch(getUserRole());
    }, [verifyUser]
  );
  useEffect(
    () => {
      createExternalUserOrganization()
    }, [userRole, verifyUser]
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
    let hasFulhausOrganization = userRole?.organizations.some(each => each.organization.name === 'Fulhaus');
    //first check if userRole is fetched, if has fulhaus organization, then this person must have already login as a internal user, as external user cannot be invited to fulhaus organizaton, therefore we do not need to create a organization
    if (userRole && (!isOwner) && (!hasFulhausOrganization)) {
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
        <Route exact path={`/view-budget/rental`} component={Project} />
        <Route exact path={`/quote-only`} component={Project} />
        <Route exact path={`/design-only`} component={Project} />
        <Route exact path={`/verify-invite`} >
          <VerifyEmail setverifyUser={setverifyUser} />
        </Route>
      </Switch>
    </>
  )
};

export default withRouter(App);
