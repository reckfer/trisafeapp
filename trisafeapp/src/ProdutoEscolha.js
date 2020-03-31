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
import GerenciadorDadosApp from './common/GerenciadorDadosApp';

export default class ProdutoEscolha extends Component {
    static navigationOptions = {
        title: 'ProdutoEscolha'
    }
    constructor(props) {
        super(props);
        let oNavigation = this.props.navigation;
        this.voltar = this.voltar.bind(this);
        this.listarProdutos = this.listarProdutos.bind(this);
        this.tratarListarProdutos = this.tratarListarProdutos.bind(this);
        this.contratar = this.contratar.bind(this);
        this.tratarContratar = this.tratarContratar.bind(this);
    
        // let dados = oGerenciadorDadosApp.inicializarDados();
        // const { navigation } = this.props;
        
        // // Obtem os dados vindos da tela anterior.
        // let dadosCliente = dados.cliente;
        // oUtil.lerDadosNavegacao(dadosCliente, navigation);
        // dados.cliente = dadosCliente;

        // this.state = dados;

        oUtil = new Util();
        oGerenciadorDadosApp = new GerenciadorDadosApp(oNavigation);

        this.state = oGerenciadorDadosApp.getDadosAppGeral();
        
        this.listarProdutos();
    }

    listarProdutos(){
        try {
            let url = oUtil.getURL('/produtos/listar/');

            fetch(url, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                }),
              })
                .then(oUtil.obterJsonResposta)
                .then((oJsonDados) => {
                    oUtil.tratarRetornoServidor(oJsonDados, this.tratarListarProdutos, true);
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
            oGerenciadorDadosApp.atribuirDados('produtos_contratados', oDados);

            let valorTotal = 0.00;
            for(let i = 0; i < oDados.length; i++)  {
            
                oProduto = oDados[i];
                valorTotal += Number.parseFloat(oProduto.valor);
            }
            let oDadosAppGeral = oGerenciadorDadosApp.getDadosAppGeral();
            
            // let oContrato = {
            //     'valorTotal': valorTotal,
            //     'listaProdutos': oDados,
            // }
            oDadosAppGeral.dadosApp.contrato.valorTotal = valorTotal;
            
            this.setState(oDadosAppGeral);
        }
    }

    contratar() {
        try {
            let url = oUtil.getURL('/contratos/efetivar/');
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
                  .then(oUtil.obterJsonResposta)
                  .then((oJsonDados) => {
                      oUtil.tratarRetornoServidor(oJsonDados, this.tratarContratar);
                  })
        } catch (exc) {
            Alert.alert(exc);
        }
    }

    tratarContratar(oDados) {
        const { navigation } = this.props;
        var oDadosAppGeral = this.state;
        
        if(oDados) {
            oDadosAppGeral.processandoRequisicao = false;
            let contrato = {
                'valorTotal': oDadosAppGeral.contrato.valorTotal,
                'listaProdutos': oDadosAppGeral.contrato.listaProdutos,
                'boleto': {
                    'url_boleto_pdf': oDados.url_boleto_pdf,
                    'url_boleto_html': oDados.url_boleto_html,
                }
            }
            oDadosAppGeral.contrato = contrato;
        }
        oDadosAppGeral.emCadastro = false;
        
        this.setState(oDadosAppGeral);
        navigation.navigate('BoletoEmissao', this.state);
    }
    
    voltar() {
        const { navigation } = this.props;
        let telaDestino = 'ClienteConfirmacao';

        if(navigation.getParam('emTestes')) {
            telaDestino = 'TestesInicio';
        }
        navigation.navigate(telaDestino, this.state);
    }

    botaoVoltar = () => <Button title="Voltar" onPress={this.voltar} ></Button>;        
    
    render() {
        let dadosApp = this.state.dadosApp;
        
        let botoesTela = [ { element: this.botaoVoltar }];
        
        return (
            <View style={styles.areaCliente}>
                <Cabecalho titulo='Produto' nomeTela='Contratação' />
                <AreaDados contratar={this.contratar} dadosApp={dadosApp}/>
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
        let listaProdutos = this.props.dadosApp.contrato.produtos_contratados;
        var listaProdutosCartao = [];
        let oCard;
        let oProduto;
        let produtoFormatado;
        let valorTotal = this.props.dadosApp.contrato.valorTotal;

        for(let i = 0; i < listaProdutos.length; i++)  {
            
            oProduto = listaProdutos[i];
            produtoFormatado = oProduto.nome + ' = R$ ' + oProduto.valor;
            
            oCard = <CardContent text={produtoFormatado} key={oProduto.codigo} />;
            listaProdutosCartao.push(oCard);
        }
        botaoVoltar = () => <Button title="Contratar" onPress={this.voltar} ></Button>;
        // let botoesCard = [ { element: this.botaoVoltar }];

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