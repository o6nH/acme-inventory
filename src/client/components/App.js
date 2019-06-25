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
    this.handleChange = this.handleChange.bind(this);
  }

  getStatusesCounts(products) {
    return products.reduce( (counts, {status}) => {
      if(counts[status]) {
        counts[status]++;
      } else {
        counts[status] = 1;
      }
      return counts;
    }, {})
  }

  getStateInfo(products = this.state.products) {
    const statusOptions = ['Stocked', 'Backordered', 'Discontinued']//[] //[prodName1, ...] //HOW DO WE GET ENUMS from DATABASE???
    const statusesCounts = this.getStatusesCounts(products);//{} //{prodName1:count1, ...}
    return {statusesCounts, statusOptions}
  }

  async fetchProducts() {
    const {data: products} = await axios.get('/api/products');
    const {statusOptions, statusesCounts} = this.getStateInfo(products);
    this.setState({products, statusOptions, statusesCounts});
  }
  
  async handleChange(event, id) {//event.target.value
    await axios.put(`/api/products/${id}`, {
      "status": event.target.value
    });
    this.fetchProducts();
  }

  //3
  componentDidMount() {
    this.fetchProducts();
  }

  //2.0//4
  render() {
    const {products, statusesCounts, statusOptions} = this.state; //{{}, []}
    return (
      <HashRouter>
        <Route path="/" render={() => <Navbar statusesCounts={statusesCounts} statusOptions={statusOptions}/>}/>
        <Route path="/:status?" 
          render={({match}) => <ProductsList match={match} products={products} statusOptions={statusOptions} handleChange={this.handleChange}></ProductsList>}
        />
      </HashRouter>
    )
  }
}
