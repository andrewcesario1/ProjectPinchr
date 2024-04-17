import { Link } from "react-router-dom";
import "../Styles/navbar.css";

// Navbar component

function Navbar() {
    return (
        
        <header class="navHeader">
            <nav className="navbar">
                <ul>
                    <li className="navl"><Link className="navHome" to="/">Home</Link></li>
                    <li className="navl"><Link className="nav-link" to="/profile">Profile</Link></li>
                    <li className="navl"><Link className="nav-link" to="/profile">Placeholder</Link></li>   
                    <li className="navl"><Link className="nav-link" to="/profile">Placeholder</Link></li>
                    <li className="navl"><Link className="nav-link" to="/profile">Placeholder</Link></li>   
                </ul>
                <ul class="signout">                   
                    <li className="navl"><a href="/signin" class="nav-signout">Sign Out</a></li>
                </ul>
            </nav>
        </header>
    );
}
 
export default Navbar;