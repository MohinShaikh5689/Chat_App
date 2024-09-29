import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GrLogout } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SidebarUsers from "./sidebarUsers";
import '../css/sidebar.css';


const Sidebar = () => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [err, setErr] = useState(null);
    const navigate = useNavigate();
    const ProfilePic = localStorage.getItem("userProfile");
   
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    


    useEffect(() => {
        // Fetch all users on initial load
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/user", {
                    withCredentials: true
                });
                setUsers(response.data);
                localStorage.setItem("users", JSON.stringify(response.data));
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchSearchedUsers = async () => {
            if (search) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/user/${search}`, {
                        withCredentials: true
                    });
                    console.log("Searched users:", response.data); // Log searched users
                    setUsers(response.data);

                } catch (error) {
                    if(error.response.status === 404) {
                        setErr("No users found");
                    }
                    setUsers([]); // Clear the users array if an error occurs
                }
            } else {
                try {
                    const response = await axios.get("http://localhost:3000/api/user", {
                        withCredentials: true
                    });
                    setUsers(response.data);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchSearchedUsers();
    }, [search]);

   
    useEffect(() => {
        if(err) {
            setTimeout(() => {
                console.log(err);
                setErr("");
            }, 5000);
        }
    }, [err]);

    return (
        <div className="sidebar">

            {err ? <div className="errorDiv">
                <p>{err}</p>
            </div> : null}

            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="sidebar_users">
                {users.map((user) => (
                    <SidebarUsers
                        key={user._id}
                        id={user._id}
                        profilePicture={user.profilePicture} 
                        name={user.name}
                    />
                ))}
            </div>

            <div className="profile">
                <Link to = '/profile'>
                 <img src= {ProfilePic} alt="" />
                </Link>

                <p onClick={handleLogout} > <GrLogout
                    color="white"
                /></p>
            </div>    

        </div>
    );
};

export default Sidebar;
