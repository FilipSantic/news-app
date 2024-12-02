import { Link } from "react-router-dom";
import "./Sidebar.module.scss";

const Sidebar: React.FC = () => {
  return (
    <nav className="sidebar">
      <Link to="/favorites" className="nav-link">
        Favorites
      </Link>
    </nav>
  );
};

export default Sidebar;
