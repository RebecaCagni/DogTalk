import React, {useEffect} from 'react'
import ReceiptModal from './ReceiptModal'

export default function EmailModal({order,onClose}){
  useEffect(()=>{
    // simulate toast by focusing
    const t = setTimeout(()=>{},400)
    return ()=>clearTimeout(t)
  },[])

  if(!order) return null
  const {id,product,form} = order

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3>E‑mail de confirmação</h3>
         <button onClick={onClose} aria-label="Fechar" style={{background:'transparent',border:0,cursor:'pointer'}}>✕</button>
        </div>
        <div style={{marginTop:12}} className="card">
          <div style={{fontSize:14}}>Assunto: Confirmação do pedido DogTalk — Pedido #{id}</div>
          <hr style={{margin:'8px 0'}} />
          <div>Olá {form.name},</div>
          <p>Obrigado por adquirir o DogTalk! Seu pedido (R$ {product.price.toFixed(2).replace('.',',')}) foi recebido com sucesso.</p>
          <div>
            <strong>Resumo do pedido</strong>
            <ul>
              <li>Produto: {product.name}</li>
              <li>Quantidade: {form.quantity}</li>
              <li>Valor: R$ {product.price.toFixed(2).replace('.',',')}</li>
              <li>Frete: {product.shipping}</li>
              <li>Entrega estimada: {product.delivery_estimate}</li>
              <li>Nº do pedido: {id}</li>
            </ul>
          </div>
          <div style={{marginTop:8,fontSize:12,color:'#666'}}>Este é um e‑mail de confirmação.</div>
        </div>
        {/* Provide the printable receipt inside the same modal so the user can
            immediately print or view the recibo after completing the order */}
        <div style={{marginTop:12}}>
          <ReceiptModal order={order} />
        </div>
      </div>
    </div>
  )
}
