import { React, useEffect, useState } from "react";
import axios from "axios";
import '../css/profile.css';

const ProfileComponent = () => {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: '',
        profilePicture: ''
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/user/profile", {
                    withCredentials: true,
                });
                setUser(response.data);
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    gender: response.data.gender,
                    profilePicture: response.data.profilePicture
                });
                localStorage.setItem("userProfile", response.data.profilePicture);

            } catch (error) {
                console.error("Failed to fetch user profile", error);
                if (error.response && error.response.status === 401) {
                    console.error("Unauthorized, token might be invalid or expired");
                }
            }
        };

        fetchUser();
    }, []);

    const handleEditToggle = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (isEditing) {
            // If we are in editing mode, submit the changes
            try {
                const response = await axios.patch("http://localhost:3000/api/user/profile", formData, {
                    withCredentials: true,
                });
                setUser(response.data);
                setIsEditing(false); // Exit editing mode
            } catch (error) {
                console.error("Failed to update profile", error);
            }
        } else {
            // If we are not in editing mode, just toggle it
            setIsEditing(true);
        }
    };

    return (
        <div className="container">
            <h1>My Profile</h1>
            <img src={user.profilePicture} alt={`${user.name}'s profile`} />
            <p>
                <strong>Username:</strong> 
                {isEditing ? (
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Name"
                        
                    /> 
                ) : (
                    user.name
                )}
            </p>
            <p>
                <strong>Email:</strong> 
                {isEditing ? (
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email"
                        
                    />
                ) : (
                    user.email
                )}
            </p>
            <p>
                <strong>Gender:</strong> 
                {isEditing ? (
                    <input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        placeholder="Gender"
                        
                    />
                ) : (
                    user.gender
                )}
                
                {isEditing ? (
                   <div>
                    <strong>Profile Picture:</strong>
                     <input
                        type="text"
                        name="profilePicture"
                        value={formData.profilePicture}
                        onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                        placeholder="Profile Picture"
                        
                    />
                   </div> 
                   
                ) : null}

            </p>
            <p>
                <strong>Joined on:</strong> {formatDate(user.createdAt)}
            </p>
            
            <button onClick={handleEditToggle} className="edit-button">
                {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
        </div>
    );
};

export default ProfileComponent;
