import { useState } from "react";
import Post from "../post";

export default function RegisterPage(){
    const [UserName, setUserName] = useState('');
    const [PassWord, setPassWord] = useState('');

    async function register(ev){
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/register', {
            method:'POST',
            body: JSON.stringify({UserName, PassWord}),
            headers: {'Content-Type':'application/json'},
        });
        if (response.status === 200){
            alert('Registeration Successfull');

        }
        else{
            alert('Registeration Failed');
        }


    }
    return(
        <div className="Registerpage">
            <form className="register" onSubmit={register}>
                <h1>Register</h1>
                <input type="text" placeholder="UserName" 
                value={UserName} 
                onChange={ev => setUserName(ev.target.value)}></input>
                
                <input type="password" placeholder="PassWord" 
                value={PassWord} 
                onChange={ev => setPassWord(ev.target.value)}></input>
                <button>Register</button>
            </form>

        </div>
    );
}