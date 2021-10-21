import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { Home } from './pages';
import './styles/index.scss';

const App = () => {
  return (
    <>
      <Switch>
        <Route exact path={`/`} component={Home} />
      </Switch>
    </>
  );
};

export default withRouter(App);
