// Libraries
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';

// Components
import Home from './components/home/home';
import Login from './components/login/login';
import AddIntent from './components/intent/addIntent';
import Register from './components/register/register';
import Entities from './components/entities/entities';
import Training from './components/training/training';
import Analytics from './components/analytics/analytics';
import Account from './components/account/account';
import PrivateRoute from './components/common/PrivateRoute';

// Actions
import {setCurrentUser,signOutUser} from './actions/auth';

// utils and others
import setAuthToken from './utils/setAuthToken';
import store from './store';

// Check for token in local storage
if(localStorage.AccessToken){
  // Set auth token header auth
  setAuthToken(localStorage.AccessToken);
  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.AccessToken);
  // Set current user
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now()/1000;
  if(decoded.exp < currentTime){
    // Logout user
    store.dispatch(signOutUser());
    // Redirect to login
    window.location.href = 'executive/login';
  }
}

class App extends Component {
    render(){
        return(
            <Provider store={store}>
                <Router basename='executive/'>
                    <div>
                        <Switch>
                            <Route exact path='/login' component={Login} />
                            <Route exact path='/register' component={Register} />
                            <PrivateRoute exact path='/intent' component={AddIntent} />
                            <PrivateRoute exact path='/' component={Home} />
                            <PrivateRoute exact path='/entities' component={Entities} />
                            <PrivateRoute exact path='/training' component={Training} />
                            <PrivateRoute exact path='/analytics' component={Analytics} />
                            <PrivateRoute exact path='/account' component={Account} />
                            {/* Default route */}
                            <Route component={Login} />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
