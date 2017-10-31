import React, { Component } from 'react';
import io from 'socket.io-client';
import MessageItem from "./MessageItem";
import TypingList from "./TypingList"


export default class Chat extends Component {
    constructor(){
        super();

        this.state = {
            userName: "Not name",
            photo: "",
            connected: false,
            typing: false,
            FADE_TIME: 150,
            TYPING_TIMER_LENGTH: 400,
            COLORS: [
                '#e21400', '#91580f', '#f8a700', '#f78b00',
                '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
                '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
            ],
            inputMesssage: "",
            messages: [],
            listTyping: []
        };

        this.socket = io('http://localhost:3000'),
        this.getUserData();
    }

    setSocket = () => {
        let self = this;
        this.socket.on('typing', function (data) {
            self.addChatTyping(data);
        });

        this.socket.on('stop typing', function (data) {
            self.removeChatTyping(data);
        });

        this.socket.on('login', function (data) {
            self.setState({connected: true});
            let message = "Welcome to Hell.Inc Chat – ";
            console.log(message, {
                prepend: true
            });
            // $('.username-container').html(username + ':');
            // addParticipantsMessage(data);
        });

        this.socket.on('user joined', function (data) {
            console.log(data.userName + ' joined');
            // addParticipantsMessage(data);
        });

        this.socket.on('new message', function (data) {
            console.log("new message", data);
            self.newMessage(data);
        });
    }

    addChatTyping(name){
        // console.log("typing: ", name);
        let isExistInList = this.state.listTyping.filter(item => item === name).length;
        if(isExistInList){
            return;
        }
        let list = this.state.listTyping;
        list.push(name);
        this.setState({ listTyping: list});
    }

    removeChatTyping(name){
        // console.log("stop typing: ", name);
        let list = this.state.listTyping.filter(item => item !== name);
        this.setState({ listTyping: list});
    }

    newMessage = (data) => {
        console.log(data);
        let date = new Date();
        let item = {
            name: data.userData.userName || "not name",
            photo: data.userData.photo,
            text: data.message,
            date: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        };
        let list = this.state.messages;
        list.push(item);
        this.setState({ messages: list});
    }

    sendMessage = (e) => {
        let message = this.state.inputMesssage;
        if(e.keyCode == 13 && message){
            let data = {
                message,
                userData: {
                    userName: this.state.userName,
                    photo: this.state.photo
                }
            }
            this.socket.emit('new message', data);
            this.socket.emit('stop typing', this.state.userName);
            console.log("sent Message: ", data);
            this.setState({inputMesssage: ""});
        }
    }

    onChangeInput = (e) => {
        let self = this;
        this.setState({inputMesssage: e.target.value, typingDate: new Date()});
        this.onTypingOn();
        setTimeout(self.onTypingOff, 3000);
    }

    onTypingOn = () => {
        this.socket.emit('typing', this.state.userName);
    }

    onTypingOff = () => {
        if(new Date() - this.state.typingDate < 3000){
            return;
        }
        this.socket.emit('stop typing', this.state.userName);
    }

    getUserData = () => {
        let options = {
            method: "GET",
            credentials: 'include'
        };
        let userData,
            self = this;

        fetch("/userData",options)
            .then(data => data.json())
            .then(data => {
                userData = {userName: data.name, photo: data.photo};
                self.setState(userData);
                self.setSocket();
                self.socket.emit('add user',userData);
            })
            .catch(error => console.error(error));
    }

    render(){
        return(
            <div className="container">
                <div className="window browser fading">
                    <div className="header">
                        <a href="/logout" className="bullet-container" title="Logout">
                            <span className="bullet bullet-red"></span>
                            <span className="bullet bullet-yellow"></span>
                            <span className="bullet bullet-green"></span>
                        </a>
                        <span className="title"><span className="scheme">https://</span>hell-inc.com/chat</span>
                    </div>
                    <div className="body">
                        <p>Welcome to the <b>Hell.Inc</b> chat <b>MOTHERFUCKER</b></p>
                        <div className="main-window">
                            <div className="chat-container">
                                <div className="messages">

        {this.state.messages.length && this.state.messages.map((item, index)=><MessageItem key={index} item={item}/>) || null}

        {this.state.listTyping.length && <TypingList list={this.state.listTyping} /> || null}
        {/*{this.state.listTyping.length && this.state.listTyping.map((item, index)=><MessageItem key={index} item={item}/>)}*/}

                                </div>
                                <div className="message-input-container">
                                    {this.state.photo && <img src={this.state.photo} className="username-photo" />}
                                    <span className="username-container">{this.state.userName}</span>
                                    <input type="text"
                                           className="message-input"
                                           placeholder="Your message here"
                                           onChange={this.onChangeInput}
                                           onKeyDown={this.sendMessage}
                                           value={this.state.inputMesssage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}