import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default function Navbar ({statusesCounts, statusOptions}) {//{}, []
  //2.1//4.1
  if (statusesCounts) {
    const counts = statusOptions.map(status => statusesCounts[status]);
    const allProductsCount = counts.reduce((total,count)=>total+count, 0)
    return (
      <div>
        <ul>
          <Link to={`/`}><li>All Products ({allProductsCount})</li></Link>
          {
            statusOptions.map((status, index) => 
              <Link key={index} to={`/${status}`}><li>{`${status} (${counts[index]})`}</li></Link>)
          }
        </ul>
      </div>
     )
  } else {
    return 'Searching...'
  }
}
