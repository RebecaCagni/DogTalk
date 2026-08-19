import React, {useState, useEffect} from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import PersonalModal from './components/PersonalModal'
import AddressModal from './components/AddressModal'
import EmailModal from './components/EmailModal'
import Orders from './components/Orders'
import data from './data/mock.json'

export default function App(){
  const [currentPage,setCurrentPage] = useState(()=>{
    if(typeof window === 'undefined') return 'home'
    return window.location.hash === '#orders' ? 'orders' : 'home'
  })
  const [showPersonal,setShowPersonal] = useState(false)
  const [showAddress,setShowAddress] = useState(false)
  const [orders,setOrders] = useState(()=>{
    if(typeof window === 'undefined') return []
    try{
      const raw = window.localStorage.getItem('dogtalk.orders')
      if(!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    }catch(e){ return [] }
  })
  const [showEmail,setShowEmail] = useState(false)
  const [pendingPersonal,setPendingPersonal] = useState(null)
  const [selectedOrder,setSelectedOrder] = useState(null)

  // Reveal on scroll: add .reveal--visible when elements enter viewport
  useEffect(()=>{
    if(typeof window === 'undefined') return
    const handleHashChange = ()=>setCurrentPage(window.location.hash === '#orders' ? 'orders' : 'home')
    window.addEventListener('hashchange', handleHashChange)
    return ()=>window.removeEventListener('hashchange', handleHashChange)
  },[])

  useEffect(()=>{
    if(typeof window === 'undefined') return
    const els = Array.from(document.querySelectorAll('.reveal'))
    if(els.length===0) return
    const obs = new IntersectionObserver((entries, observer)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('reveal--visible')
          observer.unobserve(entry.target)
        }
      })
    },{threshold:0.12})
    els.forEach(e=>obs.observe(e))
    return ()=>obs.disconnect()
  },[currentPage])

  // persist orders to localStorage
  useEffect(()=>{
    if(typeof window === 'undefined') return
    try{ window.localStorage.setItem('dogtalk.orders', JSON.stringify(orders)) }catch(e){}
  },[orders])

  function navigateTo(targetId){
    const nextHash = `#${targetId}`
    if(typeof window !== 'undefined'){
      try{
        if(window.location.hash !== nextHash) window.location.hash = nextHash
        else setCurrentPage(targetId === 'orders' ? 'orders' : 'home')
      }catch(_){ /* ignore */ }
    }
  }

  function handleSuccess(ord){
    // append to persisted orders
    setOrders(prev=>{
      const next = [...prev, ord]
      return next
    })
    // ensure modals are closed
    setShowPersonal(false)
    setShowAddress(false)
    setSelectedOrder(ord)
    // go to the orders page and show the confirmation email modal
    setTimeout(()=>{
      navigateTo('orders')
      setShowEmail(true)
    }, 300)
  }

  function handleBuy(){ setShowPersonal(true) }

  function handlePersonalNext(personal){
    setPendingPersonal(personal)
    setShowPersonal(false)
    // small delay to let the closing animation complete before opening the next modal
    setTimeout(()=> setShowAddress(true), 150)
  }

  return (
    <div>
      <Navbar onBuy={handleBuy} onNavigate={navigateTo} currentPage={currentPage} />
      {currentPage === 'orders' ? (
        <main className="orders-page">
          <div className="orders-page-heading container reveal reveal-up">
            <span className="eyebrow">Área do cliente</span>
            <h1>Meus pedidos</h1>
            <p>Acompanhe suas compras e acesse os comprovantes da DogTalk em um só lugar.</p>
          </div>
          <Orders orders={orders} onOpenEmail={(o)=>{ setSelectedOrder(o); setShowEmail(true) }} onBuy={handleBuy} />
        </main>
      ) : (
        <main>
          <Hero onBuy={handleBuy} />
          <Features features={data.features} />
          <HowItWorks />
          <Testimonials testimonials={data.testimonials} />
          <Pricing product={data.product} onBuy={handleBuy} />
          <FAQ items={data.faq} />
        </main>
      )}
      <Footer />

      {showPersonal && <PersonalModal initial={pendingPersonal||{}} onNext={handlePersonalNext} onClose={()=>setShowPersonal(false)} />}
      {showAddress && <AddressModal product={data.product} personal={pendingPersonal||{}} initial={{}} onBack={()=>{ setShowAddress(false); setShowPersonal(true) }} onClose={()=>setShowAddress(false)} onComplete={handleSuccess} />}
      {showEmail && <EmailModal order={selectedOrder} onClose={()=>setShowEmail(false)} />}
    </div>
  )
}
