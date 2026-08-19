import React from 'react'

export default function Testimonials({testimonials}){
  return (
    <section className="container reveal reveal-up" aria-labelledby="test-title" style={{marginTop:18}}>
      <h2 id="test-title">O que falam</h2>
      <div className="testimonials" style={{marginTop:12}}>
        {testimonials.map((t,idx) => (
          <div className="card reveal reveal-up" key={t.id} style={{transitionDelay:`${idx*80}ms`}}>
            <strong>{t.name}</strong>
            <div style={{color:'#f5a623',marginTop:6}}>{'★'.repeat(t.rating)}</div>
            <p style={{marginTop:8}}>{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
