import React, {useState, useEffect, useRef} from 'react'

function generateOrderId(){
  return 'DT-' + Math.floor(10000 + Math.random()*89999)
}

export default function CheckoutModal({product, onClose, onSuccess}){
  const [form, setForm] = useState({
    name:'',email:'',phone:'',cep:'',street:'',number:'',complement:'',neighbourhood:'',city:'',state:'',country:'Brasil',quantity:1,notes:''
  })
  const [errors,setErrors] = useState({})
  const [cepLoading,setCepLoading] = useState(false)
  const [cepError,setCepError] = useState('')

  const firstRef = useRef(null)
  const prevActive = useRef(null)
  const cepController = useRef(null)

  useEffect(()=>{
    // restore focus when modal closes and focus first field when opened
    prevActive.current = document.activeElement
    firstRef.current?.focus()
    const onKey = e=>{ if(e.key==='Escape') onClose() }
    window.addEventListener('keydown',onKey)
    return ()=>{
      window.removeEventListener('keydown',onKey)
      try{ prevActive.current?.focus?.() }catch(e){}
      if(cepController.current) cepController.current.abort()
    }
  },[])

  // helpers
  function digitsOnly(s){ return (s||'').replace(/\D/g,'') }
  function formatCep(s){ const d = digitsOnly(s).slice(0,8); return d.length>5 ? d.slice(0,5)+'-'+d.slice(5) : d }
  function formatPhone(s){ const d = digitsOnly(s).slice(0,11); if(d.length<=2) return d; if(d.length<=6) return `(${d.slice(0,2)}) ${d.slice(2)}`; if(d.length<=10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}` }

  function setField(k,v){ setForm(f=>({...f,[k]:v})) }

  async function lookupCep(cepDigits){
    if(!cepDigits || cepDigits.length!==8) return
    setCepLoading(true)
    setCepError('')
    if(cepController.current) cepController.current.abort()
    const controller = new AbortController()
    cepController.current = controller
    try{
      const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`, {signal: controller.signal})
      if(!res.ok) throw new Error('network')
      const data = await res.json()
      if(data.erro){ setCepError('CEP não encontrado'); return }
      // fill address fields when available
      setForm(f=>({
        ...f,
        street: data.logradouro || f.street,
        neighbourhood: data.bairro || f.neighbourhood,
        city: data.localidade || f.city,
        state: data.uf || f.state
      }))
      // clear related errors
      setErrors(prev=>{ const next={...prev}; delete next.cep; delete next.street; delete next.neighbourhood; delete next.city; delete next.state; return next })
    }catch(err){
      if(err.name === 'AbortError') return
      setCepError('Não foi possível buscar o endereço')
    }finally{
      setCepLoading(false)
      cepController.current = null
    }
  }

  function change(k,v){
    if(k==='cep'){
      const formatted = formatCep(v)
      setForm(f=>({...f,cep:formatted}))
      const d = digitsOnly(formatted)
      // auto lookup when we have 8 digits
      if(d.length===8) lookupCep(d)
      else {
        setCepError('')
      }
      return
    }
    if(k==='phone'){
      setForm(f=>({...f,phone:formatPhone(v)}))
      return
    }
    setField(k,v)
  }

  function validate(){
    const err = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!form.name) err.name = 'Nome é obrigatório'
    if(!form.email || !emailRegex.test(form.email)) err.email = 'E‑mail válido é obrigatório'
    const cepDigits = digitsOnly(form.cep)
    if(!cepDigits || cepDigits.length!==8) err.cep = 'CEP é obrigatório (8 dígitos)'
    if(!form.street) err.street = 'Rua é obrigatória'
    if(!form.number) err.number = 'Número é obrigatório'
    if(!form.city) err.city = 'Cidade é obrigatória'
    if(!form.state) err.state = 'Estado é obrigatório'
    const phoneDigits = digitsOnly(form.phone)
    if(form.phone && !(phoneDigits.length===10 || phoneDigits.length===11)) err.phone = 'Telefone inválido'
    setErrors(err)
    return Object.keys(err).length===0
  }

  function submit(e){
    e.preventDefault()
    if(cepLoading) return
    if(!validate()) return
    const order = { id: generateOrderId(), product, form }
    onSuccess(order)
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="modal" role="document">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 id="checkout-title">Checkout</h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              cursor: 'pointer',
              color: '#1c1c1c',
              fontSize: '1.1rem',
              padding: '4px 8px',
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>
        <div className="modal-grid" style={{marginTop:12}}>
          <div className="card" aria-hidden="true">
            <h4>{product.name}</h4>
            <p>Valor: R$ {product.price.toFixed(2).replace('.',',')}</p>
            <p>{product.shipping}</p>
            <p>Entrega estimada: {product.delivery_estimate}</p>
          </div>
          <form className="card" onSubmit={submit} noValidate>
            <div>
              <label htmlFor="checkout-name">Nome completo</label>
              <input id="checkout-name" ref={firstRef} value={form.name} onChange={e=>change('name',e.target.value)} aria-invalid={errors.name?true:false} aria-describedby={errors.name? 'err-name' : undefined} />
              {errors.name && <div id="err-name" className="error" role="alert">{errors.name}</div>}
            </div>

            <div style={{marginTop:8}}>
              <label htmlFor="checkout-email">E‑mail</label>
              <input id="checkout-email" value={form.email} onChange={e=>change('email',e.target.value)} aria-invalid={errors.email?true:false} aria-describedby={errors.email? 'err-email' : undefined} />
              {errors.email && <div id="err-email" className="error" role="alert">{errors.email}</div>}
            </div>

            <div style={{marginTop:8}}>
              <label htmlFor="checkout-phone">Telefone (opcional)</label>
              <input id="checkout-phone" value={form.phone} onChange={e=>change('phone',e.target.value)} aria-invalid={errors.phone?true:false} aria-describedby={errors.phone? 'err-phone' : undefined} />
              {errors.phone && <div id="err-phone" className="error" role="alert">{errors.phone}</div>}
            </div>

            <div className="form-row" style={{marginTop:8}}>
              <div className="field">
                <label htmlFor="checkout-cep">CEP</label>
                <input id="checkout-cep" value={form.cep} onChange={e=>change('cep',e.target.value)} aria-invalid={errors.cep?true:false} aria-describedby={errors.cep? 'err-cep' : 'cep-status'} />
                {errors.cep && <div id="err-cep" className="error" role="alert">{errors.cep}</div>}
                <div id="cep-status" aria-live="polite" style={{fontSize:13,color:'#666',marginTop:6}}>{cepLoading? 'Buscando endereço...' : (cepError || '')}</div>
              </div>
              <div className="field">
                <label htmlFor="checkout-street">Rua</label>
                <input id="checkout-street" value={form.street} onChange={e=>change('street',e.target.value)} aria-invalid={errors.street?true:false} aria-describedby={errors.street? 'err-street' : undefined} />
                {errors.street && <div id="err-street" className="error" role="alert">{errors.street}</div>}
              </div>
            </div>

            <div className="form-row" style={{marginTop:8}}>
              <div className="field">
                <label htmlFor="checkout-number">Número</label>
                <input id="checkout-number" value={form.number} onChange={e=>change('number',e.target.value)} aria-invalid={errors.number?true:false} aria-describedby={errors.number? 'err-number' : undefined} />
                {errors.number && <div id="err-number" className="error" role="alert">{errors.number}</div>}
              </div>
              <div className="field">
                <label htmlFor="checkout-complement">Complemento</label>
                <input id="checkout-complement" value={form.complement} onChange={e=>change('complement',e.target.value)} />
              </div>
            </div>

            <div className="form-row" style={{marginTop:8}}>
              <div className="field">
                <label htmlFor="checkout-neighbourhood">Bairro</label>
                <input id="checkout-neighbourhood" value={form.neighbourhood} onChange={e=>change('neighbourhood',e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="checkout-city">Cidade</label>
                <input id="checkout-city" value={form.city} onChange={e=>change('city',e.target.value)} aria-invalid={errors.city?true:false} aria-describedby={errors.city? 'err-city' : undefined} />
                {errors.city && <div id="err-city" className="error" role="alert">{errors.city}</div>}
              </div>
            </div>

            <div className="form-row" style={{marginTop:8}}>
              <div className="field">
                <label htmlFor="checkout-state">Estado</label>
                <input id="checkout-state" value={form.state} onChange={e=>change('state',e.target.value)} aria-invalid={errors.state?true:false} aria-describedby={errors.state? 'err-state' : undefined} />
                {errors.state && <div id="err-state" className="error" role="alert">{errors.state}</div>}
              </div>
              <div className="field">
                <label htmlFor="checkout-country">País</label>
                <input id="checkout-country" value={form.country} readOnly />
              </div>
            </div>

            <div style={{marginTop:8}}>
              <label htmlFor="checkout-quantity">Quantidade</label>
              <select id="checkout-quantity" value={form.quantity} onChange={e=>change('quantity',Number(e.target.value))}>
                {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div style={{marginTop:8}}>
              <label htmlFor="checkout-notes">Observações (opcional)</label>
              <textarea id="checkout-notes" value={form.notes} onChange={e=>change('notes',e.target.value)} rows={3} />
            </div>

            <div style={{marginTop:12,display:'flex',justifyContent:'flex-end',gap:8}}>
              <button type="button" className="btn secondary" onClick={onClose}>Cancelar</button>
              <button className="btn" type="submit" disabled={cepLoading}>Confirmar compra</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
