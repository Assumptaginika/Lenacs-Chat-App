import { doc, onSnapshot } from 'firebase/firestore';
import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';

const Chats = () => {
  // we need to fetch our users from the dp using useEffect, its going to be a realtime such that when anything changes its going to been seen on the chat. to do this we are going to use firebase onsnapshot "realtime get"

  
  const [chats, setChats] = useState([]);
  const { currentUser} = useContext(AuthContext);
  const { dispatch} = useContext(ChatContext);


  useEffect(()=> {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
      setChats(doc.data());
});
// clean up the unsub
      return()=> {
        unsub();
      };
    };
    currentUser.uid && getChats()
   },[currentUser.uid])
   console.log(chats)

   //console.log(Object.entries(chats));this code changes an object to an array.

   const handleSelect = (u) => {
    // to update the user
    dispatch({type: "CHANGE_USER", payload: u})
   }
  return (
    <div className='chats'>
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat)=> (
// swap the position of the chats with sort function
       <div className="userChat" key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
      </div>
      ))}
    </div>
  );
};

export default Chats;