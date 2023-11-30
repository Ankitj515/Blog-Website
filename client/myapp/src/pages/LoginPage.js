import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../usercontext";

export default function LoginPage(){

    const [UserName, setUserName] = useState('');
    const [PassWord, setPassWord] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);
    async function login(ev){
        ev.preventDefault();
        const response = await fetch ('http://localhost:4000/login',{
            
            method:'POST',
            body: JSON.stringify({UserName, PassWord}),
            headers: {'Content-Type':'application/json'}, 
            credentials: 'include',
        });

        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            })
            
        }
        else{
            alert('Login Failed');
        }
    }
        if (redirect){
            return <Navigate to = {'/'} /> 
        }

    

    return(
        <div className="Loginpage"> 
            <form className="login" onSubmit={login}>
                <h1>Login</h1>
                <input type="text" placeholder="UserName" value={UserName} onChange={ev => setUserName(ev.target.value)}></input>
                <input type="password" placeholder="PassWord" value={PassWord} onChange={ev => setPassWord(ev.target.value)}></input> 
                <button>Login</button>
            </form>

        </div>
    );
}