import React from 'react';
import ProductForm from './ProductForm';

export default function ProductsList({match, products, statusOptions}) {
  //4.2
  const status = match.params.status || 'All';
  const showing = status === 'All' ? products : 
    products.filter(product => product.status === status);
  
  return (
    <div>
      {
       showing.map(product => <ProductForm key={product.id} product={product} statusOptions={statusOptions}/>)
      }
    </div>
  )
}
