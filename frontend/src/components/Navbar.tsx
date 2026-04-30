import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          Research<span className={styles.logoAccent}>Hub</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/dashboard" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/create-study" className={styles.navLink}>
            Create Study
          </Link>
        </div>
      </div>
    </nav>
  );
}
