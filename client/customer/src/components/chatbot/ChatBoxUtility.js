import React from 'react';
import './style.css';

import {Icon} from 'antd';

export const ChatBubble = ({mtag, message}) => {
    if(mtag === 'CLIENT'){
        return(
            <div className='bubble me'>
                {message}
            </div>
        );
    }
    else if(mtag === 'SERVER'){
        return (
            <div className='bubble you'>
                {message}
            </div>
        );
    }
    else if(mtag === 'LOADING'){
        return (
            <div className='bubble you'>
                <Icon type="sync" spin />
            </div>
        );
    }
};