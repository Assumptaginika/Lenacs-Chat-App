import React from 'react'
import { useState } from 'react';
import { collection, query, where, setDoc,  updateDoc, doc, serverTimestamp, getDocs, getDoc} from "firebase/firestore";
import {db} from "../firebase"
import { async } from '@firebase/util';
import { useContext } from 'react';
import { AuthContext} from "../context/AuthContext";



const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser} = useContext(AuthContext)

  const handleSelect = async() => {
    //this is to check whether the group(children) chat exits in firestore, if not create new one
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId))
    // create user chats (for jenny and jane)
    if(!res.exists()) {
      //create a chat in chats collection
      await setDoc(doc(db, "chats", combinedId), {messages: []});
      
      //create user Chats
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combinedId+".userInfo"]: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL

        },
        [combinedId+ ".date"]: serverTimestamp()
      });

      await updateDoc(doc(db, "userChats", user.uid), {
        [combinedId+".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL

        },
        [combinedId+ ".date"]: serverTimestamp()
      });
    }
      
    } catch (err) {
    }
    setUser(null);
    setUsername("")

     }

  const handleSearch = async() => {
    const q = query(collection(db, "users"), where("displayName", "==", username)
    )
    try {
      const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  setUser(doc.data())
});

      
    } catch (error) {
     setErr(true) 
    }
    
  };
  // we use firebase query to search for user
  const handleKey = (e) => {
    e.code === "Enter"&& handleSearch()
  };

  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" placeholder='Find a user' onKeyDown={handleKey}  value={username}  onChange={e=>setUsername(e.target.value)} />
      </div>
      {err && <span>User not found</span>}
      {user && <div className="userChat" onClick={handleSelect}>
            <img src={user.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{user.displayName}</span>
            </div>
      </div>}

    </div>
  )
}

export default Search