import { useEffect, useState } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tappstate } from "./redux/reducers";
import { checkUserLogined, getUserRole, showMessageAction } from './redux/Actions'
import apiRequest from "./Service/apiRequest";
import { Home, Project, VerifyEmail } from "./pages";
import { useIdleTimer } from 'react-idle-timer'
import MessageModal from "./Components/MessageModal/MessageModal";
import "./styles/index.scss";
import { Loader } from "@fulhaus/react.ui.loader";
import { Popup } from "@fulhaus/react.ui.popup";
const App = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state: Tappstate) => state.userRole);
  const appLoader = useSelector((state: Tappstate) => state.appLoader);
  const [verifyUser, setverifyUser] = useState(false);
  //will refresh page if user is inactive for 30min
  useIdleTimer({
    timeout: 1000 * 60 * 30,
    onActive: () => window.location.reload(),
    debounce: 500
  })
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
      <Popup allowCloseOnClickOutside={false} horizontalAlignment="center" boxShadow={false} verticalAlignment="center" show={appLoader}>
        <div className="flex items-center justify-center bg-transparent w-96 h-96">
          <Loader />
        </div>
      </Popup>
      <MessageModal />
      <Switch>
        <Route exact path={`/`} component={Home} />
        <Route exact path={`/project/quote`} component={Project} />
        <Route exact path={`/project/design`} component={Project} />
        <Route exact path={`/view-budget/rental`} component={Project} />
        <Route exact path={`/quote-only`} component={Project} />
        <Route exact path={`/design-only`} component={Project} />
        <Route exact path={'/quote-summary-rental'} component={Project} />
        <Route exact path={'/quote-summary-purchase'} component={Project} />
        <Route exact path={`/verify-invite`} >
          <VerifyEmail setverifyUser={setverifyUser} />
        </Route>
      </Switch>
    </>
  )
};

export default withRouter(App);
