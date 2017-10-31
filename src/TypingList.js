import React from 'react';

export default (props) => {
    console.log(props);
    // let item = data.item;
    return(
        <div className="typing">
            <span className="typing-title">Typing...</span>
            {props.list.map((item, index)=><span className="typing-name" key={index}>{item} </span>)}
        </div>
    )
}