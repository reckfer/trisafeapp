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
        'valor': '',
        'tipo': '',
    }
}

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

export default class GerenciadorDadosApp {
    oDadosReferencia;

    constructor(oDadosAppGeral) {
        if(oDadosAppGeral){
            this.inicializarDados(oDadosAppGeral);
        }
    }

    getDadosAppGeral() {
        return this.oDadosReferencia;
    }

    setDadosAppGeral(oDadosAppGeral) {
        this.oDadosReferencia = oDadosAppGeral;
    }

    /*** FUNCOES MONTAGEM OBJETO INICIAL ****/

    inicializarDados(oDadosAppGeral) {

        if(oDadosAppGeral) {
            let oDadosApp;

            if(oDadosAppGeral.getParam) {
                oDadosApp = oDadosAppGeral.getParam('dadosApp');
            }
            if(oDadosApp) {
                this.oDadosReferencia = { 'dadosApp': oDadosApp };
            } else {
                if(!this.oDadosReferencia){
                    this.oDadosReferencia = this.montarDadosApp(composicaoDadosApp);
                }
                if(oDadosAppGeral.dadosApp){
                    oDadosApp = oDadosAppGeral;
                }
                if(oDadosApp) {
                    this.atribuirDados('', oDadosApp);
                }
            }            
        }

        return this.oDadosReferencia;
    }

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
        let oFragmentoModelo;
        let oFragmento;
        let fragmentosProcessar;
        let listaReferenciada;

        for (let i = 0; i < oFragmentoLista.length; i ++) {
            oFragmento = oFragmentoLista[i];

            if(oFragmento instanceof Array) {
                // Nivela lista não nomeada.
                oFragmentoLista = this.nivelarListas(oFragmentoLista, oFragmento, i);
                // Reinicia o loop a partir da nova lista.
                i = -1;
            } else {
                chavesCampos = Object.keys(oFragmento);

                if(chavesCampos && chavesCampos.length > 0) {
                    chaveCampo = chavesCampos[0];

                    if(oFragmento[chaveCampo] instanceof Array) {
                        listaReferenciada = oFragmento[chaveCampo];
                        // Nivela lista nomeada.
                        oFragmentoLista = this.nivelarListas(oFragmentoLista, oFragmento[chaveCampo], i);
                        // Reinicia o loop a partir da nova lista.
                        i = 0;
                        oFragmento = oFragmentoLista[i];
                        oFragmentoModelo = this.clonarObjeto(oFragmento[Object.keys(oFragmento)[0]]);
                        
                        listaReferenciada.length = 0;
                        listaReferenciada.push(oFragmentoModelo);
                        oDadosFragmento[chaveCampo] = listaReferenciada;
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

    /*** FUNCOES DE ATRIBUICOES ****/

    atribuirDados(nomeAtributo, oDadosAtribuir) {
        let oDados = this.oDadosReferencia.dadosApp;
        let oArrayDados;
        let oItemArray;
        let oDadosItemModelo;
        let oDadosItem;
        let oArrayAtribuir;                        
        let campoItem;
        let atribuir;
        
        for (campo in oDados) {
            atribuir = true;

            if(nomeAtributo) {
                atribuir = false;
                if(nomeAtributo === campo) {
                    atribuir = true;
                    //this.atribuirDadosObjeto(oDados[nomeAtributo], oDadosAtribuir);
                    oDadosAtribuir[campo] = oDadosAtribuir;
                }
            }

            if(atribuir) {
                if(oDados[campo] instanceof Array) {
                    if(oDados[campo].length > 0) {
                        oArrayDados = oDados[campo];
                        oItemArray = oArrayDados[0];
                        oDadosItemModelo = {};
                        oArrayAtribuir = oDadosAtribuir[campo];                        
                        campoItem = Object.keys(oItemArray)[0];
                        // // Copia o modelo do objeto.
                        // for(campoNovo in oItemArray) {
                        //     oDadosItemModelo[campoNovo] = '';
                        // }
                        oDadosItemModelo = this.clonarObjeto(oItemArray);
                        oArrayDados.length = 0;
                        for(let i = 0; i < oArrayAtribuir.length; i++) {
                            oDadosItem = {};
                            for(campoNovo in oDadosItemModelo) {
                                oDadosItem[campoNovo] = '';
                            }
                            
                            this.atribuirDadosObjeto(oDadosItem, oArrayAtribuir[i]);
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

    /*** FUNCOES AUXILIARES ****/
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

    clonarObjeto(objeto) {
        let novoObjeto = {};

        // Copia o modelo do objeto.
        for(campoNovo in objeto) {
            novoObjeto[campoNovo] = '';
        }
        return novoObjeto;
    }
}