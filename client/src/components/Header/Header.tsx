import React from "react";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoPart1}>My</span>
        <span className={styles.logoPart2}>News</span>
      </div>
    </header>
  );
};

export default Header;
