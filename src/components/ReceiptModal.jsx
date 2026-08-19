import React from 'react'

export default function ReceiptModal({order}){
  if(!order) return null

  function printReceipt(){
    const content = `
      <html><head><title>Recibo ${order.id}</title></head><body>
        <h2>Recibo - DogTalk</h2>
        <p>Nº do pedido: ${order.id}</p>
        <p>Produto: ${order.product.name}</p>
        <p>Quantidade: ${order.form.quantity}</p>
        <p>Valor: R$ ${order.product.price.toFixed(2).replace('.',',')}</p>
        <p>Frete: ${order.product.shipping}</p>
        <p>Entrega estimada: ${order.product.delivery_estimate}</p>
        <p>Nome: ${order.form.name}</p>
        <p>E‑mail: ${order.form.email}</p>
      </body></html>`
    const w = window.open('', '_blank')
    w.document.open()
    w.document.write(content)
    w.document.close()
    w.focus()
    w.print()
    // keep window open so user can close
  }

  return (
    <div className="card" style={{marginTop:12}}>
      <h4>Recibo (pronto para impressão)</h4>
      <p>Nº do pedido: {order.id}</p>
      <p>Produto: {order.product.name}</p>
      <p>Quantidade: {order.form.quantity}</p>
      <p>Valor: R$ {order.product.price.toFixed(2).replace('.',',')}</p>
      <div style={{marginTop:12}}>
        <button className="btn" onClick={printReceipt}>Imprimir recibo</button>
      </div>
    </div>
  )
}
