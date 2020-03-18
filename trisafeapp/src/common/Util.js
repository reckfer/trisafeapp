import {
    Alert,
} from 'react-native';

export default class Util {

    constructor(){
        this.inicializarDadosCliente = this.inicializarDadosCliente.bind(this);
        this.inicializarDadosContrato = this.inicializarDadosContrato.bind(this);
    }
    
    getURL(metodo){
        protocol = 'https://';
        domain = 'trisafeserverappheroku.herokuapp.com';

        if (__DEV__) {
            protocol = 'http://';
            domain = '192.168.0.2:8000';
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

    lerDadosNavegacao(dados, navigation) {
        let valor;

        if(dados) {
            let dadosCliente;
            let dadosContrato;

            dadosCliente = navigation.getParam('cliente');
            dadosContrato = navigation.getParam('contrato');
            
            if(dadosCliente) {
                for(chave in dadosCliente) {
                    valor = dadosCliente[chave];
                    if(typeof(valor) === 'string' && valor.trim()) {
                        dados[chave] = valor;
                    }                
                }
            }
            if(dadosContrato) {
                for(chave in dadosContrato) {
                    valor = dadosContrato[chave];
                    if(typeof(valor) === 'string' && valor.trim()) {
                        dados[chave] = valor;
                    }                
                }
            }
        }
    }

    inicializarDados() {
        return {
            'cliente': this.inicializarDadosCliente(),
            'contrato': this.inicializarDadosContrato(),
            'processandoRequisicao': false,
            'emCadastro': false,
        }
    }

    inicializarDadosCliente() {
        return {
            'nome': '', 
            'cpf': '', 
            'rg': '', 
            'email': '', 
            'nomeUsuario': '',
            'telefone': '',
            'cidade': '',
            'rua': '',
            'numero': '',
            'complemento': '',
            'bairro': '',
            'cep': '',
            'uf': '',
        };
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
}