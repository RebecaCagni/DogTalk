import React, {useState, useEffect} from 'react'

export default function Navbar({onBuy, onNavigate, currentPage = 'home'}){
  const [open,setOpen] = useState(false)

  useEffect(()=>{
    // prevent body scroll when mobile menu is open
    document.body.style.overflow = open ? 'hidden' : ''
    return ()=>{ document.body.style.overflow = '' }
  },[open])

  function close(){ setOpen(false) }

  // Handle navigation clicks to provide a smooth, consistent transition
  // Especially on mobile: wait for the side menu to close before scrolling
  function handleNavClick(e, targetId){
    if(e && e.preventDefault) e.preventDefault()
    const wasOpen = open
    close()

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (typeof onNavigate === 'function') {
      onNavigate(targetId)
    }

    const doScroll = () => {
      const el = typeof document !== 'undefined' ? document.getElementById(targetId) : null
      if (!el) return
      try {
        el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' })
      } catch (_) { /* ignore */ }
    }

    const delay = wasOpen ? 320 : 0
    setTimeout(doScroll, delay)
  }

  return (
    <header className="nav" role="banner">
      <div className="container nav-inner">
        <a href="/" className="brand" aria-label="DogTalk">
          <img
            src="/assets/logo.png"
            alt="DogTalk logo"
            className="brand-logo"
            onError={(e)=>{ e.currentTarget.onerror = null; e.currentTarget.src = '/assets/logo.svg' }}
          />
          <span className="brand-dot" aria-hidden="true" />
        </a>

        <nav id="main-nav" className={`links ${open? 'open':''}`} aria-label="Main navigation">
          {currentPage === 'orders' ? (
            <a href="#home" onClick={(e)=>handleNavClick(e,'home')}>Voltar ao site</a>
          ) : <>
            <a href="#how" onClick={(e)=>handleNavClick(e,'how')}>Como funciona</a>
            <a href="#benefits" onClick={(e)=>handleNavClick(e,'benefits')}>Benefícios</a>
            <a href="#pricing" onClick={(e)=>handleNavClick(e,'pricing')}>Preço</a>
            <a href="#faq" onClick={(e)=>handleNavClick(e,'faq')}>FAQ</a>
          </>}
          <a href="#orders" className="orders-link" onClick={(e)=>handleNavClick(e,'orders')}>Pedidos</a>
          <button className="btn" onClick={()=>{ onBuy(); close() }}>Comprar DogTalk</button>
        </nav>

        <button className="nav-toggle" aria-label={open? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="main-nav" onClick={()=>setOpen(s=>!s)}>
        {!open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M4 6h16M4 12h16M4 18h16" stroke="#123" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M6 18L18 6M6 6l12 12" stroke="#123" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      </div>

      {open && <div className="mobile-backdrop" onClick={close} aria-hidden="true" />}
    </header>
  )
}
