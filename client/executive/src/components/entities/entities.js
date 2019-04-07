import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

class Entities extends React.Component {
    constructor() {
        super();
        this.state = {

        };
    }

    render() {
        return (
            <div>
                Entities
            </div>
        );
    }
}


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
)(Entities);