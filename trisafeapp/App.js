/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Cliente from './src/Cliente';
import ClienteInicio from './src/ClienteInicio';

const AppNavigator = createDrawerNavigator({
  ClienteInicio: {
    screen: ClienteInicio
  },
  Cliente: {
    screen: Cliente
  }
},
{});

export default createAppContainer(AppNavigator);

// /**
//  * Arquivo principal do aplicativo da Trisafe.
//  *
//  * @format
//  * @flow
//  */

// import React, {Component} from 'react';
// import Cliente from './src/Cliente';

// export default class App extends Component {

//   render() {
//     return (<Cliente />);    
//   };
// }