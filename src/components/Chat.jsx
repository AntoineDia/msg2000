import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import './Chat.css';

const url = 'ws://' + window.location.hostname + ':3030';


class Chat extends Component {
  state = {
    hg : 0,
    name: '',
    messages: [],
  }

  ws = new WebSocket(url)

  componentDidMount() {

    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
      this.addMessage(message)
      // document.getElementById('root').appendChild(audio);
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(url),
      })
    }
  }

  addMessage = message =>{
    this.setState(state => ({
      messages: [message, ...state.messages],
      hg : document.getElementsByClassName('msgs')[0].offsetHeight
    }),
    ()=> {
      window.scrollTo(0,this.state.hg);
    });
  }
  submitMessage = messageString => {
    const message = { name: this.state.name, message: messageString }
    this.ws.send(JSON.stringify(message))
    this.addMessage(message)
  }

    render() {
      return (
      <div>
        <div className="input">
          <label htmlFor="name">
            <input
              type="text"
              id={'name'}
              placeholder={'Your name here'}
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              />
          </label>
          <ChatInput
            ws={this.ws}
            onSubmitMessage={messageString => this.submitMessage(messageString)}
            onKeyDown={this.pressedKey}
          />
        </div>
        <div className="wp">
          <table className="msgs">
            <tbody>
              {this.state.messages.slice(0).reverse().map((message, index) =>
                <ChatMessage
                key={index}
                message={message.message}
                name={message.name}
                />,
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
export default Chat
// var audio = document.createElement("audio");
// audio.setAttribute('ref','audio_tage');
// audio.setAttribute('src','https://freesound.org/data/previews/131/131660_2398403-lq.mp3');
// audio.setAttribute('controls',true);
// audio.setAttribute('autoPlay',true);