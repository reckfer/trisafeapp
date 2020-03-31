import {
    Alert,
} from 'react-native';

const fragmentoClienteInicio = { 
    'cliente': {
        'cpf': '', 
        'email': '', 
    }
}
const fragmentoClienteDadosPessoais = { 
    'cliente': {
        'nome': '', 
        'cpf': '', 
        'rg': '', 
        'email': '', 
        'nomeUsuario': '',
        'telefone': '',
    }
}

const fragmentoClienteEndereco = { 
    'cliente': {
        'cidade': '',
        'rua': '',
        'numero': '',
        'complemento': '',
        'bairro': '',
        'cep': '',
        'uf': '',
    }
}

const fragmentoProduto = { 
    'produto': {
        'codigo': '',
        'nome': '',
    }
}

// const fragmentoProdutosContratados = { 
//     'produtos_contratados': [
//         fragmentoProduto
//     ]
// }

const fragmentoContrato = { 
    'contrato': {
        'id_contrato': '',
        'cliente': {},
        'produtos_contratados': [
            fragmentoProduto,
        ],
        'valor_total': 0.0,
        'charge_id' : '',
        'dt_hr_inclusao' : '',
        'ult_atualizacao' : '',
    }
}

const composicaoDadosCliente = [
    fragmentoClienteInicio,
    fragmentoClienteDadosPessoais,
    fragmentoClienteEndereco,
]

const composicaoDadosApp = { 
    'dadosApp' : [
        composicaoDadosCliente,
        fragmentoContrato,
    ]
}

export default class Util {
    oDadosReferencia;

    constructor(){
        //this.inicializarDadosCliente = this.montarFragmento.bind(this);
        this.inicializarDadosCliente = this.inicializarDadosCliente.bind(this);
        this.inicializarDadosContrato = this.inicializarDadosContrato.bind(this);
        this.oDadosReferencia = null;
    }
    
    getURL(metodo){
        protocol = 'https://';
        domain = 'trisafeserverappheroku.herokuapp.com';

        if (__DEV__) {
            protocol = 'http://';
            domain = '192.168.0.3:8000';
        }
        return protocol + domain + metodo;
    }

    obterJsonResposta(oRespostaHTTP) {
        if(oRespostaHTTP) {
            if(oRespostaHTTP.ok) {            
                return oRespostaHTTP.json();            
            } else {
                Alert.alert("Erro HTTP status: " + oRespostaHTTP.status + 
                ". URL: " + oRespostaHTTP.url);
            }
        }
        return null;
    }

    tratarRetornoServidor(oJsonRetorno, oFuncaoTratarDados, suprimirMsgServidor) {
        
        if(oJsonRetorno) {
            let oEstado = oJsonRetorno.estado;
            let oDados = oJsonRetorno.dados;

            if (!suprimirMsgServidor && oEstado.mensagem && oEstado.mensagem.trim()){
                Alert.alert(oEstado.mensagem);
            }
            
            if(oDados && typeof(oDados) === 'string' && oDados.trim()) {
                oDados = oDados.trim();
            }
            
            oFuncaoTratarDados(oDados, oEstado);
        } else {
            Alert.alert("O retorno do servidor foi vazio.");
        }
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
    

    // inicializarDados(oNavigation) {
    //     let oDadosAppGeral;
        
    //     if(oNavigation) {
    //         let oDadosApp = oNavigation.getParam('dadosApp');
    //         if(oDadosApp) {
    //             oDadosAppGeral = {
    //                 'dadosApp' : oDadosApp,
    //             }
    //         }
    //     }

    //     if(!oDadosAppGeral) {
    //         oDadosAppGeral = { 'dadosApp' : {
    //                 'cliente': this.inicializarDadosCliente(),
    //                 'contrato': this.inicializarDadosContrato(),
    //                 'processandoRequisicao': false,
    //                 'emCadastro': false,
    //                 'emTestes': false,
    //             }
    //         }
    //     }


    //     return oDadosAppGeral;
    // }
    montarDadosApp(oComposicaoDadosApp) {
        let oDadosApp = {};
        let oFragmentoRaiz;
        
        let chavesDadosRaiz = Object.keys(oComposicaoDadosApp);

        if(chavesDadosRaiz) {
            let oDadosFragmento = {};

            for(let i = 0; i < chavesDadosRaiz.length; i++) {
                oFragmentoRaiz = oComposicaoDadosApp[chavesDadosRaiz[i]];
                
                if(oFragmentoRaiz instanceof Array) {
                    this.montarFragmentoLista(oDadosFragmento, oFragmentoRaiz);
                } else {
                    this.montarFragmento(oDadosFragmento, oFragmentoRaiz);
                }
                
                oDadosApp[chavesDadosRaiz[i]] = oDadosFragmento;
            }
        }
        return oDadosApp;
    }

    montarFragmentoLista(oDadosFragmento, oFragmentoLista) {
        let chavesCampos;
        let chaveCampo;
        let oItemFragmento = {};
        let oFragmento;
        let fragmentosProcessar;

        for (let i = 0; i < oFragmentoLista.length; i ++) {
            oFragmento = oFragmentoLista[i];

            if(oFragmento instanceof Array) {
            
                oFragmentoLista = this.nivelarListas(oFragmentoLista, oFragmento, i);
                // Reinicia o loop a partir da nova lista.
                i = -1;
            } else {
                chavesCampos = Object.keys(oFragmento);

                if(chavesCampos && chavesCampos.length > 0) {
                    chaveCampo = chavesCampos[0];

                    if(oFragmento[chaveCampo] instanceof Array) {
                        oDadosFragmento[chaveCampo] = oFragmento[chaveCampo];
                    } else {
                        if (!oDadosFragmento.hasOwnProperty(chaveCampo)) {
                            oDadosFragmento[chaveCampo] = {};
                        }

                        oItemFragmento = oFragmento[chaveCampo];
                        fragmentosProcessar = this.preencherFragmento(oDadosFragmento, oItemFragmento, chaveCampo);
                        this.adicionarArray(oFragmentoLista, fragmentosProcessar);
                    }
                }
            }
        }
    }

    nivelarListas(aListaMae, aListaFilha, indice) {
        let aListaNivelada = aListaFilha;

        for(let i = 0; i < aListaMae.length; i++) {
            if (i > indice) {
                aListaNivelada.push(aListaMae[i]);
            }
        }
        return aListaNivelada;
    }

    adicionarArray(aListaMae, aListaAdicionar) {
        if(aListaAdicionar.length > 0) {
            for(let i = 0; i < aListaAdicionar.length; i++) {
                aListaMae.push(aListaAdicionar[i]);
            }
        }
    }

    preencherFragmento(oObjetoPrincipalFinal, oItemFragmento, chaveCampo) {
        let oObjetoPrincipal = oObjetoPrincipalFinal[chaveCampo];
        let fragmentosProcessar = [];
        let oObjetoProcessar;
        let temCampo = false;
        let incluir = false;
        
        for (campo in oItemFragmento) {            
            incluir = false
            oObjetoPrincipal[campo] = oItemFragmento[campo];

            if(oItemFragmento[campo] instanceof Array) {                
                oObjetoProcessar = {};
                oObjetoProcessar[campo] = oItemFragmento[campo];
                fragmentosProcessar.push(oObjetoProcessar);
            } else if (oItemFragmento[campo] instanceof Object) {
                temCampo = false;
                for (campoTmp in oObjetoPrincipal[campo]) {            
                    temCampo = true;
                    break;
                }
                if(!temCampo) {
                    oObjetoPrincipal[campo] = oObjetoPrincipalFinal[campo];
                }
            }
        }
        return fragmentosProcessar;
    }

    inicializarDadosCliente() {
        let oCliente = {};
        let oFragmento;
        let qtdItens = composicaoCliente.length;

        for(let i = 0; i < qtdItens; i++) {
            oFragmento = composicaoCliente[i];

            this.montarFragmento(oCliente, oFragmento);
        }
        return oCliente;
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
    inicializarDados(oNavigation) {
        
        if(!this.oDadosReferencia){
            this.oDadosReferencia = this.montarDadosApp(composicaoDadosApp);
        }

        if(oNavigation) {
            let oDadosApp = oNavigation.getParam('dadosApp');

            if(oDadosApp) {
                this.atribuirDados('', oDadosApp);
            }
        }

        return this.oDadosReferencia;
    }

    atribuirDados(nomeAtributo, oDadosAtribuir) {
        let oDados = this.oDadosReferencia.dadosApp;

        for (campo in oDados) {
            if(nomeAtributo) {
                if(nomeAtributo === campo) {
                    this.atribuirDadosObjeto(oDados[nomeAtributo], oDadosAtribuir);
                }
            }
            else
            {
                if(oDados[campo] instanceof Array) {
                    if(oDados[campo].length > 0) {
                        let oArrayDados = oDados[campo];
                        let oItemArray = oArrayDados[0];
                        let oDadosItem = {};
                        let oArrayAtribuir = oDadosAtribuir[campo];                        
                        let campoItem = Object.keys(oItemArray)[0];
                        oArrayDados.length = 0;
                        for(let i = 0; i < oArrayAtribuir.length; i++) {
                            for(campoNovo in oItemArray[campoItem]) {
                                oDadosItem[campoNovo] = '';
                            }
                            
                            this.atribuirDadosObjeto(oDadosItem, oArrayAtribuir[i][campoItem]);
                            oArrayDados.push(oDadosItem);
                        }
                        
                    }
                } else {
                    this.atribuirDadosObjeto(oDados[campo], oDadosAtribuir[campo]);
                }
            }
        }

        return this.oDadosReferencia;
    }

    atribuirDadosObjeto(oObjetoReceber, oDadosAtribuir) {        
        for(campo in oObjetoReceber) {
            oObjetoReceber[campo] = this.atribuir(campo, oDadosAtribuir);
        }
    }

    atribuir(nomeAtributo, oDadosAtribuir) {
        for(campo in oDadosAtribuir) {
            if(nomeAtributo === campo) {
                return oDadosAtribuir[nomeAtributo];
            }
        }
    }
}