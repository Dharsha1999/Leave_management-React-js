import React from 'react';
import {
  Route,
} from 'react-router-dom';

import Authenticator from './Authenticator';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <Authenticator>
      <div className="container">
        <Component {...props} />      
      </div>
    </Authenticator>
  )}/>
)

export default PrivateRoute;
