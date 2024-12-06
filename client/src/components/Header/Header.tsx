import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <NavLink to="/" end className={styles.navLink}>
          <span className={styles.logoPart1}>My</span>
          <span className={styles.logoPart2}>News</span>
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
