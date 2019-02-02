import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { editItem, moveItem } from '../store/actions';
import CategoriesTree from './CategoriesTree';
import './EditItem.css';

class EditItem extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      name: '',
      description: '',
      completed: false
    }
  }
  componentDidMount() {
    const { name, description, completed, categoryId, moveItem } = this.props;
    this.setState({
      name: name,
      description: description,
      completed: completed
    });
    moveItem(categoryId);
  }
  
  changeName(e) {
    this.setState({
      name: e.target.value
    });
  }
  
  changeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  
  changeCompleted(e) {
    this.setState({
      completed: e.target.checked
    })
  }
  
  cancelChanges(e) {
    const { moveItem } = this.props;
    moveItem(-1);
  }
  
  saveChanges(e) {
    const { name, description, completed } = this.state;
    const { categoryId, itemId, editItem, moveItem, newCategoryId } = this.props;
    editItem(itemId, categoryId, newCategoryId, name, description, completed);
    moveItem(-1);
  }
  
  render() {
    const { categoryId, itemId, name } = this.props;
    const categoryIsUndefined = typeof categoryId === 'undefined';
    const isDefined = !(categoryIsUndefined || typeof itemId === 'undefined');
    const editItemClass = 'flex-container edit-item';
    return (
      <div className='wrap'>
        <header>
          <h1>{isDefined ? name : 'Uknown To-Do Item'}</h1>
        </header>
        <div className='content'>
          <CategoriesTree edit={isDefined} selectedId={this.props.categoryId}/>
          {!isDefined ? (
            <div className={editItemClass}>
              <p>{categoryIsUndefined ?
                'This category was removed or never been exist.' : 
                'This item was removed or never been exist.'}
              </p>
              <Link to={categoryIsUndefined ? '/' : `/category/${categoryId}`} className='button link'>
                {categoryIsUndefined ? 'To main.' : 'To category.'}
              </Link>
            </div>
          ) : (
            <div className={editItemClass}>
              <div className='buttons'>
                <Link to={`/category/${categoryId}`} onClick={this.saveChanges} className='button'>Save changes</Link>
                <Link to={`/category/${categoryId}`} className='button'>Cancel</Link>
              </div>
              <div className='fields'>
                <input type='text' onChange={this.changeName} placeholder='Enter title for your task' value={this.state.name} className='input'/><br />
                <label>
                  <input type='checkbox' onChange={this.changeCompleted} checked={this.state.completed} />
                  Done
                </label><br />
                <textarea onChange={this.changeDescription} placeholder='Enter description for your task' value={this.state.description} className='input'/>
              </div>
          </div>)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(state, ownProps) {
  const categoryId = parseInt(ownProps.match.params.categoryId, 10);
  const itemId = parseInt(ownProps.match.params.itemId, 10);
  if (isNaN(categoryId)) {
    return { categoryId: undefined };
  }
  if (isNaN(itemId)) {
    return { 
      categoryId,
      itemId: undefined
    }
  }
  const category = state.categoriesList.find(i => i.id === categoryId);
  if (typeof category === 'undefined') {
    return { categoryId: undefined };
  }
  const item = ( itemId >= 0 && itemId < category.itemList.length ) ?
        category.itemList[itemId] : undefined;  
  if (typeof item === 'undefined') {
    return { 
      categoryId,
      itemId: undefined
    }
  }
  return { ...item, categoryId, itemId, newCategoryId: state.newItemCategoryId }
}

export default withRouter(connect(mapStateToProps, {editItem, moveItem})(EditItem));