import React from 'react'

const steps = [
  {
    id: 1,
    title: '01 - Coloque a coleira',
    desc: 'Vista o DOGTALK no seu melhor amigo e deixe a tecnologia fazer o resto. O microfone integrado capta os sons e latidos do seu cachorro.'
  },
  {
    id: 2,
    title: '02 - O DOGTALK escuta',
    desc: 'A coleira analisa diferentes padrões de latidos, sons e comportamentos para entender o que seu cachorro pode estar tentando comunicar.'
  },
  {
    id: 3,
    title: '03 - A IA traduz',
    desc: 'Nossa inteligência artificial transforma os sinais captados em mensagens fáceis de entender — porque “AU AU AU” pode significar muita coisa.'
  },
]

export default function HowItWorks(){
  return (
    <section className="container reveal reveal-up" id="how" aria-labelledby="how-title" style={{marginTop:18}}>
      <h2 id="how-title">Como funciona</h2>
      <div className="grid" style={{marginTop:12}}>
        {steps.map((s,idx)=> (
          <div key={s.id} className="card reveal reveal-up" style={{transitionDelay:`${idx*80}ms`}}>
            <h3>{s.title}</h3>
            <p style={{margin:0,color:'#555'}}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
