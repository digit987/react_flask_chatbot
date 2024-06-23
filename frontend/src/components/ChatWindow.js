import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ChatWindow.css';
import logo from '../logo.png';

const ChatWindow = ({ currentUser, handleLogout }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [maxHeight, setMaxHeight] = useState(0);
  const messagesContainerRef = useRef(null);

  const fetchData = async () => {
    if (newMessage.trim() !== '') {
      try {
        const requestBody = { message: newMessage };
        const response = await fetch('http://pyany123.pythonanywhere.com/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Ensure cookies are included in the request
          body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        setMessages(prevMessages => [
          ...prevMessages,
          { text: newMessage, isSystem: false },
          { text: data.message, isSystem: true }
        ]);
        setNewMessage('');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const adjustMaxHeight = useCallback(() => {
    const singleLineHeight = 30;
    const linesToShow = 6;
    const minimumHeight = singleLineHeight * 2; 
    let totalLines = 0;
    messages.forEach(message => {
      totalLines += Math.ceil(message.text.length / 50);
    });

    setMaxHeight(Math.max(totalLines * singleLineHeight, minimumHeight, singleLineHeight * linesToShow));
  }, [messages]);

  const populateInput = (text) => {
    setNewMessage(text);
  };

  useEffect(() => {
    scrollToBottom();
    adjustMaxHeight();
  }, [messages, adjustMaxHeight]);

  return (
    <div className="container">
      <div className="center">
        <img src={logo} alt="Logo" className="logo" />
        <h1><span className="welcome-text">Welcome to Smile2Steps</span></h1>
      </div>
      <div className="strip">
        <div className="center faded-text">Empowering Parents, Enriching Childhood</div>
      </div>
      <div className="card-container">
        <div className="card" onClick={() => populateInput("Help me with baby's first food")}>Help me with baby's first food</div>
        <div className="card" onClick={() => populateInput("How to improve my child's sleep?")}>How to improve my child's sleep?</div>
        <div className="card" onClick={() => populateInput("What are fun activities for toddlers?")}>What are fun activities for toddlers?</div>
        <div className="card" onClick={() => populateInput("When should my baby start crawling?")}>When should my baby start crawling?</div>
      </div>
      {messages.length > 0 && (
        <div className="messages-container" style={{ maxHeight: `${maxHeight}px`, border: '1px solid #ccc' }} ref={messagesContainerRef}>
          {messages.map((message, index) => (
            <div key={index} className={message.isSystem ? 'system-message-container' : 'user-message-container'}>
              {message.isSystem && <img src={logo} alt="Logo" className="small-logo" />}
              <div className={message.isSystem ? 'system-message' : 'user-message'}>{message.text}</div>
            </div>
          ))}
        </div>
      )}
      <div className="input-container">
        <input
          type="text"
          className="input-field"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyUp={(e) => { if (e.key === 'Enter') fetchData(); }}
          placeholder="Ask a question..."
        />
        <button className="input-btn" onClick={fetchData}>Enter</button>
      </div>
    </div>
  );
};

export default ChatWindow;
