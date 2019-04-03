// Libraries
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

// Components
import Home from './components/home/home';
import Login from './components/login/login';
import AddIntent from './components/intent/addIntent';
import Register from './components/register/register';

// Actions

// utils and others
import store from './store';

class App extends Component {
    render(){
        return(
            <Provider store={store}>
                <Router>
                    <div>
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/register' component={Register}/>
                        <Route exact path='/addintent' component={AddIntent}/>
                        <Route exact path='/' component={Home}/>
                    </div>
                </Router>
            </Provider>
          );
      }
}

export default App;
