import userEvent from '@testing-library/user-event';
import React from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext); // for current user
  const { data } = useContext(ChatContext); // for another user
  
  useEffect(()=> {
    ref.current?.scrollIntoView({behaviour: 'smooth'})
  }, [message])
  const ref = useRef();// this removes the words or chat from the input section when the chat must have been sent

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" 
          />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;