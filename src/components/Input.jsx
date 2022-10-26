import React from 'react'
import Gallery from "../images/gallery.png";
import Attach from "../images/attach.png";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { useState } from 'react';
import { async } from '@firebase/util';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import {v4 as uuid} from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase';
 
const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser} = useContext(AuthContext);
  const { data} = useContext(ChatContext);

  // the documents(image and text) can only be sent by the use of update elements in array in firebase.
  const handleSend = async () => {
    if (img) { 
      // the code below ensures that images can be uploaded to the website/file.
  const storageRef = ref(storage, uuid());
  const uploadTask = uploadBytesResumable(storageRef, img);

  uploadTask.on(
    (error) => {
      //setErr(true)
      // Handle unsuccessful uploads
    }, 
    () => {
    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
      await updateDoc(doc(db, "chats", data.chatId), {
         messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            img: downloadURL
         }),
        });
      });
    }
  );      
} else {
  await updateDoc(doc(db, "chats", data.chatId),{
    // give a unique id to the messages. this is done by installing the uuid. npm install uuid
    // data.chatId is the combinedId
    messages: arrayUnion({
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now()

    })
  })

}
// update the document i.e the last message and date
await updateDoc(doc(db, "userChats", currentUser.uid), {
  [data.chatId + ".lastMessage"]: {
    text
  },
  [data.chatId+".date"]: serverTimestamp()
});
// do same thing for the other user
await updateDoc(doc(db, "userChats", data.user.uid), {
  [data.chatId + ".lastMessage"]: {
    text
  },
  [data.chatId+".date"]: serverTimestamp()
})

//after sending delete the text and the img
setText("");
setImg(null);
}
  return (
    <div className='input'>
      <input type="text" 
      placeholder='Type something...' 
      value={text}
      onChange={(e) => setText(e.target.value)}/>

      <div className="send">
          <img src={Attach} alt="" />
          <input type="file" 
          style={{display: "none"}} 
          id="file" 
          onChange={(e) => setImg(e.target.files[0])}/>
          <label htmlFor="file">
            <img src={Gallery} alt="" />
          </label>
          <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Input;