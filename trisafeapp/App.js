/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,  
} from 'react-native/Libraries/NewAppScreen';

if (__DEV__) {
  require('react-devtools');
}

export default class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 'nome': '', 'cpf': '', 'rg': '', 'dtNascimento': '' }
  }

  salvarDadosIdentificacao(){
  
  }
  render() {
    return (
      <View style={styles.secaoDados}>
        <View style={styles.secaoDadosTitulo}>
          <Text style={styles.textoTitulo}>Dados de Identificação</Text>
        </View>
        <View>
          <TextInput placeholder="Nome Completo" style={styles.textInput}></TextInput>
          <TextInput placeholder="CPF/ CNPJ" style={styles.textInput}></TextInput>
          <TextInput placeholder="RG" style={styles.textInput}></TextInput>
          <TextInput placeholder="Data Nascimento" style={styles.textInput}></TextInput>
          <Button title="Pronto" onPress={this.salvarDadosIdentificacao}></Button>
        </View>
      </View>
      // <Fragment>
      //   <StatusBar barStyle="dark-content" />
      //   <SafeAreaView>
      //     <ScrollView
      //       contentInsetAdjustmentBehavior="automatic"
      //       style={styles.scrollView}>
      //       <Header />
      //       {global.HermesInternal == null ? null : (
      //         <View style={styles.engine}>
      //           <Text style={styles.footer}>Engine: Hermes</Text>
      //         </View>
      //       )}
      //       <View style={styles.body}>
      //         <View style={styles.sectionContainer}>
      //           <Text style={styles.sectionTitle}>Step One</Text>
      //           <Text style={styles.sectionDescription}>
      //             Edit <Text style={styles.highlight}>App.js</Text> to change this
      //             screen and then come back to see your edits.
      //           </Text>
      //         </View>
      //         <View style={styles.sectionContainer}>
      //           <Text style={styles.sectionTitle}>See Your Changes</Text>
      //           <Text style={styles.sectionDescription}>
      //             <ReloadInstructions />
      //           </Text>
      //         </View>
      //         <View style={styles.sectionContainer}>
      //           <Text style={styles.sectionTitle}>Debug</Text>
      //           <Text style={styles.sectionDescription}>
      //             <DebugInstructions />
      //           </Text>
      //         </View>
      //         <View style={styles.sectionContainer}>
      //           <Text style={styles.sectionTitle}>Learn More</Text>
      //           <Text style={styles.sectionDescription}>
      //             Read the docs to discover what to do next:
      //           </Text>
      //         </View>
      //         <LearnMoreLinks />
      //       </View>
      //     </ScrollView>
      //   </SafeAreaView>
      // </Fragment>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  textInput: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 7,
    margin: 5,
    backgroundColor: '#ffffff'
  },
  secaoDados: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: '#42aaf5'
  },
  secaoDadosTitulo: {    
    backgroundColor: '#42aaf5',
  },
  textoTitulo: {
    fontSize: 20,
    fontWeight: '300',
    color: Colors.black,
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 3
  }


});

//export default App;
