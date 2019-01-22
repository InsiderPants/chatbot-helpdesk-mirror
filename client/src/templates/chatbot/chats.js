import React from 'react';

const Chats = (props) => {
    return props.item.map((item, key) => {
        return(
            <div key={key} style={{position: 'relative'}}>
                {item.text}
                <br/>
                {item.reply}
            </div>
        );
    })
}

export default Chats;