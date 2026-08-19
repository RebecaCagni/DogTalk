import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer reveal reveal-up">
      <div className="footer-inner">
        <div style={{marginBottom:6}}>© {new Date().getFullYear()} DogTalk</div>
        <div style={{fontSize:13,color:'#666'}}>By Rebeca Cagni 🤍</div>
      </div>
    </footer>
  )
}
