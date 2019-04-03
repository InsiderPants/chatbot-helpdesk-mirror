//import libraries
import React from 'react';

//importing components
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

//CSS
const styles = theme => ({
    bubble: {
        fontSize: '16px',
        position: 'relative',
        display: 'inline-block',
        clear: 'both',
        marginBottom: '8px',
        padding: '13px',
        verticalAlign: 'top',
        borderRadius: '5px',
        '&:before': {
            position: 'absolute',
            top: '19px',
            display: 'block',
            width: '8px',
            height: '6px',
            content: " ",
            transform: 'rotate(29 deg) skew(-35 deg)',
        }
    },
    me: {
        float: 'right',
        color: '#1a1a1a',
        backgroundColor: '#b8c7da',
        alignSelf: 'flex-end',
        marginRight: '10px',
        // animation: 'slideFromRight 0.4s',
        '&:before': {
            right: '-3px',
            backgroundColor: '#b8c7da',
        }
    },
    you: {
        float: 'left',
        color:  '#fff',
        backgroundColor: '#103e7e',
        alignSelf: 'flex-start',
        // animation: 'slideFromLeft 0.4s',
        '&:before': {
            left: '-3px',
            backgroundColor: '#103e7e',
        }
    }
});


class RenderChat extends React.Component{
    
    render(){
        const {classes} = this.props;

        if(this.props.tag === 'executive'){
            return(
                <div className={`${classes.bubble} ${classes.me}`}>
                    {this.props.message}
                </div>
            );
        }
        else if(this.props.tag === 'user'){
            return(
                <div className={`${classes.bubble} ${classes.you}`}>
                    {this.props.message}
                </div>
            );
        }
        else if (this.props.tag === 'loading'){
            return(
                <div className={`${classes.bubble} ${classes.you}`}>
                    <CircularProgress color="inherit" size={20} thickness={3.0}/>
                </div>
            );
        }
    }  
}

export default withStyles(styles)(RenderChat);