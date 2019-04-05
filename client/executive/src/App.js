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
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/register' component={Register}/>
                        <Switch>
                            <PrivateRoute exact path = '/intent' component ={AddIntent} />
                            <PrivateRoute exact path='/' component={Home}/>
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
