import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaStar,
  FaNewspaper,
  FaBriefcase,
  FaHeart,
  FaFlask,
  FaFutbol,
  FaTv,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import styles from "./SideBar.module.scss";

const SideBar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className={styles.sidebar}>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        <FaHome className={styles.icon} />
        Home
      </NavLink>
      {user && (
        <NavLink
          to="/favourites"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
        >
          <FaStar className={styles.icon} />
          Favourites
        </NavLink>
      )}
      <NavLink
        to="/general"
        end
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        <FaNewspaper className={styles.icon} />
        General
      </NavLink>
      <NavLink
        to="/business"
        end
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        <FaBriefcase className={styles.icon} />
        Business
      </NavLink>
      <NavLink
        to="/health"
        end
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        <FaHeart className={styles.icon} />
        Health
      </NavLink>
      <NavLink
        to="/science"
        end
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        <FaFlask className={styles.icon} />
        Science
      </NavLink>
      <NavLink
        to="/sports"
        end
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        <FaFutbol className={styles.icon} />
        Sports
      </NavLink>
      <NavLink
        to="/technology"
        end
        className={({ isActive }) =>
          `${styles.navLink} ${isActive ? styles.active : ""}`
        }
      >
        <FaTv className={styles.icon} />
        Technology
      </NavLink>
    </nav>
  );
};

export default SideBar;
