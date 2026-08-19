import React, {useState, useEffect, useRef} from 'react'

function generateOrderId(){
  return 'DT-' + Math.floor(10000 + Math.random()*89999)
}

export default function AddressModal({product, personal={}, initial={}, onBack, onClose, onComplete}){
  const [form, setForm] = useState({
    ...initial,
    name: personal.name || initial.name || '',
    email: personal.email || initial.email || '',
    phone: personal.phone || initial.phone || '',
    cep: initial.cep||'', street: initial.street||'', number: initial.number||'', complement: initial.complement||'', neighbourhood: initial.neighbourhood||'', city: initial.city||'', state: initial.state||'', country: initial.country||'Brasil', quantity: initial.quantity||1, notes: initial.notes||''
  })

  const [errors,setErrors] = useState({})
  const [cepLoading,setCepLoading] = useState(false)
  const [cepError,setCepError] = useState('')
  const firstRef = useRef(null)
  const prevActive = useRef(null)
  const cepController = useRef(null)

  useEffect(()=>{
    prevActive.current = document.activeElement
    // focus the CEP input when the modal opens
    firstRef.current?.focus()
    const onKey = e=>{ if(e.key==='Escape') onClose && onClose() }
    window.addEventListener('keydown', onKey)
    return ()=>{
      window.removeEventListener('keydown', onKey)
      try{ prevActive.current?.focus?.() }catch(e){}
      if(cepController.current) cepController.current.abort()
    }
  },[])

  function digitsOnly(s){ return (s||'').replace(/\D/g,'') }
  function formatCep(s){ const d = digitsOnly(s).slice(0,8); return d.length>5 ? d.slice(0,5)+'-'+d.slice(5) : d }
  function formatPhone(s){ const d = digitsOnly(s).slice(0,11); if(d.length<=2) return d; if(d.length<=6) return `(${d.slice(0,2)}) ${d.slice(2)}`; if(d.length<=10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}` }

  function setField(k,v){ setForm(f=>({...f,[k]:v})) }

  async function lookupCep(cepDigits){
    if(!cepDigits || cepDigits.length!==8) return
    setCepLoading(true); setCepError('')
    if(cepController.current) cepController.current.abort()
    const controller = new AbortController(); cepController.current = controller
    try{
      const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`, {signal: controller.signal})
      if(!res.ok) throw new Error('network')
      const data = await res.json()
      if(data.erro){ setCepError('CEP não encontrado'); return }
      setForm(f=>({
        ...f,
        street: data.logradouro || f.street,
        neighbourhood: data.bairro || f.neighbourhood,
        city: data.localidade || f.city,
        state: data.uf || f.state
      }))
      setErrors(prev=>{ const next={...prev}; delete next.cep; delete next.street; delete next.neighbourhood; delete next.city; delete next.state; return next })
    }catch(err){ if(err.name === 'AbortError') return; setCepError('Não foi possível buscar o endereço') }
    finally{ setCepLoading(false); cepController.current = null }
  }

  function change(k,v){
    if(k==='cep'){
      const formatted = formatCep(v)
      setForm(f=>({...f,cep:formatted}))
      const d = digitsOnly(formatted)
      if(d.length===8) lookupCep(d)
      else setCepError('')
      return
    }
    if(k==='phone'){ setForm(f=>({...f,phone:formatPhone(v)})); return }
    setField(k,v)
  }

  function validate(){
    // Only validate address-related fields here. Personal info is collected in the
    // previous step and prefilled via the `personal` prop.
    const err = {}
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
    onComplete && onComplete(order)
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="address-title">
      <div className="modal" role="document">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 id="address-title">Endereço e observações</h3>
          <button onClick={onClose} aria-label="Fechar" style={{background:'transparent',border:0,cursor:'pointer'}}>✕</button>
        </div>

        <div className="modal-grid" style={{marginTop:12}}>
          <div className="card" aria-hidden="true">
            <h4>{product.name}</h4>
            <p>Valor: R$ {product.price.toFixed(2).replace('.',',')}</p>
            <p>{product.shipping}</p>
            <p>Entrega estimada: {product.delivery_estimate}</p>
            <div style={{marginTop:12,fontSize:13,color:'#666'}}>
              Comprador: {form.name || personal.name || '—'}<br />
              E‑mail: {form.email || personal.email || '—'}
            </div>
          </div>

          <form className="card" onSubmit={submit} noValidate>
            {/* Address-only inputs: personal info is gathered in the previous modal */}
            <div className="form-row" style={{marginTop:8}}>
              <div className="field">
                <label htmlFor="addr-cep">CEP</label>
                <input id="addr-cep" ref={firstRef} value={form.cep} onChange={e=>change('cep',e.target.value)} aria-invalid={errors.cep?true:false} aria-describedby={errors.cep? 'err-cep' : 'cep-status'} />
                {errors.cep && <div id="err-cep" className="error" role="alert">{errors.cep}</div>}
                <div id="cep-status" aria-live="polite" style={{fontSize:13,color:'#666',marginTop:6}}>{cepLoading? 'Buscando endereço...' : (cepError || '')}</div>
              </div>
              <div className="field">
                <label htmlFor="addr-street">Rua</label>
                <input id="addr-street" value={form.street} onChange={e=>change('street',e.target.value)} aria-invalid={errors.street?true:false} aria-describedby={errors.street? 'err-street' : undefined} />
                {errors.street && <div id="err-street" className="error" role="alert">{errors.street}</div>}
              </div>
            </div>

            <div className="form-row" style={{marginTop:8}}>
              <div className="field">
                <label htmlFor="addr-number">Número</label>
                <input id="addr-number" value={form.number} onChange={e=>change('number',e.target.value)} aria-invalid={errors.number?true:false} aria-describedby={errors.number? 'err-number' : undefined} />
                {errors.number && <div id="err-number" className="error" role="alert">{errors.number}</div>}
              </div>
              <div className="field">
                <label htmlFor="addr-complement">Complemento</label>
                <input id="addr-complement" value={form.complement} onChange={e=>change('complement',e.target.value)} />
              </div>
            </div>

            <div className="form-row" style={{marginTop:8}}>
              <div className="field">
                <label htmlFor="addr-neighbourhood">Bairro</label>
                <input id="addr-neighbourhood" value={form.neighbourhood} onChange={e=>change('neighbourhood',e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="addr-city">Cidade</label>
                <input id="addr-city" value={form.city} onChange={e=>change('city',e.target.value)} aria-invalid={errors.city?true:false} aria-describedby={errors.city? 'err-city' : undefined} />
                {errors.city && <div id="err-city" className="error" role="alert">{errors.city}</div>}
              </div>
            </div>

            <div className="form-row" style={{marginTop:8}}>
              <div className="field">
                <label htmlFor="addr-state">Estado</label>
                <input id="addr-state" value={form.state} onChange={e=>change('state',e.target.value)} aria-invalid={errors.state?true:false} aria-describedby={errors.state? 'err-state' : undefined} />
                {errors.state && <div id="err-state" className="error" role="alert">{errors.state}</div>}
              </div>
              <div className="field">
                <label htmlFor="addr-country">País</label>
                <input id="addr-country" value={form.country} readOnly />
              </div>
            </div>

            <div style={{marginTop:8}}>
              <label htmlFor="addr-quantity">Quantidade</label>
              <select id="addr-quantity" value={form.quantity} onChange={e=>change('quantity',Number(e.target.value))}>
                {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div style={{marginTop:8}}>
              <label htmlFor="addr-notes">Observações (opcional)</label>
              <textarea id="addr-notes" value={form.notes} onChange={e=>change('notes',e.target.value)} rows={3} />
            </div>

            <div style={{marginTop:12,display:'flex',justifyContent:'flex-end',gap:8}}>
              <button type="button" className="btn secondary" onClick={onBack}>Voltar</button>
              <button type="button" className="btn secondary" onClick={onClose}>Cancelar</button>
              <button className="btn" type="submit" disabled={cepLoading}>Confirmar compra</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
