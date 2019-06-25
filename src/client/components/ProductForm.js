import React, {Component} from 'react';

export default class ProductForm extends Component {
  //4.3
  constructor(props){
    super(props);
    this.state = {
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(event, product){
    console.log('event.target: ',event.target);
    console.dir(event.target);
    
  };

  render(){
    const {product, statusOptions} = this.props
    const {id, name, status} = product;
    const {onChange} = this;
    return (
      <div id={id}>
        <span>{name} </span>
        <form>
          <select name={name} defaultValue={status} onChange={(ev) => onChange(ev, product)}>
            {
              statusOptions.map((statusOption, index) => <option key={index} value={statusOption}>{statusOption}</option>)
            }
          </select>
        </form>
        <br/>
      </div>
    )
  }
}
