import React from 'react'
import Gallery from "../images/gallery.png"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage,db } from '../firebase';
import { async } from '@firebase/util';
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate,Link } from 'react-router-dom';


const Register = () => {

  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

try {
  
  const res = await createUserWithEmailAndPassword(auth, email, password);
// the two code below from firebase storage ensures that images can be uploaded to the website
const storageRef = ref(storage, displayName);

const uploadTask = uploadBytesResumable(storageRef, file);

uploadTask.on(
  (error) => {
    setErr(true)
    // Handle unsuccessful uploads
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL
      })
      await setDoc(doc(db, "users", res.user.uid),{
        uid: res.user.uid,
        displayName,
        email,
        photoURL: downloadURL
      });
      await setDoc(doc(db, "userChats", res.user.uid), {});

    });
      navigate("/login")



  }
);
} catch (err) {
  setErr(true)
}
  
  }
  return (
    <div className='formContainer'>
        <div className="formWrapper">
            <span className='logo'>Lenacs Chat</span>
            <span className='title'>Register</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='display name'/>
                <input type="email" placeholder='email'/>
                <input type="password" placeholder='password' />
                <input type="file" id='file' style={{display: "none"}} />
                <label htmlFor="file">
                    <img src={Gallery} alt="" />
                    <span>Add an Avatar</span>
                </label>
                <button>Sign up</button>
                {err && <span>Something went wrong</span>}
            </form>
            <p>You do not have an account ? <Link to="/login">Login</Link></p>
        </div>
    </div>
  )
}

export default Register