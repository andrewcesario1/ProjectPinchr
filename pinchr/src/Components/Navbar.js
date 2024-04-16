import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <h1>Pinchr</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/profile">Profile</Link>
            </div>
        </nav>
    );
}
 
export default Navbar;