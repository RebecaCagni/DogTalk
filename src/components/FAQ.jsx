import React, {useState} from 'react'

export default function FAQ({items}){
  return (
    <section className="container reveal reveal-up" id="faq" aria-labelledby="faq-title" style={{marginTop:18}}>
      <h2 id="faq-title">Perguntas frequentes</h2>
      <div style={{marginTop:12}}>
        {items.map((it,idx)=>(
          <AccordionItem key={idx} q={it.q} a={it.a} delay={idx*60} />
        ))}
      </div>
    </section>
  )
}

function AccordionItem({q,a,delay=0}){
  const [open,setOpen] = useState(false)
  return (
    <div className="faq-item reveal reveal-up" style={{transitionDelay:`${delay}ms`}}>
      <button className="faq-question" aria-expanded={open} onClick={()=>setOpen(s=>!s)}>
        <span>{q}</span>
        <span className={`faq-icon ${open ? 'open' : ''}`} aria-hidden="true">⌄</span>
      </button>
      {open && <div className="faq-answer" role="region">{a}</div>}
    </div>
  )
}
