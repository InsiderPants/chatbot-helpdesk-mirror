// Libraries
import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';

// Components
import Navbar from './components/navbar/navbar';
import Home from './components/home/home';

// Actions

// utils and others
import store from './store';

class App extends Component{
    render(){
        return(
            <Provider store={store}>
              <Router>
                <div>
                    <Route exact path='/' component={Home}/>
                </div>
              </Router>
            </Provider>
        );
    }
}

export default App;
