import React from 'react'

export default function Hero({onBuy}){
  return (
    <section className="container hero reveal reveal-up" aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className="hero-copy reveal reveal-up" style={{transitionDelay:'80ms'}}>
          <span className="hero-kicker">Tecnologia para uma conexão mais próxima</span>
          <h1 id="hero-title">Entenda o que seu cachorro quer dizer</h1>
          <p>DogTalk traduz latidos e sinais para que você se conecte melhor com seu pet.</p>
          <div className="hero-cta">
            <button className="btn" onClick={onBuy}>Comprar DogTalk</button>
            <a
              className="btn secondary"
              href="#how"
              onClick={(e)=>{
                e.preventDefault()
                const el = typeof document !== 'undefined' ? document.getElementById('how') : null
                const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
                if(el){ el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' }) }
                try{ history.replaceState && history.replaceState(null, '', '#how') }catch(_){ /* ignore */ }
              }}
            >Como funciona</a>
          </div>
        </div>
        <div className="hero-visual reveal reveal-up" style={{transitionDelay:'200ms'}}>
          <img src="/assets/hero.png" alt="Foto do DogTalk no colar" />
        </div>
      </div>
    </section>
  )
}
