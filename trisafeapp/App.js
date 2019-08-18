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
  Alert,
  View,
  Text,
  Console,
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

// if (__DEV__) {
//   require('react-devtools');
// }

export default class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 'codigo': '', 'nome': '', 'cpf': '', 'rg': '', 'email': '' };
    this.obterCliente = this.obterCliente.bind(this);
    this.atribuirDadosCliente = this.atribuirDadosCliente.bind(this);
  }

  render() {
    return (
      <View style={styles.secaoDados}>
        <View style={styles.secaoDadosTitulo}>
          <Text style={styles.textoTitulo}>Dados de Identificação</Text>
        </View>
        <View>
          <TextInput placeholder="Código" style={styles.textInput} onChangeText={(codigo) => this.setState({codigo})}></TextInput>
        </View>
        <View>
          <TextInput placeholder="Nome Completo" style={styles.textInput} value={this.state.nome}></TextInput>
          <TextInput placeholder="CPF/ CNPJ" style={styles.textInput} value={this.state.cpf}></TextInput>
          <TextInput placeholder="RG" style={styles.textInput} value={this.state.rg}></TextInput>
          <TextInput placeholder="E-mail" style={styles.textInput} value={this.state.email}></TextInput>
          <Button title="Pronto" onPress={this.obterCliente}></Button>
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
  
  obterCliente() {
    
    try {
      fetch('http://192.168.1.118:8000/clientes/obter/', { method: 'GET' })
        .then(tratarRespostaHTTP)
        .then((oJsonDados) => { 
          this.atribuirDadosCliente(oJsonDados);
        })
        .catch(function(erro) {
          Alert.alert(erro.message);
          throw erro;
        });
    } catch (exc) {
      Alert.alert(exc);
    }    
  }

  atribuirDadosCliente(oJsonDados) {
    let estado = this.state;

    estado.nome = oJsonDados.user.name;
    estado.cpf = oJsonDados.user.document;
    estado.email = oJsonDados.user.email;
    this.setState(estado);
  }
};

function tratarRespostaHTTP(oRespostaHTTP) {
  if(oRespostaHTTP.ok) {
    return oRespostaHTTP.json();
  } else {
    Alert.alert("Erro: " + oRespostaHTTP.status);
  }
}
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
