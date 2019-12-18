/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import ClienteInicio from './src/ClienteInicio';
import ClienteDadosPessoais from './src/ClienteDadosPessoais';
import ClienteEndereco from './src/ClienteEndereco';
import ClienteSenha from './src/ClienteSenha';
import ClienteConfirmacao from './src/ClienteConfirmacao';

const AppNavigator = createDrawerNavigator({
    ClienteInicio: {
      screen: ClienteInicio,
      // key: '1'
    },
    ClienteDadosPessoais: {
      screen: ClienteDadosPessoais,
      // key: '2'
    },
    ClienteEndereco: {
      screen: ClienteEndereco,
      // key: '3'
    },
    ClienteConfirmacao: {
      screen: ClienteConfirmacao,
      // key: '5'
    }
  },
  {
    initialRouteName: 'ClienteInicio'
  });

export default createAppContainer(AppNavigator);