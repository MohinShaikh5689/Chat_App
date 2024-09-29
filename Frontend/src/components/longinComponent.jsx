import { React, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import '../css/form.css';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if(error) {
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }, [error]);

    const handleSubmit =  async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/user/login", 
            { email, password }, 
            { withCredentials: true });
            const token = response.data.token;
            const userId = response.data._id;
            
            if (userId) {
                localStorage.setItem("userId", userId);
            }
            
            if (token) {
                localStorage.setItem("token", token);
             }

            console.log("Login successful", response.data);

            navigate("/");

            
        } catch (error) {
           if (error.response.status === 401) {
                setError("Invalid email or password");
           }
              else {
                setError("Something went wrong. Please try again later.");
              }
        }
    };
        



    return (
        <div className="Login">

           {error ? <div className="errorDiv">
                <p>{error}</p>
           </div> : null}

            <form className="form" onSubmit={handleSubmit}>
                <h1>Login</h1>

                <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required />

                <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required />
                <button type="submit">Login</button>
                <p className="message">Not registered? <Link to = "/signup"> Create an account </Link></p>
                

            </form>
        </div>
    )
};

export default Login;
