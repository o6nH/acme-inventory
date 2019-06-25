import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import ProductsList from './ProductsList';


export default class App extends Component {
  //1
  constructor() {
    super();
    this.state = {
      products: [],
      statusOptions: [],
      statusesCounts: {}
    }
    this.getStateInfo = this.getStateInfo.bind(this);
  }

  getStatusesCounts(products){
    return products.reduce( (counts, {status}) => {
      if(counts[status]) {
        counts[status]++;
      } else {
        counts[status] = 1;
      }
      return counts;
    }, {})
  }

  getStateInfo(products = this.state.products){
    const statusesCounts = this.getStatusesCounts(products);//{} //{prodName1:count1, ...}
    const statusOptions = Object.keys(statusesCounts);//[] //[prodName1, ...]
    return {statusesCounts, statusOptions}
  }

  //3
  async componentDidMount() {
    const {data: products} = await axios.get('/api/products');
    const {statusOptions, statusesCounts} = this.getStateInfo(products);
    this.setState({products, statusOptions, statusesCounts});
  }

  //2.0//4
  render() {
    const {products, statusesCounts, statusOptions} = this.state; //{{}, []}
    return (
      <HashRouter>
        <Route path="/" render={() => <Navbar statusesCounts={statusesCounts} statusOptions={statusOptions}/>} />
        <Route path="/:status?" 
          render={({match}) => <ProductsList match={match} products={products} statusOptions={statusOptions}></ProductsList>}
        />
      </HashRouter>
    )
  }
}
