// Libraries
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/common/PrivateRoute';
import {setCurrentUser,signOutUser} from './actions/auth';

// Components
import Home from './components/home/home';
import Login from './components/login/login';
import AddIntent from './components/intent/addIntent';
import Register from './components/register/register';
import Entities from './components/entities/entities';
import Training from './components/training/training';
import Analytics from './components/analytics/analytics';
import Account from './components/account/account';

// Actions

// utils and others
import store from './store';

// Check for Token
if(localStorage.AccessToken){
  // set auth token header auth
  setAuthToken(localStorage.AccessToken);
  // decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.AccessToken);
  // Set current user
  store.dispatch(setCurrentUser(decoded));
  // check for expired token
  const currentTime = Date.now()/1000;
  if(decoded.exp < currentTime){
    // Logout user
    store.dispatch(signOutUser());
    // redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
    render(){
        return(
            <Provider store={store}>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path='/login' component={Login} />
                            <Route exact path='/register' component={Register} />
                            <PrivateRoute exact path='/intent' component={AddIntent} />
                            <PrivateRoute exact path='/' component={Home} />
                            <PrivateRoute exact path='/intent' component={AddIntent} />
                            <PrivateRoute exact path='/entities' component={Entities} />
                            <PrivateRoute exact path='/training' component={Training} />
                            <PrivateRoute exact path='/analytics' component={Analytics} />
                            <PrivateRoute exact path='/account' component={Account} />
                            <Route component={Login} />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
