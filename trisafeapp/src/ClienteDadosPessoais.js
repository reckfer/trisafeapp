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
    View,
} from 'react-native';
import Util from './common/Util';
import { ThemeProvider, Input, Button } from 'react-native-elements';
import Cabecalho from './common/CabecalhoTela';
import { styles, theme } from './common/Estilos';
import AreaBotoes from './common/AreaBotoes';

export default class ClienteDadosPessoais extends Component {
    static navigationOptions = {
        title: 'ClienteDadosPessoais'
    }
    constructor(props) {
        super(props);
        this.limpar = this.limpar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.confirmar = this.confirmar.bind(this);
        this.atribuirDadosCliente = this.atribuirDadosCliente.bind(this);
        this.capturarDadosCadastro = this.capturarDadosCadastro.bind(this);
        
        objUtil = new Util();
        this.state = objUtil.inicializarDadosCliente();
    }

    tratarRetornoJson(oJsonResposta) {
    
        Alert.alert(oJsonResposta.mensagem);
        if(oJsonResposta && !oJsonResposta.ok) {
            
            return null;
        }
        return oJsonResposta;
    }

    atribuirDadosCliente(oJsonDados) {
        this.limpar();
        if(oJsonDados && oJsonDados.dados) {
            let estado = this.state;

            estado.codigo = oJsonDados.dados.id.toString();
            estado.nomeCliente = oJsonDados.dados.name;            
            estado.nomeUsuario = oJsonDados.dados.dadosName;
            estado.cpf = oJsonDados.dados.document;
            estado.email = oJsonDados.dados.email;
            estado.telefone = oJsonDados.dados.telefone;
            
            this.setState(estado);
        } else if (oJsonDados.mensagem && oJsonDados.mensagem.trim()){
            Alert.alert(oJsonDados.mensagem);
        } else {
            Alert.alert('Cadastrado não localizado.');
        }
    }

    limpar() {
        let estado = this.state;

        estado.codigo = '';
        estado.nomeCliente = '';
        estado.nomeUsuario = '';
        estado.cpf = '';
        estado.rg = '';
        estado.email = '';
        estado.telefone = '';
        this.setState(estado);
    }

    confirmar() {
        const { navigation } = this.props;
        
        // if(this.validarDadosPessoais()) {
            this.state.emCadastro = false;
            navigation.navigate('ClienteEndereco', this.state);
        // }
    }

    voltar() {
        const { navigation } = this.props;
        
        navigation.navigate('ClienteInicio', this.state);
    }
        
    capturarDadosCadastro(oDadosCadastro) {
        let estado = this.state;
    
        estado.cpf = oDadosCadastro.cpf;
        estado.rg = oDadosCadastro.rg;
        estado.nome = oDadosCadastro.nome;
        estado.nomeUsuario = oDadosCadastro.nomeUsuario;
        estado.email = oDadosCadastro.email;
        estado.telefone = oDadosCadastro.telefone;
        estado.emCadastro = true;
        
        this.setState(estado);
    }

    render() {
        let dadosCliente = this.state;
        const { navigation } = this.props;        
        let botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>
        let botaoAvancar = () => <Button title="Avançar" onPress={this.confirmar} ></Button>
        
        let botoesTela = [ { element: botaoVoltar }, { element: botaoAvancar } ];

        if(!dadosCliente.emCadastro) {
            // Obtem os dados vindos da primeira tela.
            objUtil.lerDadosNavegacao(dadosCliente, navigation);
        }
        
        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Cadastro' nomeTela='Meus dados' />
                <AreaDados capturarDadosCallBack={this.capturarDadosCadastro} dadosCliente={dadosCliente}/>
                <AreaBotoes botoes={botoesTela}/>
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
                        <Input placeholder="Informe seu Nome Completo" label="Nome Completo" value={this.props.dadosCliente.nome} onChangeText={(valor) => { this.props.dadosCliente.nome = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu E-Mail" label="E-mail" onChangeText={(valor) => { this.props.dadosCliente.email = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}>{this.props.dadosCliente.email}</Input>
                        <Input placeholder="Informe seu CPF" label="CPF" value={this.props.dadosCliente.cpf} onChangeText={(valor) => { this.props.dadosCliente.cpf = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu RG" label="RG" value={this.props.dadosCliente.rg} onChangeText={(valor) => { this.props.dadosCliente.rg = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>                
                        <Input placeholder="Informe seu Telefone" label="Telefone" value={this.props.dadosCliente.telefone} onChangeText={(valor) => { this.props.dadosCliente.telefone = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                        <Input placeholder="Informe seu Nome de Usuário" label="Nome de Usuário" value={this.props.dadosCliente.nomeUsuario} onChangeText={(valor) => { this.props.dadosCliente.nomeUsuario = valor; this.props.capturarDadosCallBack(this.props.dadosCliente)}}></Input>
                    </View>
                </ThemeProvider>
            </ScrollView>
        );
    }
}