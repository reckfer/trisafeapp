const fragmentoClienteInicio = {
    'a': '',
}

const fragmentoClienteDadosPessoais = {
    'a': '',
}

const fragmentoClienteEndereco = {
    'a': '',
}

export default class GerenciadorDadosApp {
    constructor(){
        this.inicializarDadosCliente = this.inicializarDadosCliente.bind(this);
        this.inicializarDadosContrato = this.inicializarDadosContrato.bind(this);
    }

    // lerDadosNavegacao(dados, navigation) {
    //     let valor;

    //     if(dados) {
    //         let dadosCliente;
    //         let dadosContrato;

    //         dadosCliente = navigation.getParam('cliente');
    //         dadosContrato = navigation.getParam('contrato');
            
    //         if(dadosCliente) {
    //             for(chave in dadosCliente) {
    //                 valor = dadosCliente[chave];
    //                 if(typeof(valor) === 'string' && valor.trim()) {
    //                     dados[chave] = valor;
    //                 }                
    //             }
    //         }
    //         if(dadosContrato) {
    //             for(chave in dadosContrato) {
    //                 valor = dadosContrato[chave];
    //                 if(typeof(valor) === 'string' && valor.trim()) {
    //                     dados[chave] = valor;
    //                 }                
    //             }
    //         }
    //     }
    // }

    inicializarDados(oNavigation) {
        let oDadosAppGeral;
        
        if(oNavigation) {
            let oDadosApp = oNavigation.getParam('dadosApp');
            if(oDadosApp) {
                oDadosAppGeral = {
                    'dadosApp' : oDadosApp,
                }
            }
        }

        if(!oDadosAppGeral) {
            oDadosAppGeral = { 'dadosApp' : {
                    'cliente': this.inicializarDadosCliente(),
                    'contrato': this.inicializarDadosContrato(),
                    'processandoRequisicao': false,
                    'emCadastro': false,
                    'emTestes': false,
                }
            }
        }

        return oDadosAppGeral;
    }

    montarFragmento(oPrincipal, oFragmento) {
        for (campo in oFragmento) {            
            oPrincipal[campo] = oFragmento[campo];
        }
    }

    inicializarDadosCliente() {
        let oCliente = {};
        this.montarFragmento(oCliente, fragmentoClienteInicio);
        this.montarFragmento(oCliente, fragmentoClienteDadosPessoais);
        this.montarFragmento(oCliente, fragmentoClienteEndereco);

        return oCliente;
        // return {
        //     'nome': '', 
        //     'cpf': '', 
        //     'rg': '', 
        //     'email': '', 
        //     'nomeUsuario': '',
        //     'telefone': '',
        //     'cidade': '',
        //     'rua': '',
        //     'numero': '',
        //     'complemento': '',
        //     'bairro': '',
        //     'cep': '',
        //     'uf': '',
        // };
    }

    inicializarDadosContrato() {
        return {
            'valorTotal': 0.00,
            'listaProdutos': [],
            'boleto': {
                'url_boleto_pdf': '',
                'url_boleto_html': '',
            }
        };
    }

    temDados(oDadosAppGeral) {
        if(oDadosAppGeral && oDadosAppGeral.dadosApp) {
            let oDadosApp = oDadosAppGeral.dadosApp;
            
            if(oDadosApp && oDadosApp.cliente) {
                if(oDadosApp.cliente.cpf || oDadosApp.cliente.email) {
                    return true;
                }
            }
        }
        return false;
    }
}