import { Link } from "react-router-dom";

const Navbar = () => (
  <nav>
    <Link to="/">Home</Link> | 
    <Link to="/audiobars">Audio Bars</Link> | 
    <Link to="/lottie">Lottie</Link> | 
    <Link to="/tailwind">Tailwind</Link> | 
    <Link to="/about">About</Link>
  </nav>
);

export default Navbar;
