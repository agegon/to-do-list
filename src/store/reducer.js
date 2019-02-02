import * as types from './actionTypes';

const initialState = {
  counter: 0,
  categoriesList: [],
  parentArr: [],
  newItemCategoryId: -1
};

const reduce = function(state = initialState, action) {
  switch (action.type) {
    case types.ADD_CATEGORY:
      return addCategoryToState(action.name, state);
    case types.ADD_CHILD:
      return addChildToState(action.name, action.parentId, state);
    case types.SHOW_CHILD:
      return changeShowChildInState(action.id, action.show, state);
    case types.RENAME_CATEGORY:
      return renameCategoryInState(action.id, action.name, state);
    case types.DELETE_CATEGORY:
      return deleteFromState(action.id, action.parentId, state);
    case types.ADD_NEW_ITEM:
      return addItemToState(action.categoryId, action.name, state);
    case types.EDIT_ITEM:
      return editItemInState(action, state);
    case types.EDIT_ITEM_SHORT:
      return shortEditItemInState(action, state);
    case types.MOVE_ITEM:
      return changeNewItemCategoryId(action.newCategoryId, state);
    default:
      return state;
  }
};

const createCategory = (name, id, parentId = "parent") => ({
  id,
  name,
  parentId,
  showChild: true,
  childArr: [],
  itemList: []
}); 

const createItem = function(name, description = "", completed = false) {
  return {
    name,
    description,
    completed
  }
};

const addCategoryToState = function(name, state) {
  const newState = { ...state };
  newState.counter++;
  newState.categoriesList = [
    createCategory(name, state.counter),
    ...state.categoriesList
  ];
  newState.parentArr = [state.counter, ...state.parentArr];
  return newState;
}

const addChildToState = function(name, parentId, state) {
  const newList = [
    createCategory(name, state.counter, parentId),
    ...state.categoriesList
  ];
  newList.forEach((item, i) => {
    if (item.id === parentId) {
      newList[i] = { ...item };
      newList[i].childArr = [state.counter, ...item.childArr];
      newList[i].showChild = true;
    };
  });
  const newState = { ...state };
    newState.counter++;
    newState.categoriesList = newList;
  return newState;
}

const renameCategoryInState = function(id, name, state) {
  const newList = [...state.categoriesList];
  newList.forEach((item, i) => {
    if (item.id === id) {
      newList[i] = { ...item };
      newList[i].name = name;
    };
  });
  const newState = { ...state };
  newState.categoriesList = newList;
  return newState;
}


const deleteFromState = function(id, parentId, state) {
  const getAllDescendents = function(id, stateArr) {
    const childs = [];
    stateArr.forEach(item => {
      if (item.parentId === id)
        childs.push(item.id);
    });
    if (childs.length > 0) {
      let descendents = [];
      childs.forEach(child => {
      descendents = descendents.concat(getAllDescendents(child, stateArr));
      });
      return childs.concat(descendents);
    };
    return childs;
  };
  
  const oldList = [...state.categoriesList];
  const idsToDelete = [id, ...getAllDescendents(id, oldList)];
  const newList = [];
  
  oldList.forEach(item => {
    if (idsToDelete.indexOf(item.id) === -1) {
      newList.push(item);
    }
  });
  
  let parentArr = state.parentArr;
  if (parentId === "parent") {
    parentArr = parentArr.filter(i => i !== id);
  } else {
    newList.forEach( (item, i) => {
      if (item.id === parentId) {
        newList[i] = { ...item };
        newList[i].childArr = item.childArr.filter(i => i !== id);
      }
    });
  };
  const newState = { ...state };
  newState.categoriesList = newList;
  newState.parentArr = parentArr;
  return newState;
}

const addItemToState = function(id, name, state) {
  const newList = [...state.categoriesList];
  newList.forEach((item, i) => {
    if (item.id === id) {
      newList[i] = { ...item };
      newList[i].itemList = [createItem(name), ...item.itemList]
    };
  });
  const newState = { ...state };
  newState.categoriesList = newList;
  return newState;
}

const editItemInState = function(action, state) {
  const { id, categoryId, newCategoryId, name, description, completed } = action;
  const newItem = createItem(name, description, completed);
  const newList = [...state.categoriesList];
  
  if (newCategoryId === categoryId || newCategoryId === -1) {
    newList.forEach((item, i) => {
      if (item.id === categoryId) {
        newList[i] = { ...item };
        newList[i].itemList = [...item.itemList];
        newList[i].itemList[id] = newItem;
      }
    });
  } else {
    newList.forEach((item, i) => {
      if (item.id === categoryId) {
        newList[i] = { ...item };
        newList[i].itemList = [...item.itemList];
        newList[i].itemList.splice(id, 1);
      }
      if (item.id === newCategoryId) {
        newList[i] = { ...item };
        newList[i].itemList = [newItem, ...item.itemList];
      }
    });
  };
  
  const newState = { ...state };
  newState.categoriesList = newList;
  return newState;
}

const shortEditItemInState = function(action, state) {
  const { id, categoryId, name, completed } = action;
  const newList = [...state.categoriesList];
  newList.forEach((item, i) => {
    if (item.id === categoryId) {
      const newItem = { ...item.itemList[id] };
      newItem.name = name;
      newItem.completed = completed;
      
      newList[i] = { ...item };
      newList[i].itemList = [...item.itemList];
      newList[i].itemList[id] = newItem;
    };
  });
  const newState = { ...state };
  newState.categoriesList = newList;
  return newState;
}

const changeNewItemCategoryId = function(newCategoryId, state) {
  const newState = { ...state };
  newState.newItemCategoryId = newCategoryId;
  return newState;
}


const changeShowChildInState = function(id, show, state) {
  const newList = [...state.categoriesList];
  newList.forEach((item, i) => {
    if (item.id === id) {      
      newList[i] = { ...item };
      newList[i].showChild = show;
    };
  });
  const newState = { ...state };
  newState.categoriesList = newList;
  return newState;
}

export default reduce;