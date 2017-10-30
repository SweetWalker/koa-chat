import React from 'react';

export default (data) => {
    console.log(data.item);
    let item = data.item;
    return(
        <div className="message">
            <img src={item.photo} className="message-photo" />
            <span className="message-name"> {item.name} </span>
            <span className="message-body"> {item.text} </span>
            <span className="message-date"> {item.date} </span>
        </div>
    )
}