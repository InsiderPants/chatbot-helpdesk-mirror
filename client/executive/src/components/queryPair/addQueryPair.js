import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect, withRouter } from 'react-router-dom';


class AddQueryPair extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }
    
    render() {
        return (
            <div>
            {
                this.props.executive.isAuthenticated
                ? 
                <div> Add Query Pair</div>
                :
                <div>
                    <Redirect to='/login'/>
                </div>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        executive: state.executive
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    };
};


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter,
)(AddQueryPair);