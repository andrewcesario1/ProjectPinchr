import { Link } from "react-router-dom";
import "../Styles/navbar.css";

// Navbar component

function Navbar() {
    return (
        
        <header class="navHeader">
            <nav className="navbar">
                <ul>
                    <li><a href="/" class="navHome">Pinchr</a></li>
                    <li><a href="/profile" class="nav-link">Profile</a></li>
                    <li><a href="/profile" class="nav-link">Placeholder</a></li>
                    <li><a href="/profile" class="nav-link">Placeholder</a></li>
                    <li><a href="/profile" class="nav-link">Placeholder</a></li>      
                </ul>
                <ul class="signout">                   
                    <li><a href="/login" class="nav-signout">Sign Out</a></li>
                </ul>
            </nav>
        </header>
    );
}
 
export default Navbar;