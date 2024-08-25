import React from 'react'
import WordLoad from './WordLoad'
import './card.css'
export default function Card({title,textContent,buttonContent,onclick,children}) {

  return (
    <div className="card">
      <div className="heading">{title}</div>
      {children==null && <p>
        {" "}
        <WordLoad
          text={textContent} 
          speed={6}
        />
      </p>}
      {children}
      <div>
        <button className="button" on onClick={onclick}>{buttonContent}</button>
      </div>
    </div>
  )
}
