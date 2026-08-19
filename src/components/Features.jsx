import React from 'react'

export default function Features({features}){
  return (
    <section className="container reveal reveal-up" id="benefits" aria-labelledby="benefits-title">
      <h2 id="benefits-title">Benefícios</h2>
      <div className="grid" style={{marginTop:12}}>
        {features.map((f,idx)=> (
          <div key={f.id} className="card reveal reveal-up" style={{transitionDelay:`${idx*80}ms`}}>
            <h3>{f.title}</h3>
            <p style={{margin:0,color:'#555'}}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
