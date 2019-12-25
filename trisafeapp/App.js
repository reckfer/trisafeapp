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
import ClienteConfirmacao from './src/ClienteConfirmacao';

const AppNavigator = createDrawerNavigator({
    ClienteInicio: {
      screen: ClienteInicio,
    },
    ClienteDadosPessoais: {
      screen: ClienteDadosPessoais,
    },
    ClienteEndereco: {
      screen: ClienteEndereco,
    },
    ClienteConfirmacao: {
      screen: ClienteConfirmacao,
    }
  },
  {
    initialRouteName: 'ClienteInicio'
  });

export default createAppContainer(AppNavigator);