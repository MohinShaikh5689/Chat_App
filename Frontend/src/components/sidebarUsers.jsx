import React from "react";
import '../css/sidebar.css';
import { Link } from "react-router-dom";


const SidebarUsers = (props) => {
    return(
        <div className="sidebar__users">
                <img src = {props.profilePicture} alt="" />
            <Link to={`/chat/${props.id}`}>
                <p>{props.name}</p>
            </Link>
        </div>
    )
}

export default SidebarUsers;