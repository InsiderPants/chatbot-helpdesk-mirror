// importing packages
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

//importing components
import Navbar from '../navbar/navbar';
import Body from '../body/body';

class Home extends React.Component {

    constructor(){
        super();

        this.checkAuth = this.checkAuth.bind(this);
    }

    checkAuth() {        
        if (this.props.executive.isAuthenticated === false){
            this.props.history.push('/login');
        }
    }

    render() {
        this.checkAuth();
        return(
            <div style={{minHeight: '100vh', backgroundImage: 'linear-gradient(#7390b8 , #003141)',}}>
                <Navbar/>
                <Body/>
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
    withRouter
)(Home);