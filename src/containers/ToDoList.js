import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import autoBind from 'react-autobind';
import queryString from 'query-string';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import * as actions from '../store/actions';
import CategoriesTree from './CategoriesTree';
import './ToDoList.css';

class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputToDo: '',
      findStr: '',
      showDone: true
    }
    autoBind(this);
  }
  
  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    const { filter, done } = values;
    this.setState({
      findStr: typeof filter !== 'undefined' ? filter : '',
      showDone: typeof done !== 'undefined' ? (done === 'true') : true 
    });
  }
  
  componentDidUpdate() {
    const values = queryString.parse(this.props.location.search);
    const filter = typeof values.filter !== 'undefined' ? 
      values.filter : '';
    const done = typeof values.done !== 'undefined' ? 
      values.done === 'true' : true;
    if (this.state.findStr !== filter || this.state.showDone !== done) {
      this.setState({
        findStr: filter,
        showDone: done 
      });
    };
  }
  
  findChange(e) {
    const val = e.target.value;
    const done = this.state.showDone;
    const path = this.props.location.pathname;
    this.setState({
      findStr: val
    });
    this.props.history.push(path+'?filter='+val+'&done='+done);
  }
  
  showDoneChange(e) {
    const done = e.target.checked;
    const val = this.state.findStr;
    const path = this.props.location.pathname;
    this.setState({
      showDone: done
    })
    this.props.history.push(path+'?filter='+val+'&done='+done);
  }
  
  changeInput(e) {
    this.setState({
      inputToDo: e.target.value
    })
  }
  
  addInToDoList() {
    const { addItem, categoryId } = this.props;
    const name = this.state.inputToDo;
    addItem(categoryId, name);
    this.setState({
      inputToDo: ''
    });
  }
  
  checkComplete(id, item) {
    const { editItemShort, categoryId } = this.props;
    const { name, completed } = item;
    editItemShort(id, categoryId, name, !completed);
  }
  
  renderItem(item, i) {
    const { findStr, showDone } = this.state;
    if (item.name.search(findStr) >= 0 && (showDone || (!showDone && !item.completed))) 
      return (
        <li key={`item_${i}`} className='item flex-wrap'>
          <div className='checkbox'>
            <input type='checkbox' checked={item.completed} onChange={e => {this.checkComplete(i, item)}} />
          </div>
          <p>{item.name}</p>
          <Link to={this.props.location.pathname+'/edit/'+i} className='button'><FontAwesomeIcon icon={faEdit} /></Link>
        </li>
      );
  }
  
  renderHeader(filterOn) {
    const { itemList } = this.props;
    let numbItems = 0;
    let numbDone = 0;
    if (typeof itemList !== 'undefined') {
      numbItems = itemList.length;
      numbDone = itemList.filter(i => i.completed).length;
    }; 
    return (
      <header>
        <div className='flex-wrap'>
          <h1>To-Do List</h1>
          <div className='filter'>
            <label>
              <input type='checkbox' checked={this.state.showDone} onChange={this.showDoneChange} disabled={!filterOn} />
              Show done
            </label>
            <input type='search' value={this.state.findStr} onChange={this.findChange} disabled={!filterOn} placeholder='Search' className='input'/>
          </div>
        </div>
        <progress value={numbDone} max={numbItems}/>
      </header>
    )
  }
  
  render() {
    const { itemList, categoryId } = this.props;
    const itemListIsDefined = typeof itemList !== 'undefined';
    return (
      <div className='wrap'>
        {this.renderHeader(itemListIsDefined)}
        <div className='content'>
          <CategoriesTree edit={false} selectedId={categoryId} />
          <div className='flex-container to-do-list'>
            {!itemListIsDefined && (<p>Please select a category.</p>)}
            {itemListIsDefined && (
              <div id='add-to-do'>
                <input type='text' value={this.state.inputToDo} onChange={this.changeInput} placeholder='Enter title for your task' className='input add-input'/>
                <button disabled={!this.state.inputToDo} onClick={this.addInToDoList} className='button add-button'>
                  Add
                </button>
              </div>
            )}
            {itemListIsDefined && (
              <ul>
                {itemList.map(this.renderItem)}
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = function(state, ownProps) {
  const categoryId = parseInt(ownProps.match.params.categoryId, 10);
  const category = state.categoriesList.find(item => item.id === categoryId);
  
  return {
    itemList: typeof category !== 'undefined' ? category.itemList : undefined,
    categoryId: categoryId
  }
}

const connectedToDoList = connect(mapStateToProps, actions)(ToDoList);

export default withRouter(connectedToDoList);