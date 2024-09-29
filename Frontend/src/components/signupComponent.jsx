import { React, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../css/form.css';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gender, setGender] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            if (password !== confirmPassword) {
                setError("Passwords do not match");
            }


            const response = await axios.post("http://localhost:3000/api/user/signup",
                { name, email, password, confirmPassword, gender },
                { withCredentials: true });

            const token = response.data.token;

            if (token) {
                localStorage.setItem("token", token);
            }

            navigate("/");
            

        } catch (err) {
            if (err.response.status === 400) {
                setError("User already exists, please login");
            }
        }
    };

    return (
        <div className="Login">

            {error ? <div className="errorDiv">
               <p> {error} </p>
                </div> : null}


            <form className="form1" onSubmit={handleSubmit}>
                <h1>Signup</h1>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <div className="gender">
                    <label>
                        <input
                            type="radio"
                            value="male"
                            checked={gender === "male"}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        Male
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="female"
                            checked={gender === "female"}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        Female
                    </label>
                </div>

                <button type="submit">Signup</button>
                <p className="message">Already registered? <Link to = "/login" >Log in</Link> </p>
            </form>
        </div>
    );
};

export default Signup;
