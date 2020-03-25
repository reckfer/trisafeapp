/**
 * Componente de tela para dados de cliente
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    ScrollView,
    Alert,
    View
} from 'react-native';
import Util from './common/Util';
import { ThemeProvider, Button } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import Cabecalho from './common/CabecalhoTela';
import { styles, theme } from './common/Estilos';
import AreaBotoes from './common/AreaBotoes';

export default class BoletoEmissao extends Component {
    static navigationOptions = {
        title: 'BoletoEmissao'
    }
    constructor(props) {
        super(props);
        
        this.limpar = this.limpar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.tratarDadosRetorno = this.tratarDadosRetorno.bind(this);
        this.capturarDadosFiltroCallBack = this.capturarDadosFiltroCallBack.bind(this);
        
        objUtil = new Util();
        this.state = objUtil.inicializarDados();
    }

    contratar() {
        try {
            let url = objUtil.getURL('/produtos/contratar/');
            let oDadosAppGeral = this.state;
            
            oDadosAppGeral.processandoRequisicao = true;
            this.setState(oDadosAppGeral);

            fetch(url, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(oDadosAppGeral)
                  })
                  .then(objUtil.obterJsonResposta)
                  .then((oJsonDados) => {
                      objUtil.tratarRetornoServidor(oJsonDados, this.tratarDadosRetorno);
                  })
        } catch (exc) {
            Alert.alert(exc);
        }
    }

    tratarDadosRetorno(oDados) {
        let oDadosAppGeral = this.state;

        oDadosAppGeral.processandoRequisicao = false;
        this.setState(oDadosAppGeral);

        if(oDados && oDados.id_cliente_iter) {
            Alert.alert("Cod. cliente Iter: " + oDados.id_cliente_iter);
        }

        const { navigation } = this.props;
        
        this.state.emCadastro = false;
        navigation.navigate('ClienteEndereco', this.state);
    }

    limpar() {
        let oDadosAppGeral = this.state;
        let oDadosApp = oDadosAppGeral.dadosApp;
        let oCliente = oDadosApp.cliente;

        oCliente.codigo = '';
        oCliente.nomeCliente = '';
        oCliente.nomeUsuario = '';
        oCliente.cpf = '';
        oCliente.rg = '';
        oCliente.email = '';
        
        this.setState(oDadosAppGeral);
    }

    capturarDadosFiltroCallBack(oDadosFiltro) {
        let oDadosAppGeral = this.state;
        
        oDadosAppGeral.codigo = oDadosFiltro.codigo;
        this.setState(oDadosAppGeral);
    }
    
    voltar() {
        const { navigation } = this.props;
        
        navigation.navigate('ClienteConfirmacao', this.state);
    }

    botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>;        
    botaoConfirmar = () => <Button title="Confirmar" ></Button>;

    render() {
        let dadosCliente = this.state;
        const { navigation } = this.props;

        let botoesTela = [ { element: this.botaoVoltar }, { element: this.botaoConfirmar } ];

        // Obtem os dados vindos da tela dados pessoais.
        // objUtil.lerDadosNavegacao(dadosCliente, navigation);
        oContrato = navigation.getParam('contrato');
        oBoleto = oContrato.boleto;
        
        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Produto' nomeTela='Contratação' />
                <AreaDados dadosBoleto={oBoleto}/>
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
            <WebView source={{ uri: this.props.dadosBoleto.url_boleto_html }} />
            // <WebView source={{ uri: 'https://github.com/facebook/react-native' }} />                
        );
    }
}