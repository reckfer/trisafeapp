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
    Text
} from 'react-native';
import Util from './common/Util';
import { ThemeProvider, Button, ButtonGroup } from 'react-native-elements';
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-cards';
import Cabecalho from './common/CabecalhoTela';
import { styles, theme } from './common/Estilos';
import AreaBotoes from './common/AreaBotoes';

export default class ProdutoEscolha extends Component {
    static navigationOptions = {
        title: 'ProdutoEscolha'
    }
    constructor(props) {
        super(props);
        
        this.limpar = this.limpar.bind(this);
        this.voltar = this.voltar.bind(this);
        this.listarProdutos = this.listarProdutos.bind(this);
        this.tratarListarProdutos = this.tratarListarProdutos.bind(this);
        this.contratar = this.contratar.bind(this);
        this.tratarContratar = this.tratarContratar.bind(this);        
        this.capturarDadosFiltroCallBack = this.capturarDadosFiltroCallBack.bind(this);
        
        objUtil = new Util();
        let estadoInicial = objUtil.inicializarDadosCliente();
        this.state = estadoInicial;

        this.listarProdutos();
    }

    listarProdutos(){
        try {
            let estado = this.state;            
            let url = objUtil.getURL('/produtos/listar/');

            fetch(url, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                }),
              })
                .then(objUtil.obterJsonResposta)
                .then((oJsonDados) => {
                    objUtil.tratarRetornoServidor(oJsonDados, this.tratarListarProdutos, true);
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

    tratarListarProdutos(oDados, oEstado) {
        
        if(oEstado.cod_mensagem === 'NaoCadastrado') {
            Alert.alert('Nenhum produto TriSafe cadastrado.');
        } else if (oEstado.mensagem && oEstado.mensagem.trim()) {
            Alert.alert(oEstado.mensagem);
        }
        console.log(oDados);
        if(oDados && Array.isArray(oDados)) {
            let estado = this.state;
            
            let oContrato = {
                'valorTotal': 0.00,
                'listaProdutos': oDados,
            }
            estado.contrato = oContrato;
            
            this.setState(estado);
        }
    }

    // atribuirDadosContrato(oJsonDados) {
    //     this.limpar();
    //     if(oJsonDados && oJsonDados.dados) {
    //         let estado = this.state;

    //         estado.codigo = oJsonDados.dados.id.toString();
    //         estado.nomeCliente = oJsonDados.dados.name;            
    //         estado.nomeUsuario = oJsonDados.dados.dadosName;
    //         estado.cpf = oJsonDados.dados.document;
    //         estado.email = oJsonDados.dados.email;
    //         estado.telefone = oJsonDados.dados.telefone;
            
    //         this.setState(estado);
    //     } else if (oJsonDados.mensagem && oJsonDados.mensagem.trim()){
    //         Alert.alert(oJsonDados.mensagem);
    //     } else {
    //         Alert.alert('Cadastrado não localizado.');
    //     }
    // }

    contratar() {
        try {
            let url = objUtil.getURL('/contratos/efetivar/');
            let estado = this.state;
            
            estado.processandoRequisicao = true;
            this.setState(estado);

            fetch(url, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(estado)
                  })
                  .then(objUtil.obterJsonResposta)
                  .then((oJsonDados) => {
                      objUtil.tratarRetornoServidor(oJsonDados, this.tratarContratar, true);
                  })

        //     const { navigation } = this.props;
        // var estado = this.state;

        // estado.processandoRequisicao = false;
        // let contrato = {
        //     'valorTotal': 0,
        //     'listaProdutos': [],
        //     'boleto': {
        //         'url_boleto_pdf': '',
        //         'url_boleto_html': '',
        //     }
        // }
        // estado.contrato = contrato;
        // estado.emCadastro = false;
        
        // this.setState(estado);
        // navigation.navigate('BoletoEmissao', this.state);
        } catch (exc) {
            Alert.alert(exc);
        }
    }

    tratarContratar(oDados, oEstado) {
        
        if (oEstado.mensagem && oEstado.mensagem.trim()) {
            Alert.alert(oEstado.mensagem);
        }

        const { navigation } = this.props;
        var estado = this.state;

        estado.processandoRequisicao = false;
        let contrato = {
            'valorTotal': estado.contrato.valorTotal,
            'listaProdutos': estado.contrato.listaProdutos,
            'boleto': {
                'url_boleto_pdf': oDados.url_boleto_pdf,
                'url_boleto_html': oDados.url_boleto_html,
            }
        }
        estado.contrato = contrato;
        estado.emCadastro = false;
        
        this.setState(estado);
        navigation.navigate('BoletoEmissao', this.state);
    }

    limpar() {
        let estado = this.state;

        estado.codigo = '';
        estado.nomeCliente = '';
        estado.nomeUsuario = '';
        estado.cpf = '';
        estado.rg = '';
        estado.email = '';
        this.setState(estado);
    }

    capturarDadosFiltroCallBack(oDadosFiltro) {
        let estado = this.state;
        
        estado.codigo = oDadosFiltro.codigo;
        this.setState(estado);
    }
    
    voltar() {
        const { navigation } = this.props;
        
        navigation.navigate('ClienteConfirmacao', this.state);
    }

    botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>;        
    
    render() {
        let contrato = this.state.contrato;

        let botoesTela = [ { element: this.botaoVoltar }];
        
        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Produto' nomeTela='Contratação' />
                <AreaDados parentCallBack={this.capturarDadosFiltroCallBack} contratar={this.contratar} contrato={contrato}/>
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
        let listaProdutos = this.props.contrato.listaProdutos;
        var listaProdutosCartao = [];
        let oCard;
        let oProduto;
        let produtoFormatado;
        let valorTotal = 0.00;

        for(let i = 0; i < listaProdutos.length; i++)  {
            
            oProduto = listaProdutos[i];
            valorTotal += Number.parseFloat(oProduto.valor);
            produtoFormatado = oProduto.nome + ' = R$ ' + oProduto.valor;
            
            oCard = <CardContent text={produtoFormatado} key={oProduto.codigo} />;
            listaProdutosCartao.push(oCard);
        }
        botaoVoltar = () => <Button title="Contratar" onPress={this.voltar} ></Button>;
        let botoesCard = [ { element: this.botaoVoltar }];

        // oCard = <CardContent text={produtoFormatado} key={oProduto.codigo} />;

        return (
            <ScrollView>
                <ThemeProvider theme={theme}>                    
                    <Card>
                        {/* <CardImage 
                            source={{uri: 'http://bit.ly/2GfzooV'}} 
                            title="Top 10 South African beaches"
                        /> */}
                        <CardTitle
                            title="Serviço de Rastreamento"
                            style={styles.areaCentralizadoEmLinha}
                        />
                        {listaProdutosCartao}
                        <CardAction>
                            <View style={styles.areaTitulo}>
                                <Text style={styles.textoTitulo}>Total: R$ {valorTotal}</Text>
                            </View>
                        </CardAction>
                        <CardAction 
                            separator={true} 
                            inColumn={false}>
                            <View style={styles.areaCentralizadoEmLinha}>
                                <CardButton
                                onPress={this.props.contratar}
                                title="Contratar"
                                color="#FEB557"
                                />
                            </View>
                        </CardAction>
                    </Card>
                </ThemeProvider>
            </ScrollView>            
        );
    }
}