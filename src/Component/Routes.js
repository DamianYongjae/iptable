import React from "react";
// import PropTypes from "prop-types";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import ExportBlack from "../Routes/ExportBlack";
import ExportWhite from "../Routes/ExportWhite";
import Tables from "../Routes/Tables";

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Tables}></Route>
      <Route path="/exportBlack" component={ExportBlack} />
      <Route path="/exportWhite" component={ExportWhite} />
    </Switch>
  </Router>
);

export default Routes;

// const AppRouter = ({ isLoggedIn }) =>
//   isLoggedIn ? <LoggedInRoutes /> : <LoggedoutRoutes />;

// AppRouter.protoTypes = {
//   isLoggedIn: PropTypes.bool.isRequired
// };

// export default AppRouter;
