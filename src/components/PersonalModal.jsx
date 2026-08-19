import React, {useState, useEffect, useRef} from 'react'

export default function PersonalModal({initial={}, onNext, onClose}){
  const [form,setForm] = useState({ name: initial.name||'', email: initial.email||'', phone: initial.phone||'' })
  const [errors,setErrors] = useState({})
  const firstRef = useRef(null)
  const prevActive = useRef(null)

  useEffect(()=>{
    prevActive.current = document.activeElement
    firstRef.current?.focus()
    const onKey = e=>{ if(e.key==='Escape') onClose && onClose() }
    window.addEventListener('keydown', onKey)
    return ()=>{
      window.removeEventListener('keydown', onKey)
      try{ prevActive.current?.focus?.() }catch(e){}
    }
  },[])

  function digitsOnly(s){ return (s||'').replace(/\D/g,'') }
  function formatPhone(s){ const d = digitsOnly(s).slice(0,11); if(d.length<=2) return d; if(d.length<=6) return `(${d.slice(0,2)}) ${d.slice(2)}`; if(d.length<=10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}` }

  function change(k,v){
    if(k==='phone'){ setForm(f=>({...f,phone:formatPhone(v)})); return }
    setForm(f=>({...f,[k]:v}))
  }

  function validate(){
    const err = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!form.name) err.name = 'Nome é obrigatório'
    if(!form.email || !emailRegex.test(form.email)) err.email = 'E‑mail válido é obrigatório'
    const phoneDigits = digitsOnly(form.phone)
    if(form.phone && !(phoneDigits.length===10 || phoneDigits.length===11)) err.phone = 'Telefone inválido'
    setErrors(err)
    return Object.keys(err).length===0
  }

  function submit(e){
    e.preventDefault()
    if(!validate()) return
    onNext && onNext(form)
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="personal-title">
      <div className="modal" role="document">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 id="personal-title">Dados pessoais</h3>
          <button onClick={onClose} aria-label="Fechar" style={{background:'transparent',border:0,cursor:'pointer'}}>✕</button>
        </div>

        <form className="card" onSubmit={submit} noValidate style={{marginTop:12}}>
          <div>
            <label htmlFor="personal-name">Nome completo</label>
            <input id="personal-name" ref={firstRef} value={form.name} onChange={e=>change('name',e.target.value)} aria-invalid={errors.name?true:false} aria-describedby={errors.name? 'err-name' : undefined} />
            {errors.name && <div id="err-name" className="error" role="alert">{errors.name}</div>}
          </div>

          <div style={{marginTop:8}}>
            <label htmlFor="personal-email">E‑mail</label>
            <input id="personal-email" value={form.email} onChange={e=>change('email',e.target.value)} aria-invalid={errors.email?true:false} aria-describedby={errors.email? 'err-email' : undefined} />
            {errors.email && <div id="err-email" className="error" role="alert">{errors.email}</div>}
          </div>

          <div style={{marginTop:8}}>
            <label htmlFor="personal-phone">Telefone (opcional)</label>
            <input id="personal-phone" value={form.phone} onChange={e=>change('phone',e.target.value)} aria-invalid={errors.phone?true:false} aria-describedby={errors.phone? 'err-phone' : undefined} />
            {errors.phone && <div id="err-phone" className="error" role="alert">{errors.phone}</div>}
          </div>

          <div style={{marginTop:12,display:'flex',justifyContent:'flex-end',gap:8}}>
            <button type="button" className="btn secondary" onClick={onClose}>Cancelar</button>
            <button className="btn" type="submit">Continuar para endereço</button>
          </div>
        </form>
      </div>
    </div>
  )
}
