import React, {useEffect} from 'react'
import ReceiptModal from './ReceiptModal'

export default function Orders({orders = [], onOpenEmail, onBuy}){
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: 'auto' })
  },[])

  return (
    <section className="container orders-list" id="orders" aria-labelledby="orders-title">
      <div className="orders-list-header">
        <h2 id="orders-title">Histórico de compras</h2>
        <span>{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}</span>
      </div>
      <div className="orders-list-content">
        {(!orders || orders.length===0) ? (
          <div className="card orders-empty">
            <div className="orders-empty-icon" aria-hidden="true">○</div>
            <h3>Você ainda não tem pedidos</h3>
            <p>Quando você finalizar uma compra, ela aparecerá aqui.</p>
            <div>
              <button type="button" className="btn" onClick={onBuy}>Comprar DogTalk</button>
            </div>
          </div>
        ) : (
          // show newest orders first
          orders.slice().reverse().map((order)=> (
            <div key={order.id} className="card order-card">
              <div className="order-card-topline"><span>Pedido DogTalk</span><strong>{order.id}</strong></div>
              <h3>Pedido criado</h3>
              <p>Obrigado, {order.form?.name || 'cliente'}. Seu pedido foi registrado.</p>
              <div className="order-card-actions">
                <button className="btn" onClick={()=>onOpenEmail(order)}>Ver e‑mail de confirmação</button>
              </div>
              <div className="order-receipt">
                <ReceiptModal order={order} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
