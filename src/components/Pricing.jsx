import React from 'react'

export default function Pricing({product,onBuy}){
  return (
    <section className="container card reveal reveal-up" id="pricing" style={{marginTop:18}}>
      <div className="price">
        <div className="left">
          <h3>{product.name}</h3>
          <p style={{margin:6}}>{product.shipping} • Entrega estimada: {product.delivery_estimate}</p>
        </div>
        <div className="right">
          <div className="price-amount">R$ {product.price.toFixed(2).replace('.',',')}</div>
          <div style={{marginTop:8}}>
            <button className="btn" onClick={onBuy}>Comprar DogTalk</button>
          </div>
        </div>
      </div>
    </section>
  )
}
