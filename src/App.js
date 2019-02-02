import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import ToDoList from './containers/ToDoList';
import EditItem from './containers/EditItem';

class App extends Component {
  render() {
    return (
        <Switch>
          <Route exact path='/category/:categoryId/edit/:itemId' 
          component={EditItem} />
          <Route exact path='/category/:categoryId' 
          component={ToDoList} />
          <Route component={ToDoList} />
        </Switch>
    );
  }
}

export default App;
