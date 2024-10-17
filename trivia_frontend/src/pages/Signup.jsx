import { useState, useEffect } from 'react'
import { signUp } from '../services/UserService'

const Signup = ()=> {
    const [fullName,setFullName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleSignUp = (e)=> {
        e.preventDefault();
        try{
            console.log("hey");
            const data = signUp(fullName,email,password);
        }catch(error){
            console.log("Error: ", error)
        }
//         }finally(() => { console.log("finally")})
    }
    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignUp}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="onSubmit">Signup</button>
            </form>
        </div>
        );

}

export default Signup;