// Libraries
import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux';

// Components
// import Navbar from './components/navbar/navbar';
import {Home} from './components/home/home';

// Actions

// utils and others
import store from './store';

class App extends Component{
    render(){
        return(
            <Provider store={store}>
              <Router>
                <Home/>
              </Router>
            </Provider>
        );
    }
}

export default App;
