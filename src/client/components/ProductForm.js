import React, {Component} from 'react';

export default class ProductForm extends Component {
  //4.3
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render(){
    const {product, statusOptions, handleChange} = this.props
    const {id, name, status} = product;
    return (
      <div id={id}>
        <span>{name} </span>
        <form>
          <select name={name} defaultValue={status} onChange={(ev) => handleChange(ev, id)}>
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
