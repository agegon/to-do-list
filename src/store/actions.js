import * as types from './actionTypes';


export const addCategory = (name) => ({
  type: types.ADD_CATEGORY,
  name
});

export const addChild = (name, parentId) => ({
  type: types.ADD_CHILD,
  name,
  parentId
});

export const deleteCategory = (id, parentId) => ({
  type: types.DELETE_CATEGORY,
  id,
  parentId
});

export const renameCategory = (id, name) => ({
  type: types.RENAME_CATEGORY,
  id,
  name
});

export const addItem = function(categoryId, name) {
  return {
    type: types.ADD_NEW_ITEM,
    categoryId,
    name
  }
};

export const editItemShort = function(id, categoryId, name, completed) {
  return {
    type: types.EDIT_ITEM_SHORT,
    id,
    categoryId,
    name,
    completed
  }
};

export const editItem = function(id, categoryId, newCategoryId, name, description, completed) {
  return {
    type: types.EDIT_ITEM,
    id,
    categoryId,
    newCategoryId,
    name,
    description,
    completed
  }
};

export const moveItem = function(newCategoryId) {
  return {
    type: types.MOVE_ITEM,
    newCategoryId
  }
}

export const changeShowChild = function(id, show) {
  return {
    type: types.SHOW_CHILD,
    id,
    show
  }
}