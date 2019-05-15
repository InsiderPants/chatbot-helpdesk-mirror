// importing packages
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

//components
import Body from '../body/body';


class Home extends React.Component {

    render() {
        return(
            <div>
                {
                    // Checking if executive is authenticated or not
                    localStorage.getItem('AccessToken') !== null ?
                    <Body />
                    :
                    <Redirect to='/login'/> 
                }      
            </div>
        );
    }
}

// Connecting to redux
const mapStateToProps = (state) => {
    return {
        executive: state.executive
    };
};

// Mapping dispatch to props
const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);