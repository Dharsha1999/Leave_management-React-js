import React from 'react';

import {
  Route,
} from 'react-router-dom';

import Authenticator from './Authenticator';

const NonPrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <Authenticator reverse={true}>
      <div className="container">
        <Component {...props}/>
      </div>
    </Authenticator>
  )}/>
)

export default NonPrivateRoute;