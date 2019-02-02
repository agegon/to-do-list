import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import autoBind from 'react-autobind';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faAngleUp, faAngleDown, faReply } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import * as actions from '../store/actions';
import './Category.css';

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rename: false,
      name: "New Category",
      showInput: false,
      showConfirmationDelete: false
    };
    autoBind(this);
  }
  
  showChild() {
    const {changeShowChild, showChild, id} = this.props;
    changeShowChild(id, !showChild);
  }
  
  addChild() {
    const name = this.state.name;
    const { addChild, id } = this.props;
    addChild(name, id);
    this.setState({
      name: "New Category",
      showInput: false
    });
  }
  
  showAddNewChild() {
    this.setState({
      showInput: !this.state.showInput
    });
  }
  
  changeName(e) {
    this.setState({
      name: e.target.value
    });
  }
  
  renameCategory() {
    const { name } = this.props; 
    this.setState({
      name: this.state.rename ? "New Category" : name,
      rename: !this.state.rename,
      showInput: false
    });
  }
  
  renameSubmit() {
    const { id, renameCategory } = this.props;
    const name = this.state.name;
    this.setState({
      name: "New Category",
      rename: false
    });
    renameCategory(id, name);
  }
  
  deleteCategory() {
    this.setState({
      showConfirmationDelete: true
    });
  }
  
  deleteCategoryNo() {
    this.setState({
      showConfirmationDelete: false
    });
  }
  
  deleteCategoryYes() {
    this.setState({
      showConfirmationDelete: false
    });
    const { deleteCategory, id, parentId } = this.props;
    deleteCategory(id, parentId);
    //if (this.props.location.pathname.search(`category/${id}`) >=0 )
      this.props.history.push('/');
  }
  
  showToggle() {
    if (this.props.childArr.length > 0) 
      return (
    <button className='toggle' onClick={this.showChild}>
      {this.props.showChild ? 
        (<FontAwesomeIcon icon={faAngleUp} />) : 
        (<FontAwesomeIcon icon={faAngleDown} />)}
    </button>);
  }
  
  moveItem() {
    const { id, moveItem } = this.props;
    moveItem(id);
  }
  
  showNewChild() {
    if (this.state.showInput)
      return (
      <div className='category flex-wrap item addNewChild'><input type='text' value={this.state.name} onChange={this.changeName} placeholder='Enter category name' autoFocus={true} maxLength="20"/>
        <button disabled={!this.state.name} onClick={this.addChild}>Submit</button>
      </div>
    )
  }
  
  renderChild() {
    const {childArr, edit, showChild, selectedId} = this.props;
    if (typeof childArr !== 'undefined' && childArr.length > 0) {
      return (
        <ul className={!showChild ? 'display-none' : 'child'}>
          {childArr.map(child => (<ConnectedCategory edit={edit} id={child} key={child} selectedId={selectedId} />))}
        </ul>
      );
    }
  }
  
  showConfirmToDelete() {
    const { name } = this.props;
    if (this.state.showConfirmationDelete) {
      return (
        <div className="modal">
          <div className="wrap-modal">
            <p className="title">Delete {name}</p>
            <p>This action will delete {name} and all nested categories. Are you sure?</p>
            <div className="buttons">
              <button onClick={this.deleteCategoryYes}>Yes</button>
              <button onClick={this.deleteCategoryNo}>No</button>
            </div>
          </div>
        </div>
      )
    }
  }
  
  renderCategory() {
    const { id, name, selectedId, toMove, edit } = this.props;
    const categoryClassName = 'category flex-wrap item' + (id === selectedId ? ' selected' : '') + ((id === toMove && edit) ? ' to-move' : '');
    if (this.state.rename) {
      return (
        <div className={categoryClassName}>
          {this.showToggle()}
          <div className='flex-wrap rename'>
            <input type="text" value={this.state.name} onChange={this.changeName} placeholder="Enter name for this category" autoFocus={true} maxLength="20"/>
            <button disabled={!this.state.name} onClick={this.renameSubmit}>Submit</button>
          </div>
        </div>
      )
    } else {
      return (
        <div className={categoryClassName}>
          {this.showToggle()}
          <div className='category-name'>
            <Link to={`/category/${id}`}>{name}</Link>
            {!edit && (<button className='edit' onClick={this.renameCategory}><FontAwesomeIcon icon={faEdit} /></button>)}
          </div>
          <div className='buttons'>
            {!edit && (
              <button onClick={this.deleteCategory}>
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            )}
            {!edit && (
              <button onClick={this.showAddNewChild}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            )}
            {!!edit && (
              <button onClick={this.moveItem}>
                <FontAwesomeIcon icon={faReply} flip='vertical' />
              </button>
            )}
          </div>
        </div>
      )
    }    
  }
  
  render() {
    const id = this.props.id;
    if (id === "parent") {
      return (
        <nav className="categories-tree">
          {this.renderChild()}
        </nav>
      )
    } else {
      return (
        <li id={`category_${id}`}>
          {this.renderCategory()}
          {this.showNewChild()}
          {this.renderChild()}
          {this.showConfirmToDelete()}
        </li>
      );
    }
  }
}

const mapStateToProps = function(state, ownProps) {
  if (ownProps.id === "parent") {
    return ({
      childArr: state.parentArr,
      showChild: true
    });
  };
  const list = state.categoriesList;
  const props = list.find(el => el.id === ownProps.id);
  return { ...props, toMove: state.newItemCategoryId };
}

const ConnectedCategory = connect(mapStateToProps, actions)(withRouter(Category));

export default ConnectedCategory;