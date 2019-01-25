// importing packages
import React from 'react';

//importing components
import Navbar from '../navbar/navbar';
import Body from '../body/body';

class Home extends React.Component {
    render() {
        return(
            <div>
                <Navbar/>
                <Body/>
            </div>
        );
    }
}

export default Home;