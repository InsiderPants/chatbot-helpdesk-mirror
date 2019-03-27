// importing packages
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

//components
import Body from '../body/body';


class Home extends React.Component {

    render() {
        //console.log(this.props.executive.isAuthenticated)
        return(
            <div>
                {
                    //checking if executive is authencated or not
                    localStorage.getItem('AccessToken') !== null ?
                    <Body />
                    :
                    <Redirect to='/login'/> 
                }      
            </div>
        );
    }
}

//connecting to redux
const mapStateToProps = (state) => {
    return {
        executive: state.executive
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);