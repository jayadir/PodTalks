import React from 'react';
import WordLoad from './WordLoad';
import styles from './card.module.css'; 

export default function Card({title, textContent, buttonContent, onclick, children}) {
  return (
    <div className={styles.card}>
      <div className={styles.heading}>{title}</div>
      {children == null && (
        <p>
          <WordLoad text={textContent} speed={6} />
        </p>
      )}
      {children}
      <div>
        <button className={styles.button} onClick={onclick}>
          {buttonContent}
        </button>
      </div>
    </div>
  );
}
