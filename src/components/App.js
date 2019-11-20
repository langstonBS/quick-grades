import React from 'react';
import Main from '../containers/Main';
import styles from './app.css';

export default function App() {
  return (
    <section className={styles.app}>
      <h1>Slightly Quickr Grading</h1>
      <Main />
    </section>
  );
}
  
