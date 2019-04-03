import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, Redirect } from 'react-router-dom';

import RenderIntent from './renderIntent';

const AddIntent = (props) => {
    return (
        <div>
            {
                //console.log(localStorage.getItem('AccessToken') + ' From addintent.js')
                localStorage.getItem('AccessToken') !== null 
                ?
                <RenderIntent/>
                :
                <Redirect to='/login' />   
            }
        </div>
    );
}

//connecting to redux
const mapStateToProps = (state) => {
    return {

    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    };
};


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter,
)(AddIntent);
