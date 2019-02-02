import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';

import * as actions from '../store/actions';
import Category from './Category';
import './CategoriesTree.css';

class CategoriesTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addName: "",
    };
    autoBind(this);
  }
  
  changeNameAddCategory(event) {
    this.setState({
      addName: event.target.value
    });
  }
  
  addNewCategory() {
    let name = this.state.addName;
    this.setState({
      addName: "",
    });
    const {addCategory} = this.props;
    addCategory(name);
  }
  
  render() {
    const edit = this.props.edit;
    return (
      <div className='menu'>
        {!edit && (
          <div id="add-new-category">
            <input type="text" placeholder="Enter category title" maxLength="20" value={this.state.addName} onChange={this.changeNameAddCategory} className='input add-input'/>
            <button onClick={this.addNewCategory} disabled={!this.state.addName} className='button add-button'>
              Add
            </button>
          </div>
        )}
        <Category id="parent" edit={this.props.edit} selectedId={this.props.selectedId}/>
      </div>
      );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, actions)(CategoriesTree);

