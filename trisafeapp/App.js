/**
 * Arquivo principal do aplicativo da Trisafe.
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import Cliente from './src/Cliente';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   View,
//   Text,
//   Console,
//   StatusBar,
//   TextInput,
//   Button,
//   Fragment
// } from 'react-native';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,  
// } from 'react-native/Libraries/NewAppScreen';



// if (__DEV__) {
//   require('react-devtools');
// }

export default class App extends Component {

  render() {
    return (<Cliente />);    
  };
}