/**
 * Componente de tela para dados de cliente
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { ThemeProvider, Input, Button } from 'react-native-elements';
import { PushNotification } from 'react-native-push-notification';
import RNFetchBlob from 'rn-fetch-blob';
import {
    ScrollView,
    Alert,
    View,
    PermissionsAndroid
} from 'react-native';
import Util from './common/Util';
import Cabecalho from './common/CabecalhoTela';
import AreaBotoes from './common/AreaBotoes';
import { styles, theme } from './common/Estilos';

export default class ClienteInicio extends Component {
    static navigationOptions = {
        title: 'ClienteInicio'
    }
    constructor(props) {
        super(props);
        
        // var PushNotification = require("react-native-push-notification");
        // PushNotification.localNotificationSchedule({
        //     //... You can use all the options from localNotifications
        //     message: "My Notification Message", // (required)
        //     date: new Date(Date.now() + 1000) // in 60 secs
        //   });
        this.limpar = this.limpar.bind(this);
        this.capturarDadosCadastro = this.capturarDadosCadastro.bind(this);
        this.obterCliente = this.obterCliente.bind(this);
        
        // this.baixarPDFBoleto = this.baixarPDFBoleto.bind(this);
        // this.gerarBoleto = this.gerarBoleto.bind(this);        
        // this.tratarDadosBoleto = this.tratarDadosBoleto.bind(this);
        
        this.irParaTestesRapidos = this.irParaTestesRapidos.bind(this);
        // this.solicitarPermissoes = this.solicitarPermissoes.bind(this);
        this.tratarDadosCliente = this.tratarDadosCliente.bind(this);
        objUtil = new Util();

        this.state = objUtil.inicializarDados();
       // this.solicitarPermissoes();
    }

    // async solicitarPermissoes(){
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //           {
    //             title: "Storage Permission",
    //             message: "App needs access to memory to download the file "
    //           }
    //         );
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //           Alert.alert("Permission granted","Now you can download anything!");
    //         } else {
    //           Alert.alert(
    //             "Permission Denied!",
    //             "You need to give storage permission to download the file"
    //           );
    //         }
    //       } catch (err) {
    //         console.warn(err);
    //       }
    // }

    capturarDadosCadastro(oDadosCadastro) {
        let estado = this.state;

        estado.cliente.cpf = oDadosCadastro.cpf;
        estado.cliente.email = oDadosCadastro.email;

        this.setState(estado);
    }

    obterCliente() {
        try {
            let estado = this.state;            
            let url = objUtil.getURL('/clientes/obter/');

            estado.processandoRequisicao = true;
            this.setState(estado);

            fetch(url, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(estado),
              })
                .then(objUtil.obterJsonResposta)
                .then((oJsonDados) => {
                    objUtil.tratarRetornoServidor(oJsonDados, this.tratarDadosCliente, true);
                })
                .catch(function (erro) {
                    Alert.alert(erro.message);
                    throw erro;
                });
        } catch (exc) {
            Alert.alert(exc.message);
            throw exc;
        }
    }

    tratarDadosCliente(oDados, oEstado) {
        const { navigation } = this.props;
        let estado = this.state;

        if(oEstado.cod_mensagem === 'NaoCadastrado') {
            Alert.alert('Seu cadastro não foi localizado. Preencha os dados solicitados para realizá-lo.');
        } else if (oEstado.mensagem && oEstado.mensagem.trim()) {
            Alert.alert(oEstado.mensagem);
        }
        if(oDados) {
            estado.cliente = oDados;
        }

        estado.processandoRequisicao = false;
        estado.emCadastro = true;

        navigation.navigate('ClienteDadosPessoais', estado);
    }

    tratarDadosBoleto(oDados, oEstado) {
        if (oEstado.mensagem && oEstado.mensagem.trim()) {
            Alert.alert(oEstado.mensagem);
        }
        if(oDados && oDados.url_pdf) {
            // Alert.alert(oDados.id);
            this.baixarPDFBoleto(oDados.url_pdf);
        } else {
            Alert.alert('Sem dados boleto.');
        }
    }

    irParaTestesRapidos(){
        const { navigation } = this.props;
        
        navigation.navigate('TestesInicio');
    }

    limpar() {
        let estado = this.state;

        estado.cpf = '';
        estado.email = '';
        this.setState(estado);
    }
    botaoIniciar = () => <Button title="Iniciar" onPress={this.obterCliente} loading={this.state.processandoRequisicao}></Button>;
    botaoTestesRapidos = () => <Button title="Testes Rápidos" onPress={this.irParaTestesRapidos} ></Button>;

    render() {
        let dadosCliente = this.state;
        let botoesTela = [ { element: this.botaoIniciar }, { element: this.botaoTestesRapidos} ];
        
        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Cadastro' nomeTela='Início' />
                <AreaDados parentCallBack={this.capturarDadosFiltroCallBack} capturarDadosCallBack={this.capturarDadosCadastro} dadosCliente={dadosCliente}/>
                <AreaBotoes botoes={botoesTela} />
            </View>
        );
    }
}

export class AreaDados extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <ScrollView>
                <ThemeProvider theme={theme}>
                    <View style={styles.areaDadosCliente}>
                        <Input placeholder="Informe seu E-Mail" label="E-Mail" onChangeText={(valor) => { this.props.dadosCliente.email = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu CPF" label="CPF" onChangeText={(valor) => { this.props.dadosCliente.cpf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                    </View>
                </ThemeProvider>
            </ScrollView>
        );
    }
}









// gerarBoleto() {
//     try {
//         let estado = this.state;            
//         let url = objUtil.getURL('/boletos/gerarBoleto/');

//         estado.processandoRequisicao = true;
//         this.setState(estado);

//         fetch(url, {
//             method: 'POST',
//             headers: {
//               Accept: 'application/json',
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//             }),
//           })
//             .then(objUtil.obterJsonResposta)
//             .then((oJsonDados) => {
//                 objUtil.tratarRetornoServidor(oJsonDados, this.tratarDadosBoleto, true);
//             })
//             .catch(function (erro) {
//                 Alert.alert(erro.message);
//                 throw erro;
//             });
//     } catch (exc) {
//         Alert.alert(exc.message);
//         throw exc;
//     }
// }

// baixarPDFBoleto(){
//     let url = 'https://download.gerencianet.com.br/229576_14_FORAA5/229576-637436-ZENEM8.pdf?sandbox=true';
//     // Documentacao: https://github.com/joltup/rn-fetch-blob/wiki/Manually-Link-Package#index
//     const { config, fs } = RNFetchBlob;
//     let docDir = fs.dirs.DocumentDir; // this is the pictures directory. You can check the available directories in the wiki.
//     let options = {
//         // fileCache: false,
//         // addAndroidDownloads : {
//             useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
//             notification : false,
//             path:  "/data/user/0/com.trisafeapp/files/boleto_gernet.pdf", // this is the path where your downloaded file will live in
//             description : 'Baixando boleto.',
//             mime : 'application/pdf',
//         // }
//     }
//     config(options).fetch('GET', url).then((res) => {
//         if(res) {
//             console.log('resp of pdf', res);
//             console.log('The file saved to ', res.path());
//             Alert.alert(res.path());
//         } else {
//             Alert.alert('res vazio');
//         }
//     }).catch((err) => {
//         console.log(err);
//     });
// }