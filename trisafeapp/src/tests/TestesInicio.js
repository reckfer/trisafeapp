/**
 * Componente de tela para dados de cliente
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { ThemeProvider, Input, Button} from 'react-native-elements';
import {
    ScrollView,
    Alert,
    View
} from 'react-native';
import Util from '../common/Util';
import Cabecalho from '../common/CabecalhoTela';
import AreaBotoes from '../common/AreaBotoes';
import { styles, theme } from '../common/Estilos';
import UtilTests from '../tests/UtilTests';
import GerenciadorDadosApp from '../common/GerenciadorDadosApp';

export default class TestesInicio extends Component {
    static navigationOptions = {
        title: 'TestesInicio'
    }
    constructor(props) {
        super(props);
        let oNavigation = this.props.navigation;
        this.irParaTesteCadastroIter = this.irParaTesteCadastroIter.bind(this);
        this.irParaTesteBoletoGerenciaNet = this.irParaTesteBoletoGerenciaNet.bind(this);        
        this.irParaTesteContratoPDF = this.irParaTesteContratoPDF.bind(this);
        this.gerarDadosTestes = this.gerarDadosTestes.bind(this);
        this.obterUltimoCliente = this.obterUltimoCliente.bind(this);
        this.tratarDadosRetorno = this.tratarDadosRetorno.bind(this);
        this.inicializarDadosTela = this.inicializarDadosTela.bind(this);

        this.tratarDadosRetornoTemp = this.tratarDadosRetornoTemp.bind(this);

        objUtilTests = new UtilTests();
        oUtil = new Util();
        oGerenciadorDadosApp = new GerenciadorDadosApp(oNavigation);
        
        this.inicializarDadosTela();
    }

    inicializarDadosTela() {
        
        let oDados = oGerenciadorDadosApp.getDadosAppGeral();
        this.state = oDados;

        if(!oGerenciadorDadosApp.temDados(oDados)) {
            this.obterUltimoCliente();
        }
    }

    irParaTesteCadastroIter() {
        const { navigation } = this.props;
        
        let oDados = this.gerarDadosTestes();

        navigation.navigate('ClienteInicio', oDados);
    }

    irParaTesteBoletoGerenciaNet() {
        const { navigation } = this.props;
        // this.gerarDadosTestes();

        navigation.navigate('ProdutoEscolha', this.state);
    }

    irParaTesteContratoPDF() {
        // const { navigation } = this.props;
        
        // navigation.navigate('ContratoEfetivacao');
        this.obterContrato();
    }

    obterUltimoCliente() {
        try {
            let url = oUtil.getURL('/clientes/obter_ultimo/');
           
            fetch(url, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: {}
                  })
                  .then(oUtil.obterJsonResposta)
                  .then((oJsonDados) => {
                      oUtil.tratarRetornoServidor(oJsonDados, this.tratarDadosRetorno);
                  })
        } catch (exc) {
            Alert.alert(exc);
        }
    }

    tratarDadosRetorno(oDados) {
        let oDadosAppGeral = this.state;

        if(!oDados) {
            oDados = this.gerarDadosTestes();            
        }
        oDadosAppGeral = oGerenciadorDadosApp.atribuirDados('cliente', oDados);

        this.setState(oDadosAppGeral);
    }

    obterContrato() {
        try {
            let url = oUtil.getURL('/contratos/obter/');
            let oDadosAppGeral = oGerenciadorDadosApp.getDadosAppGeral();
            oDadosAppGeral.dados_app.contrato.id_contrato = '0089810000000445'

            fetch(url, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(oDadosAppGeral)
                  })
                  .then(oUtil.obterJsonResposta)
                  .then((oJsonDados) => {
                      oUtil.tratarRetornoServidor(oJsonDados, this.tratarDadosRetornoTemp);
                  })
        } catch (exc) {
            Alert.alert(exc);
        }
    }
    
    tratarDadosRetornoTemp(oDados) {
        oDadosAppGeral = oGerenciadorDadosApp.atribuirDados('contrato', oDados);

        this.setState(oDadosAppGeral);
    }

    gerarDadosTestes() {
        let oDadosAppGeral = oGerenciadorDadosApp.inicializarDados();
        let oDadosApp = oDadosAppGeral.dados_app;
        let oDadosCliente = oDadosApp.cliente;
        let oDadosContrato = oDadosApp.contrato;

        let numAleatorio = Math.random();
        let usuario = numAleatorio.toString(36).slice(6);

        oDadosCliente.nome = 'Fernando Reck ' + usuario;
        oDadosCliente.cpf = objUtilTests.gerarCPF();
        oDadosCliente.email = usuario + '@emailtestes.com.br';
        oDadosCliente.nomeUsuario = usuario;
        oDadosCliente.telefone = '51' + numAleatorio.toString().slice(9);
        oDadosCliente.rua = 'Rua do Relógio';
        oDadosCliente.numero = numAleatorio.toString().slice(15);
        oDadosCliente.cidade = 'Porto Alegre';
        oDadosCliente.uf = 'RS';
        oDadosCliente.complemento = 'Ap. 4' + numAleatorio.toString(16);
        oDadosCliente.bairro = 'Bela Vista';
        oDadosCliente.cep = numAleatorio.toString().slice(10);
        oDadosContrato.valorTotal = Math.floor(Math.random() * 100) + 1;
        oDadosContrato.listaProdutos = [1, 2, 3];
        oDadosContrato.boleto.url_boleto_pdf = '';
        oDadosContrato.boleto.url_boleto_html = '';
        oDadosApp.emTestes = true;

        return oDadosAppGeral;
    }

    botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>;
    
    render() {
        let dadosApp = this.state.dados_app;
        let botoesTela = [ 
            { element: this.botaoVoltar }, 
        ];
        let funcoes = {
            'irParaTesteCadastroIter': this.irParaTesteCadastroIter,
            'irParaTesteBoletoGerenciaNet': this.irParaTesteBoletoGerenciaNet,
            'irParaTesteContratoPDF': this.irParaTesteContratoPDF,
            'gerarDadosTestes': this.gerarDadosTestes,
        }
        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Testes' nomeTela='Início' />
                <AreaDados dadosApp={dadosApp} funcoes={funcoes} />
                <AreaBotoes botoes={botoesTela} />
            </View>
        );
    }
}

// TestesInicio.navigationOptions = ({navigation, route}) => {
//     return {
//         headerTitle: '',        
//         headerRight: () => {},
//     }
// };

export class AreaDados extends Component {

    constructor(props) {
        super(props);
    }

    atualizarDados(oDadosCliente) {
        let oDadosNavegacao = this.props.dados_app;
        oDadosNavegacao.cliente = oDadosCliente;
        
        this.setState(oDadosNavegacao);
    }

    render() {
        let oDadosCliente = this.props.dadosApp.cliente;
        let oFuncoes = this.props.funcoes;

        return (
            <ScrollView>
                <View style={{flex: 1, flexDirection: 'column', }}>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' }}>
                        <View style={{height:50}} >
                            <Button title="Cadastro Iter" onPress={oFuncoes.irParaTesteCadastroIter} ></Button>
                        </View>
                        <View style={{height:50}} >
                            <Button title="Contrato PDF" onPress={oFuncoes.irParaTesteContratoPDF}></Button>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' }}>
                        <View style={{height:50}} >
                            <Button title="Boleto GerenciaNet" onPress={oFuncoes.irParaTesteBoletoGerenciaNet} ></Button>
                        </View>
                        <View style={{height:50}} >
                            <Button title="Menu" ></Button>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' }}>
                        <View style={{height:50}} >
                            <Button title="Gerar CPF" onPress={oFuncoes.gerarDadosTestes} ></Button>
                        </View>                        
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' }}>
                        <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center' }}>
                            <Input label="Nome Completo" style={styles.Input} value={oDadosCliente.nome} onChangeText={(valor) => { oDadosCliente.nome = valor; this.atualizarDados(oDadosCliente) }}></Input>                
                            <Input label="E-mail" style={styles.Input} value={oDadosCliente.email} onChangeText={(valor) => { oDadosCliente.email = valor; this.atualizarDados(oDadosCliente) }}></Input>
                            <Input label="CPF" style={styles.Input} value={oDadosCliente.cpf} onChangeText={(valor) => { oDadosCliente.cpf = valor; this.atualizarDados(oDadosCliente) }}></Input>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}