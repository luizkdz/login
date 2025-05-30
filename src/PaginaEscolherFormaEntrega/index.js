import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Header from "../componentes/header";
import './styles.css'
import Footer from "../componentes/footer";
import { Radius } from "lucide-react";
import { useCarrinho } from "../context/carrinhoContext";
import axios from "axios";
import { useCep } from "../context/CepContext";
import ModalEditarEndereco from "../componentes/modalEditarEndereco";
import ModalAdicionarEndereco from "../componentes/modalAdicionarEndereco";
import {useStripe, useElements,CardNumberElement,CardExpiryElement,CardCvcElement} from '@stripe/react-stripe-js';
import { useNavigate } from "react-router-dom";
function PaginaEscolherFormaEntrega(){

    const [mostrarCardFormaEntrega, setMostrarCardFormaEntrega] = useState(false);
    const [mostrarEnvioCard, setMostrarEnvioCard] = useState(false);
    const [mostrarModalComoPagar, setMostrarModalComoPagar] = useState(false);
    const [mostrarReviseEConfirme, setMostrarReviseEConfirme] = useState(false);
    const [step,setStep] = React.useState(1);
    const isPoppingState = useRef(false);
    const [tipoDeDocumento, setTipoDeDocumento] = useState(`CPF`);
    const [virarCartao, setVirarCartao] = useState(false);
    const [imagemCartao, setImagemCartao] = useState("/images/contactless-metodos-pagamento.png");
    const [prazos, setPrazos] = useState({});
    const [precoEnvio, setPrecoEnvio] = useState({});
    const [localidade, setLocalidade] = useState({});
    const [estadoUF,setEstadoUF] = useState({});
    const {obterCarrinho, carrinhoItens} = useCarrinho();
    const [fretesSelecionados, setFretesSelecionados] = useState({});
    const [estado,setEstado] = useState(null);
    const [cidade,setCidade] = useState(null);
    const {cep} = useCep();
    const [selecionarOpcaoDePagamento, setSelecionarOpcaoDePagamento] = useState(null);
    const [imagemOpcaoPagamento, setImagemOpcaoPagamento] = useState("");
    const [selecioneUmaOpcao, setSelecioneUmaOpcao] = useState(false);
    const [endereco,setEndereco] = useState([]);
    const [editarEndereco, setEditarEndereco] = useState(false);
    const [mostrarMeusEnderecos, setMostrarMeusEnderecos] = useState(false);
    const [adicionarEndereco, setAdicionarEndereco] = useState(false);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
    const [enderecoEnvio, setEnderecoEnvio] = useState(null);
    const [selecionarEndereco, setSelecionarEndereco] = useState(null);
    const [selecionarEnderecoEnvio, setSelecionarEnderecoEnvio] = useState(null);
    const [atualizarEnderecos, setAtualizarEnderecos] = useState(false);
    const [cartoesDeCreditoSalvos, setCartoesDeCreditoSalvos] = useState([]);
    const [selecionarIdCartao, setSelecionarIdCartao] = useState(null);
    const [numeroCartao, setNumeroCartao] = useState('');
    const [nomeTitularCartao, setNomeTitularCartao] = useState("");
    const [vencimentoCartao, setVencimentoCartao] = useState("");
    const [codigoSeguranca, setCodigoSegurança] = useState("");
    const [documentoTitular, setDocumentoTitular] = useState("");
    const [bandeira, setBandeira] = useState("");
    const [selecionarEnderecoEntrega, setSelecionarEnderecoEntrega] = useState("");
    const [enderecoEscolhido, setAtualizarEnderecoEscolhido] = useState(false);
    const [parcelasSelecionadas, setParcelasSelecionadas] = useState({});
    const [numeroParcelas,setNumeroParcelas] = useState(1);
    const [statusPagamento, setStatusPagamento] = useState("");
    const [idPagamentoBoleto, setIdPagamentoBoleto] = useState("");
    const [precoTotalProdutos, setPrecoTotalProdutos] = useState(null);
    const [boletoPago, setBoletoPago] = useState("");
    const [erroCartao, setErroCartao] = useState(false);
    const cartaoSelecionado = cartoesDeCreditoSalvos.find((item) => item.id === selecionarIdCartao);
    const navigate = useNavigate();

    
    const handleErroCartao = () => {
        setErroCartao(true);
        setTimeout(() => {
            setErroCartao(false);
        },3000)
    }
    
    const handleSimularPagarBoleto = async (boletoId) => {
        try{
            const resposta = await axios.post(`http://localhost:5000/confirmar-pagamento-boleto/${boletoId}`)
            if(resposta.status === 200){
                setBoletoPago("pago");
                setIdPagamentoBoleto("");
            }
        }
        catch(err){
            console.log(err);
        }
    }


    const calcularFreteTotal = () =>
        Object.values(precoEnvio).reduce((total, valor) => total + parseFloat(valor), 0);
    
    
    const carrinhoComFrete = carrinhoItens.map((item) => ({
    ...item,
            frete: parseFloat(precoEnvio[item.id])
    }));

    const calcularPrecoProdutos = () => {
        return carrinhoItens.reduce((soma, item) => {
            return soma + Number(item.preco) * Number(item.quantidade);
        },0)
    }
    
    
    const calcularPrecoTotal = () => {
       const precoTotal = calcularFreteTotal() + (precoTotalProdutos || calcularPrecoProdutos())
       return Number(precoTotal);

    } 
    const [valorParcela, setValorParcela] = useState(calcularPrecoTotal());
    const numeroParcelasMaximas = 12
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentIntent, setPaymentIntent] = useState(null);
    const stripe = useStripe();
    const elements = useElements();
    const [boletoUrl, setBoletoUrl] = useState(null);

    const handleInputChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // remove não dígitos
        value = value.substring(0, 16); // limita a 16 dígitos

        // adiciona espaço a cada 4 dígitos
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');

        setNumeroCartao(value);
    };


const adicionarCartaoStripe = async () => {
    try{
        const resposta = await axios.post("http://localhost:5000/salvar-cartao-stripe",{
                numeroCartao,
                nomeTitularCartao,
                vencimentoCartao,
                tipoDeDocumento,
                documentoTitular,
                bandeira},{withCredentials:true})
        const result = await stripe.confirmCardSetup(resposta.data.clientSecret,{
            payment_method:{
                card:elements.getElement(CardNumberElement),
            billing_details:{
                name:nomeTitularCartao
            }
            }
        })
        if(result.error){
            console.error("Erro ao salvar o cartão");
            handleErroCartao();
        }
        else {
            console.log("Cartão salvo com sucesso");
            handleBack();
        }

        const paymentMethodId = result.setupIntent.payment_method;

        await axios.post("http://localhost:5000/salvar-cartao-id",{paymentMethodId,nomeTitularCartao},{withCredentials:true});
        
        
    }
    catch(err){
        console.log(err);

    }
}

const handleListarCartoesStripe = async () => {
    try{
        const resposta = await axios.get("http://localhost:5000/listar-cartoes-stripe",{withCredentials:true});
        setCartoesDeCreditoSalvos(resposta.data);
        
    }
    catch(err){
        console.log(err);
    }
}


const handleStripeCartao = async () => {
  try {
    const response = await axios.post(
  "http://localhost:5000/criar-pagamento-cartao",
  {
    valorTotal: calcularPrecoTotal(),
    paymentMethodId: selecionarIdCartao
  },
  {
    headers: {
      "Content-Type": "application/json"
    },
    withCredentials: true // 
  }
);

    const data = await response.data;

    if (data.error) {
      console.error("Erro no backend:", data.error);
      return;
    }

    // Nesse caso, como é pagamento off_session com cartão salvo, 
    // o pagamento já está confirmado no backend (com confirm: true).
    if (data.clientSecret) {
      const result = await stripe.retrievePaymentIntent(data.clientSecret);

      if (result.paymentIntent.status === "succeeded") {
        const respostaPedidoId = await handleConfirmarCompra();

            
        setStatusPagamento("sucess");
        const itensPorVendedor = {};
        carrinhoItens.forEach((item) => {
        const vendedorId = item.usuario_id_dono_produto;
        console.log(`vendedorId`,vendedorId);
        if(!itensPorVendedor[vendedorId]){
            itensPorVendedor[vendedorId] = [];
        }
        itensPorVendedor[vendedorId].push(item);
    })

    console.log(`ipve,`,itensPorVendedor);

  for(const [vendedorId,itens] of Object.entries(itensPorVendedor)){
    const precoFreteTotal = itens.reduce((total, item) => {
    const freteItem = parseFloat(precoEnvio[item.id]) || 0;
    return total + freteItem;
  }, 0);
  const precoItensTotal = itens.reduce((total, item) => {
    const precoItem = parseFloat(item.preco * item.quantidade);
    return total + precoItem;
  },0);
  
    await axios.post("http://localhost:5000/adicionar-nova-venda",{
            vendedorId:vendedorId,
            itens,
            metodoPagamento:selecionarOpcaoDePagamento,
            total:precoItensTotal,
            enderecoLogradouro:enderecoEnvio.logradouro || enderecoSelecionado.logradouro,
            enderecoCidade:enderecoEnvio.cidade  || enderecoSelecionado.cidade,
            enderecoNumero:enderecoEnvio.numero  || enderecoSelecionado.numero,
            enderecoComplemento:enderecoEnvio.complemento  || enderecoSelecionado.complemento,
            enderecoEstado:estado,
            parcelas:numeroParcelas,
            valorParcelas:valorParcela,
            precoFrete:precoFreteTotal,
            pedidoId:respostaPedidoId
        },{withCredentials:true})
        console.log(itens);
  }
        return true;
      } else {
        if(result.paymentIntent.status === "processing"){
            setStatusPagamento("analise")
        }
        if(result.paymentIntent.status === "requires_payment_method"){
            setStatusPagamento("failed");
        }
        
      }
    }

  } catch (err) {
    console.log("Erro ao processar pagamento:", err);
  }
};


const handleStripeBoleto = async () => {
    const response = await fetch("http://localhost:5000/criar-boleto", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ valorTotal: calcularPrecoTotal(), nome: "João", email: "joao@email.com" }),
});
const { clientSecret, boletoUrl } = await response.json();

  setStatusPagamento("sucess");
  const respostaPedidoId = await handleConfirmarCompra();

    const itensPorVendedor = {};

    carrinhoItens.forEach((item) => {
        const vendedorId = item.usuario_id_dono_produto;
        if(!itensPorVendedor[vendedorId]){
            itensPorVendedor[vendedorId] = [];
        }
        itensPorVendedor[vendedorId].push(item);
    })

  for(const [vendedorId,itens] of Object.entries(itensPorVendedor)){
    const precoFreteTotal = itens.reduce((total, item) => {
    const freteItem = parseFloat(precoEnvio[item.id]) || 0;
    return total + freteItem;
  }, 0);
  const precoItensTotal = itens.reduce((total, item) => {
    const precoItem = parseFloat(item.preco * item.quantidade);
    return total + precoItem;
  },0);
    const resposta = await axios.post("http://localhost:5000/adicionar-nova-venda",{
            vendedorId:vendedorId,
            itens,
            metodoPagamento:selecionarOpcaoDePagamento,
            total:precoItensTotal,
            enderecoLogradouro:enderecoEnvio?.logradouro || enderecoSelecionado?.logradouro,
            enderecoCidade:enderecoEnvio?.cidade || enderecoSelecionado?.cidade,
            enderecoNumero:enderecoEnvio?.numero || enderecoSelecionado?.numero,
            enderecoComplemento:enderecoEnvio?.complemento || enderecoSelecionado?.complemento,
            enderecoEstado:estado,
            parcelas:numeroParcelas,
            valorParcelas:valorParcela,
            precoFrete:precoFreteTotal,
            pedidoId:respostaPedidoId,
            statusVenda:"Aguardando Pagamento"
        },{withCredentials:true}) 
        setIdPagamentoBoleto(resposta.data);
  }
 


setClientSecret(clientSecret);

setBoletoUrl(boletoUrl);

 
return true;
}

    
    const handleConfirmarCompra = async () => {
       try{
        
        const resposta = await axios.get(`http://localhost:5000/enderecos/${selecionarEnderecoEntrega}`,{withCredentials:true});
        const enderecoEnvio = resposta.data
        console.log(`eee`,enderecoEnvio);
        const itensParaEnviar = carrinhoItens.map((item) => { return ({
            nome:item.nome,
            quantidade:item.quantidade,
            preco:item.preco,
            imagem:item.imagem_produto,
            produto_id:item.produto_id,
            prazo:prazos[item.produto_id],
            frete:precoEnvio[item.id],
            cores:item.cores,
            dimensoes:`${item.larguras}${item.dimensoes_unidade} x ${item.alturas}${item.dimensoes_unidade} x ${item.comprimentos}${item.dimensoes_unidade}`,
            estampas:item.estampas,
            generos:item.generos,
            materiais:item.materiais,
            pesos:`${item.pesos}${item.pesos_unidade}`,
            tamanhos:item.tamanhos,
            voltagens:`${item.voltagens}V`,
            freteSelecionado:item.frete_selecionado
        })});


       const cartaoSelecionado = cartoesDeCreditoSalvos.find((item) => item.id === selecionarIdCartao);
       const cartaoUsadoParaEnviar = cartaoSelecionado ? {numero:cartaoSelecionado.numero_mascarado,
        expiracao:cartaoSelecionado.data_expiracao} : null;

        console.log(`ee`,enderecoEnvio);
        console.log(`es`,enderecoSelecionado);

        const pedido = {
            itens:itensParaEnviar,
            valorFrete:calcularFreteTotal(),
            valorTotal:calcularPrecoTotal(),
            metodoPagamento:selecionarOpcaoDePagamento,
            enderecoEnvio:enderecoEnvio,
            imagemMetodoPagamento:imagemOpcaoPagamento,
            cartaoUsado:cartaoUsadoParaEnviar,
            parcelas:numeroParcelas,
            valorParcela:valorParcela
        }
        

        const resultado = await axios.post("http://localhost:5000/confirmar-compra",{
            pedido
        },{withCredentials:true})
        return resultado.data.pedidoId;   
    }
        catch(err){
            console.error("Não foi possivel confirmar a compra");
        }
        
   
    }


    function detectarBandeira(numero) {
        numero = numero.replace(/\D/g, ''); // Remove espaços e caracteres não numéricos
      
        const regexes = {
          visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
          mastercard: /^5[1-5][0-9]{14}$/};

          for (const [bandeira, regex] of Object.entries(regexes)) {
            if (regex.test(numero)) {
              return bandeira;
            }
          }
        
          return 'desconhecida';
        }
        



    const fetchEnderecoEnvio = async () => {
        try{
            const resposta = await axios.get(`http://localhost:5000/enderecos/${selecionarEndereco}`,{withCredentials:true});
            setEnderecoEnvio(resposta.data);
            setSelecionarEnderecoEnvio(resposta.data.id_endereco);
            console.log(`idenrecoe`,resposta.data.id_endereco);
           
            carrinhoItens.map( async (item) => {
              const respostaCEP = await axios.post(`http://localhost:5000/calcular-prazo-preco`, {
            cepOrigem:item.cep_origem,    
            cepDestino:resposta.data.cep 
            }, {withCredentials: true});

            setPrazos((prev) => ({
                ...prev,
                [item.produto_id]: respostaCEP.data.prazoEmDias
            }))
            setPrecoEnvio((prev) => ({
                ...prev,
                [item.id]: respostaCEP.data.precoEnvio
                }));
            setLocalidade((prev) => ({
            ...prev,
            [item.produto_id]: respostaCEP.data.localidade
            }));
            setEstadoUF((prev) => ({
            ...prev,
            [item.produto_id]: respostaCEP.data.estado
            }));
            

        })
        setAtualizarEnderecoEscolhido(!enderecoEscolhido);
            setSelecionarEnderecoEntrega(resposta.data.id_endereco);
        }
        catch(err){
            console.error("Não foi possivel carregar o endereço de envio");
        }
        
        
    }


    const handleMostrarMeusEnderecos = () => {
        setMostrarMeusEnderecos(true);
    }

    const handleAdicionarEndereco = () => {
        setAdicionarEndereco(true);
        
    }

    const fetchEndereco = async () => {
        try{
            const resposta = await axios.get("http://localhost:5000/enderecos",{withCredentials:true});
            setEndereco(resposta.data);
            
            const enderecoFiltrado = resposta.data.filter((item) => {return item.padrao === 1});
            
            
                setSelecionarEnderecoEnvio(enderecoFiltrado[0].id_endereco);
                setSelecionarEnderecoEntrega(enderecoFiltrado[0].id_endereco);
               
            
            
            carrinhoItens.map( async (item) => {
            const respostaCEP = await axios.post(`http://localhost:5000/calcular-prazo-preco`, {
            cepOrigem:item.cep_origem,    
            cepDestino:enderecoFiltrado[0].cep 
            }, {withCredentials: true});
            
            setPrazos((prev) => ({
                ...prev,
                [item.produto_id]: respostaCEP.data.prazoEmDias
            }))
            setPrecoEnvio((prev) => ({
                ...prev,
                [item.id]: respostaCEP.data.precoEnvio
                }));
            setLocalidade((prev) => ({
            ...prev,
            [item.produto_id]: respostaCEP.data.localidade
            }));
            setEstadoUF((prev) => ({
            ...prev,
            [item.produto_id]: respostaCEP.data.estado
            }));

            
        
        })
        
        
        }
        catch(err){
            console.error("Não foi possivel carregar o endereço");
        }
    }



    function handleSelecioneUmaOpcao() {
        setSelecioneUmaOpcao(true);
        setTimeout(() => {
            setSelecioneUmaOpcao(false);
        },3000)
    }

    const [erroEndereco,setErroEndereco] = useState(false);
    
    function handleErroEndereco() {
        setErroEndereco(true);
        setTimeout(() => {
            setErroEndereco(false);
        },3000)
    }

    

    

    


    const calcularPrazo = async (produtoId) => {
        try{
            const resposta = await axios.get(`http://localhost:5000/calcular-frete/${cep}/${produtoId}`)
            const {cidade,estado, prazo} = resposta.data;
            
        
        }
        catch(err){
            console.error("Não possivel calcular o prazo");
        }
    }

    
    const handleVirarCartao = () => {
        setVirarCartao(true);
        setTimeout(() => {
            setImagemCartao(`/images/card-back.png`)
        },350);
    }
    const handleDesvirarCartao = () => {
        setVirarCartao(false);
        setTimeout(() => {
            setImagemCartao("/images/contactless-metodos-pagamento.png")
        },300);
    }



    const handleSelectChange = (e) => {
        setTipoDeDocumento(e.target.value);
    }

    const handleEditarEndereco = () => {
        setEditarEndereco(true);
        
    }

    useEffect(() => {
        if (!isPoppingState.current) {
            window.history.pushState({ step }, '');
        } else {
            isPoppingState.current = false;
        }
    }, [step]);
    
    useEffect(() => {
        const onPopState = (event) => {
            if (event.state) {
                isPoppingState.current = true;
                setStep(event.state.step);
                
            }
        };
    
        window.addEventListener('popstate', onPopState);
        return () => {
            window.removeEventListener('popstate', onPopState);
        };
        
    }, []);
    useEffect(() => {
        console.log(`step atualizado para`, step);
    
        if (step === 1) {
            handleMostrarCardFormaEntrega();
        } else if (step === 2) {
            
            handleMostrarEnvioCard();
        } else if (step === 3) {
            handleMostrarEnvioCard();
            handleMostrarModalComoPagar();
        } else if (step === 4) {
            handleMostrarModalComoPagar();
            handleMostrarReviseEConfirme();
        }
        obterCarrinho();
    }, []);

    

    useEffect(() => {
        const inicial = {};
        carrinhoItens.forEach(item => {
          
            inicial[item.produto_id] = true; 
          
        });
        setFretesSelecionados(inicial);
      }, [carrinhoItens]);

    
      useEffect(() => {
        fetchEndereco();
        console.log("oi");
    },[carrinhoItens]);
    

    useEffect(() => {
        handleListarCartoesStripe();
    },[cartoesDeCreditoSalvos]);

    const handleNext = () => {
        setStep((prev) => prev + 1);
        console.log(step + 1);
    };
    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const entregaConcluida = step === 3 || step === 4 || ((step === 5) && (selecionarOpcaoDePagamento === "Cartao"));

    const imagemPagamento = entregaConcluida
  ? "/images/credit-card-pagina-entrega-azul.png"
  : "/images/credit-card-pagina-entrega.png";

const classePagamento = entregaConcluida
  ? "imagem-icone-pagina-entrega-azul"
  : "imagem-icone-pagina-entrega";

    const imagemEntrega = entregaConcluida
    ? "/images/cargo-truck-pagina-entrega-verde.png"
    : "/images/cargo-truck-pagina-entrega-azul.png";

    const classeEntrega = entregaConcluida
  ? "imagem-icone-pagina-entrega-verde"
  : "imagem-icone-pagina-entrega-azul";

    function handleMostrarReviseEConfirme(){
        setMostrarReviseEConfirme(!mostrarReviseEConfirme);
    }
    
    function handleMostrarModalComoPagar(){
        setMostrarModalComoPagar(!mostrarModalComoPagar);
    }

    function handleMostrarEnvioCard(){
        setMostrarEnvioCard(!mostrarEnvioCard);
    }
    function handleMostrarCardFormaEntrega(){
        setMostrarCardFormaEntrega(!mostrarCardFormaEntrega);
    }


const valorTotal = calcularPrecoTotal();


    return (
        <div className="pagina-toda-forma-entrega">
            <Header props="d"/>
            
            {((step !== 5) && (selecionarOpcaoDePagamento !== "Cartao")) || ((step !== 6) && (selecionarOpcaoDePagamento === "Cartao"))  ? <div className="container-icones-pagina-forma-entrega">
                <div className="icone-texto-pagina-forma-entrega">
                <img src = "/images/shopping-cart-pagina-entrega-verde.png" className="imagem-icone-pagina-entrega-verde"/>
                <p style={{fontSize:"12px"}} >Carrinho</p>
                </div>
                <div className="icone-texto-pagina-forma-entrega">
                <img src = "/images/user-pagina-entrega-verde.png" className="imagem-icone-pagina-entrega-verde"/>
                <p style={{fontSize:"12px"}} >Identificação</p>
                </div>
                <div className="icone-texto-pagina-forma-entrega">
                <img src = {imagemEntrega} className={classeEntrega}/>
                <p style={{fontSize:"12px"}} >Entrega</p>
                </div>
                <div className="icone-texto-pagina-forma-entrega">
                <img src = {imagemPagamento} className={classePagamento}/>
                <p style={{fontSize:"12px"}}>Pagamento</p>
                </div>
            </div> : ""}
            {((step !== 5) && (selecionarOpcaoDePagamento !== "Cartao")) || ((step !== 6) && (selecionarOpcaoDePagamento === "Cartao")) ? <div className="container-pagina-forma-entrega">
                {step === 1 && (
                    <div className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Escolha a forma de entrega</p>
                    <div className="card-forma-entrega">
                        {enderecoEnvio !== null ? <div className="container-card-forma-entrega">
                            <input checked={selecionarEndereco === enderecoEnvio.id_endereco} value={selecionarEndereco} onChange={() => {setSelecionarEndereco(enderecoEnvio.id_endereco);setSelecionarEnderecoEntrega(enderecoEnvio.id_endereco)}} type="radio" className="input-radio-forma-entrega"/>
                            <div className="container-texto-forma-entrega">
                            <p style={{fontWeight:"bold"}}>Enviar no meu endereço</p>
                            <p>{enderecoEnvio.logradouro} {enderecoEnvio.numero} {enderecoEnvio.complemento} -{enderecoEnvio.cidade} <br/> {enderecoEnvio.tipo_do_local}</p>
                            </div>
                            <p>R${calcularFreteTotal().toFixed(2)}</p>
                        </div> : endereco.filter((item) => {return item.padrao === 1}).length > 0 ? endereco.filter((item) => {return item.padrao === 1}).map((item) => {return (
                            <div className="container-card-forma-entrega">
                            <input checked = {item.id_endereco === selecionarEnderecoEnvio} value={selecionarEnderecoEnvio} onChange={()=>{setSelecionarEnderecoEnvio(item.id_endereco);setSelecionarEnderecoEntrega(item.id_endereco)}} type="radio" className="input-radio-forma-entrega"/>
                            <div className="container-texto-forma-entrega">
                            <p style={{fontWeight:"bold"}}>Enviar no meu endereço</p>
                            <p>{item.logradouro} {item.numero} {item.complemento} -{item.cidade} <br/> {item.tipo_do_local}</p>
                            </div>
                            <p>R${calcularFreteTotal().toFixed(2)}</p>
                        </div>
                        )}) : <div style={{paddingTop:"10px",display:"flex",alignItems:"center",flexDirection:"column",gap:"20px"}}><img src="/images/house-endereco.png" style={{width:"100px",height:"100px"}}/><p style={{fontWeight:"bold"}}>Adicione um endereço padrão</p>
                         <button onClick ={() => {navigate("/minha-conta/enderecos")}} style={{backgroundColor:"#111111",border:"none",borderRadius:"6px",color:"white",width:"100%",height:"40px"}}>Adicionar endereço padrão</button></div>}
                        <div className="container-alterar-endereco-pagina-forma-entrega">
                            {endereco.filter((item) => {return item.padrao === 1}).length > 0 ? <a href="#" onClick={() => {handleNext();handleMostrarMeusEnderecos()}}>Alterar endereço ou escolher outro</a>: ""}
                        </div>
                    </div>
                    <button className="botao-continuar-forma-entrega" onClick={() => {setMostrarMeusEnderecos(false);
                    if(selecionarEndereco || selecionarEnderecoEnvio)
                    {   
                            handleNext()

                    }
                    else{
                        handleErroEndereco();
                    };handleMostrarCardFormaEntrega();handleMostrarEnvioCard()}}>Continuar</button>
                </div>
                )}
                <div
  style={{
    position: "fixed",
    bottom: erroEndereco ? "20px" : "-100px", // começa fora da tela
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#111111",
    color: "#ffffff",
    padding: "20px",
    width: "600px",
    borderRadius: "6px",
    margin: "20px",
    transition: "bottom 0.3s ease-in-out", // efeito suave
  }}
>
  Selecione um endereço para continuar
</div>
                {step === 2 && mostrarMeusEnderecos ? <div style={{alignItems:"center"}}className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Meus endereços</p>
                    <div style={{position:"relative"}}className="card-forma-entrega">
                        {endereco.map((item) => {return (
                            <div>
                            <div style={{gap:"20px",alignItems:"start"}}className="container-card-forma-entrega">
                            <input checked={item.id_endereco === selecionarEndereco} value={selecionarEndereco} onChange={() => setSelecionarEndereco(item.id_endereco)} style={{marginTop:"3px"}}type="radio" className="input-radio-forma-entrega"/>
                            <div style={{gap:"20px"}}className="container-texto-forma-entrega">
                            <p style={{fontWeight:"bold"}}>{item.logradouro} {item.numero}</p>
                            <p>{item.cidade}, {item.estado} - CEP {item.cep}</p>
                            <p>{item.nome_destinatario} - Telefone:{item.telefone}</p>
                            </div>
                        </div>
                        <div className="container-alterar-endereco-pagina-forma-entrega">
                            <a onClick={() => {setAdicionarEndereco(false);handleNext();setEnderecoSelecionado(item.id_endereco);handleEditarEndereco()}}style={{textDecoration:"none",color:"#3483fa"}}href="#">Editar</a>
                        </div>
                        </div>
                        
                    )})
                        }    
                        <div >
                        <button style={{marginBottom:"20px",position:"absolute",left:"0",backgroundColor:"rgb(52, 131, 250)",border:"none"}}className="botao-continuar-forma-entrega" onClick={() => {setStep(1);fetchEnderecoEnvio();}}>Continuar</button>
                        <button style={{marginBottom:"20px",position:"absolute",left:"150px", backgroundColor:"rgb(52, 131, 250)", border:"none"}}className="botao-continuar-forma-entrega" onClick={() => {setEditarEndereco(false);handleNext();handleAdicionarEndereco()}}>Adicionar Endereço</button>
                        </div>

                    </div>
                    
                </div> : ""}
                {step === 3 && editarEndereco ?  <ModalEditarEndereco atualizarEnderecos ={atualizarEnderecos} setAtualizarEnderecos={setAtualizarEnderecos} handleBack={handleBack} enderecoId={enderecoSelecionado}/> : ""}
                {step === 3 && adicionarEndereco ? <ModalAdicionarEndereco atualizarEnderecos ={atualizarEnderecos} setAtualizarEnderecos={ setAtualizarEnderecos}handleBack={handleBack} /> : ""}
                
                {step === 2 && !mostrarMeusEnderecos && (<div className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Escolha quando sua compra irá chegar</p>
                    {carrinhoItens.map((item,index) => { return ( 

                        <div style={{display:"flex",flexDirection:"column",gap:"30px"}}>
                            <div className="card-forma-entrega">
                        <div className="container-card-forma-entrega-envio">
                            <div className="container-input-texto-envio">
                            <div className="container-texto-forma-entrega">
                            <p style={{fontWeight:"bold"}}>Envio {index + 1}</p>
                            </div>
                            </div>
                            <img src ={item.imagem_produto} style={{width:"75px",height:"75px",borderRadius:"50%"}} />
                            </div>
                            <div className="container-dias-uteis">
                            <div className="container-input-tempo-entrega">
                            <input value={item.produto_id} onChange={() => {
          setFretesSelecionados(prev => ({
            ...prev,
            [item.produto_id]: true
          }));
        }} checked={fretesSelecionados[item.produto_id] === true} type="radio" className="input-radio-forma-entrega"/> <p>Daqui {prazos[item.produto_id]} dias úteis</p>
                            </div>
                            <p>R${precoEnvio[item.id]}</p>
                            </div>
                            
                           
                    </div>
                    
                        </div>
                        
                    )
                    })}
                    <div className="card-frete-pagina-entrega">
                            <div className="container-card-frete-pagina-entrega">
                                <p>Frete Total</p>
                                <p>R${calcularFreteTotal().toFixed(2)}</p>
                            </div>
                           </div>
                    <button className="botao-continuar-forma-entrega" onClick={() => {setEditarEndereco(false);setAdicionarEndereco(false);handleNext();handleMostrarEnvioCard();handleMostrarModalComoPagar()}}>Continuar</button>
                </div>

                )}
                {step === 3 && !editarEndereco && !adicionarEndereco ? <div className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Escolha como pagar</p>
                    <div className="card-forma-entrega-pagamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-input-texto-envio">
                            <div className="container-texto-forma-entrega">
                            <div className="container-input-pix">
                            <input type="radio" className="input-radio-forma-entrega" checked={selecionarOpcaoDePagamento === "Pix"} onChange={() => {setSelecionarOpcaoDePagamento("Pix"); setImagemOpcaoPagamento("/images/icone-pix.png")}}/>
                            <img src="/images/icone-pix.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Pix</p>
                            <p>Aprovação imediata</p>
                            </div>
                            </div>
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    {cartoesDeCreditoSalvos.map((item) => { return (
                        <div className="card-forma-entrega">
                        <div className="container-card-forma-entrega">
                                <div className="container-input-texto-envio">
                                <div className="container-texto-forma-entrega">
                                <div className="container-input-pix">
                                <input type="radio" className="input-radio-forma-entrega" value={item.id} checked={selecionarOpcaoDePagamento === "Cartao" && item.id === selecionarIdCartao} onChange={() => {setSelecionarOpcaoDePagamento("Cartao");setSelecionarIdCartao(item.id); setImagemOpcaoPagamento("/images/contactless-metodos-pagamento.png")}}/>
                                <img src="/images/contactless-metodos-pagamento.png" className="logo-icones-pagamento-pagina-entrega"/>
                                <div className="container-texto-pix">
                                <p style={{fontWeight:"bold"}}> **** **** **** {item.card.last4}</p>
                                <p>{item.card.exp_month}/{item.card.exp_year}</p>
                                <p style={{fontWeight:"bold"}}>{item.card.display_brand}</p>
                                </div>
                                
                                </div>
                                </div>
                                
                                </div>
                                
                                </div>
                                </div>
                                )
                    }) }
                            <div className="card-forma-entrega">
                            <div className="container-input-pix">
                            <input type="radio" className="input-radio-forma-entrega" checked={selecionarOpcaoDePagamento === "novoCartao"} onChange={() => {setSelecionarOpcaoDePagamento("novoCartao"); setImagemOpcaoPagamento("/images/")}}/>
                            <img src="/images/credit-card-pagina-pagamento.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Novo cartão de crédito</p>
                            </div>
                            </div>
                            </div>
                            <div className="card-forma-entrega">
                            <div className="container-card-forma-entrega">
                            <div className="container-input-texto-envio">
                            <div className="container-texto-forma-entrega">
                            <div className="container-input-pix">
                            <input type="radio" className="input-radio-forma-entrega" checked={selecionarOpcaoDePagamento === "Boleto"} onChange={() => {setSelecionarOpcaoDePagamento("Boleto"); setImagemOpcaoPagamento("/images/numbers-metodos-pagamento.png")}}/>
                            <img src="/images/numbers-metodos-pagamento.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Boleto Bancário</p>
                            <p>Aprovação em 1 a 2 dias úteis</p>
                            </div>
                            </div>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                    
                    <button className="botao-continuar-forma-entrega" onClick={() => { if(selecionarOpcaoDePagamento !== null){
                        handleNext();handleMostrarModalComoPagar();handleMostrarReviseEConfirme()}
                        else{
                            handleSelecioneUmaOpcao();
                        }
                    }}>Continuar</button>
                </div> : ""}

                {((step === 4) && (selecionarOpcaoDePagamento !== "novoCartao") && (selecionarOpcaoDePagamento !== "Cartao")) &&
( <div className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Revise e confirme</p>
                    

                    <p>Faturamento</p>
                    <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img src="/images/contract.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Luiz Gustavo Cardoso</p>
                            <p>CPF:111.111.111.11</p>
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Modificar dados de faturamento</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    <p>Detalhe da entrega</p>
                    <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img src="/images/gps.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            {endereco.filter((item) => {
                               return selecionarEndereco !== null ? selecionarEndereco === item.id_endereco : selecionarEnderecoEnvio === item.id_endereco
                            }).map((item) => {return (
                                <p style={{fontSize:"16px",fontWeight:"bold"}}>{item.logradouro} - {item.numero} {item.complemento ? `Complemento :${item.complemento}` : ""}</p>
                            )})}
                            
                            <div className="container-endereco-alterar-endereco">
                            <p style={{fontSize:"14px"}}>Entrega no endereço</p>
                            <p style={{cursor:"pointer",fontSize:"14px",color:"#3483fa"}}>Alterar endereço</p>
                            </div>
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Alterar endereço ou escolher outro</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    
                    {carrinhoItens.map((item,index) => {return (
                        <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img style={{borderRadius:"50%"}}src={item.imagem_produto} className="logo-icones-pagamento-pagina-entrega"/>
                            
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Envio {index + 1}</p>
                            <p style={{fontSize:"14px"}}>Chegará em {prazos[item.produto_id]} dias úteis</p>
                            <p style={{fontSize:"14px"}}>{item.produto_nome}</p>
                            <p style={{fontSize:"14px"}}>Quantidade: {item.quantidade}</p>
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Alterar data de entrega</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    )})}
                    <p>Detalhe do pagamento</p>
                    <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img src = {imagemOpcaoPagamento} className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>{selecionarOpcaoDePagamento}</p>
                                 {selecionarOpcaoDePagamento === "Cartao" ?
                                cartoesDeCreditoSalvos.filter((item) => {return item.id === selecionarIdCartao}).map((item) => {return <div style={{display:"flex",gap:"30px"}}>
                                    <p style={{fontWeight:"bold"}}> **** **** **** {item.card.last4}</p>
                                 <p>{item.card.exp_month}/{item.card.exp_year}</p>
                                <p style={{fontWeight:"bold"}}>{item.card.display_brand}</p>
                                    </div>}) :""}

                            <p>R$ {calcularPrecoTotal().toFixed(2)}</p>
                            
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Alterar forma de pagamento</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    
                </div> )}
                {((step === 5) && (selecionarOpcaoDePagamento === "Cartao")) &&
( <div className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Revise e confirme</p>
                    
  



                    <p>Faturamento</p>
                    <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img src="/images/contract.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Luiz Gustavo Cardoso</p>
                            <p>CPF:111.111.111.11</p>
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Modificar dados de faturamento</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    <p>Detalhe da entrega</p>
                    <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img src="/images/gps.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            {endereco.filter((item) => {
                               return selecionarEndereco !== null ? selecionarEndereco === item.id_endereco : selecionarEnderecoEnvio === item.id_endereco
                            }).map((item) => {return (
                                <p style={{fontSize:"16px",fontWeight:"bold"}}>{item.logradouro} - {item.numero} {item.complemento ? `Complemento :${item.complemento}` : ""}</p>
                            )})}
                            
                            <div className="container-endereco-alterar-endereco">
                            <p style={{fontSize:"14px"}}>Entrega no endereço</p>
                            <p style={{fontSize:"14px",color:"#3483fa"}}>Alterar endereço</p>
                            </div>
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Alterar endereço ou escolher outro</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    
                    {carrinhoItens.map((item,index) => {return (
                        <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img style={{borderRadius:"50%"}}src={item.imagem_produto} className="logo-icones-pagamento-pagina-entrega"/>
                            
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Envio {index + 1}</p>
                            <p style={{fontSize:"14px"}}>Chegará em {prazos[item.produto_id]} dias úteis</p>
                            <p style={{fontSize:"14px"}}>{item.produto_nome}</p>
                            <p style={{fontSize:"14px"}}>Quantidade: {item.quantidade}</p>
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Alterar data de entrega</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    )})}
                    <p>Detalhe do pagamento</p>
                    <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img src = {imagemOpcaoPagamento} className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>{selecionarOpcaoDePagamento}</p>
                                 {selecionarOpcaoDePagamento === "Cartao" ?
                                cartoesDeCreditoSalvos.filter((item) => {return item.id === selecionarIdCartao}).map((item) => {return <div style={{display:"flex",gap:"30px"}}>
                                    <p style={{fontWeight:"bold"}}> **** **** **** {item.card.last4}</p>
                                <p>{item.card.exp_month}/{item.card.exp_year}</p>
                                <p style={{fontWeight:"bold"}}>{item.card.display_brand}</p>
                                    </div>}) :""}

                            <p>R$ {calcularPrecoTotal().toFixed(2)}</p>
                            <p>{numeroParcelas}x R${valorParcela || calcularPrecoTotal().toFixed(2)}</p>
                            </div>
                            </div>
                            <div className="container-modificar-dados-faturamento">
                            <a style={{fontSize:"14px",textDecoration:"none",color:"#3483fa"}} href="#">Alterar forma de pagamento</a>
                            </div>
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    
                </div> )}
                {step === 4 && (selecionarOpcaoDePagamento === "novoCartao") ? <div style={{alignItems:"center"}}className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Adicione um novo cartão</p>
                    
                    <div style={{width:"700px"}}className="card-forma-entrega-pagamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-input-texto-envio">
                            <div className="container-texto-forma-entrega">
                            <div className="container-input-pix">
                            
                            <img style={{boxSizing:"border-box",border:"2px solid #c1c1c1",borderRadius:"50%", padding:"10px",width:"70px",height:"70px",backgroundColor:"#ffffff"}}src="/images/credit-card-pagina-pagamento.png" className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>Novo cartão de crédito</p>
                            
                            </div>
                            </div>
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    <div style={{flexDirection:"row",width:"700px",alignItems:"center",gap:"75px",position:"relative"}}className="card-forma-entrega">
                    <div className="container-card-forma-entrega">
                            <div className="container-input-texto-envio">
                            <div className="container-texto-forma-entrega">
                            <div style={{flexDirection:"column",alignItems:"start"}} className="container-input-pix">

                            <div className="container-texto-pix">
                            <p style={{fontSize:"14px"}}>Número do cartão</p>
                            <div style={{position:"relative",backgroundColor:"#ffffff" ,width: "300px", maxWidth: "400px", padding: "10px", border: "1px solid #ccc", borderRadius:"6px" }}>
  
  <CardNumberElement
  options={{
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  }}
/>
<img src="/images/credit-card-pagina-pagamento.png" style={{position:"absolute",right:"5px",bottom:"4px",width:"30px",height:"30px"}}/>
  </div>
                            </div>
                            <div className="container-texto-pix">
                            <p style={{fontSize:"14px"}}>Nome do titular</p>
                            <div style={{display:"flex",position:"relative", alignItems:"center"}}className="container-input-imagem-cartao">
                            <input maxLength={50} onChange={(e) => {setNomeTitularCartao(e.target.value)}} value={nomeTitularCartao} style={{border:"1px solid #c1c1c1",borderRadius:"6px",width:"300px",padding:"10px"}} placeholder="Ex: João da Silva"/>
                            </div>
                            </div>
                            <div style ={{display:"flex",gap:"15px"}}className="container-vencimento-codigo-seguranca">
                            <div className="container-texto-pix">
                            <p style={{fontSize:"14px"}}>Vencimento</p>
                            <div style={{position:"relative",backgroundColor:"#ffffff" ,width: "120px", maxWidth: "400px", padding: "10px", border: "1px solid #ccc", borderRadius:"6px" }}>
  <CardExpiryElement options={{
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  }}/>
  </div>
                            </div>
                            <div className="container-texto-pix">
                            <p style={{fontSize:"14px"}}>Código de segurança</p>
                            <div style={{position:"relative",backgroundColor:"#ffffff" ,width: "120px", maxWidth: "400px", padding: "10px", border: "1px solid #ccc", borderRadius:"6px" }}>
  <CardCvcElement onFocus={handleVirarCartao} onBlur={handleDesvirarCartao} options={{
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  }}/>
  </div>
                            </div>
                            
                            </div>
                            <div className="container-texto-pix">
                            <p style={{fontSize:"14px"}}>Documento do titular</p>
                            <div style={{display:"flex",position:"relative", alignItems:"center"}}className="container-input-imagem-cartao">
                            <select value={tipoDeDocumento} onChange={handleSelectChange} style={{border:"none",borderRight:"1px solid #c1c1c1",position:"absolute",left:"5px",padding:"8px"}}>
                                <option>CPF</option>
                                <option>CNPJ</option>
                            </select>
                            <input onChange={(e) => {setDocumentoTitular(e.target.value)}} value={documentoTitular} style={{paddingTop:"10px",paddingBottom:"10px",paddingLeft:"100px",border:"1px solid #c1c1c1",borderRadius:"6px",width:"300px"}} placeholder={tipoDeDocumento === "CPF" ? "999.999.999-99" : "99.9999.999/9999-99"}/>
                            </div>
                            </div>
                            </div>
                            </div>
                            
                            </div>
                            
                            </div>
                            
                            <img src={imagemCartao} style={{width:"250px",transition: "transform 0.6s",transitionDelay: "0.2s",transform: virarCartao ? "rotateY(180deg)" : "rotateY(0deg)",transformStyle: "preserve-3d",height:"250px"
                            }}/>
                            <button style={{position:"absolute"}}className="botao-continuar-forma-entrega" onClick={() => {adicionarCartaoStripe()}}>Continuar</button>
                            
                            </div>
                             <div
  style={{
    position: "fixed",
    bottom: erroCartao ? "20px" : "-100px", // começa fora da tela
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#111111",
    color: "#ffffff",
    padding: "20px",
    width: "600px",
    borderRadius: "6px",
    margin: "20px",
    transition: "bottom 0.3s ease-in-out", // efeito suave
  }}
>
  As informações do cartão são inválidas
</div>
                            
                    <div>
                    
                    </div>
                </div> : ""}                
                
                {step === 4 && (selecionarOpcaoDePagamento === "Cartao") ? <div className="titulo-forma-entrega">
                    <p style={{fontSize:"24px"}}>Selecione o parcelamento</p>
    
                    <div className="card-faturamento">
                        <div className="container-card-forma-entrega-">
                            <div className="container-card-nome-cpf">
                            <div className="container-texto-forma-entrega">
                            <div className="container-nome-cpf">
                            <div className="container-icone-faturamento-nome">
                            <img src = {imagemOpcaoPagamento} className="logo-icones-pagamento-pagina-entrega"/>
                            <div className="container-texto-pix">
                            <p style={{fontWeight:"bold"}}>{selecionarOpcaoDePagamento}</p>
                                 {selecionarOpcaoDePagamento === "Cartao" ?
                                cartoesDeCreditoSalvos.filter((item) => {return item.id === selecionarIdCartao}).map((item) => {return <div style={{display:"flex",gap:"30px"}}>
                                    <p style={{fontWeight:"bold"}}> **** **** **** {item.card.last4}</p>
                                <p>{item.card.exp_month}/{item.card.exp_year}</p>
                                <p style={{fontWeight:"bold"}}>{item.card.display_brand}</p>
                                    </div>}) :""}

                            </div>
                            </div>
                            
                            </div>
                            
                            </div>
                            </div>
                            
                            </div>
                            
                           
                    </div>
                    <div className="card-faturamento">
                        {Array.from({length:numeroParcelasMaximas}).map((_,index) => {
                            return (
                                <div style={{display:"flex"}}>
                                <input checked ={numeroParcelas === (index + 1)} value={index + 1} onChange={() => {setNumeroParcelas(index + 1);setValorParcela((valorTotal/(index + 1)).toFixed(2))}} type="radio"/> <p>{index+1}x de R${(valorTotal/(index + 1)).toFixed(2)}</p>
                                </div>
                            )
                        })}

                           
                           
                    </div>
                    
                </div> : ""}
                
                
                {step ? <div className="card-resumo-compra-pagina-entrega">
                    <p style={{fontWeight:"bold"}}>Resumo da compra</p>
                    <div className="preco-produto-frete-pagina-entrega">
                    <div className="container-produto-preco-pagina-entrega">
                    <p>Produtos</p>
                    <p>R${precoTotalProdutos?.toFixed(2) || calcularPrecoProdutos()?.toFixed(2)}</p>
                    </div>
                    <div className="container-frete-pagina-entrega">
                        <p>Frete</p>
                        <p>R${calcularFreteTotal().toFixed(2)}</p>
                        </div>
                    <div className="container-inserir-cupom-desconto-pagina-entrega">
                        <a style={{textDecoration:"none",color:"#3483fa"}}href="#">Inserir cupom de desconto</a>
                    </div>
                    </div>
                    <div className="container-voce-pagara">
                        <p>Você pagará</p>
                        <p>R${calcularPrecoTotal().toFixed(2)}</p>
                    </div>
                    {((step === 4)  && (selecionarOpcaoDePagamento !== "Cartao" && selecionarOpcaoDePagamento !== "novoCartao")) || ((step === 5) && (selecionarOpcaoDePagamento == "Cartao")) ? <button onClick={ async () => {if(selecionarOpcaoDePagamento === "Cartao"){
            const resultado = await handleStripeCartao();
            if(resultado === true){
                handleNext();
            }
            }
            else if(selecionarOpcaoDePagamento === "Boleto"){
            const resultado = await handleStripeBoleto();
            if(resultado === true){
                handleNext();
            }
            }
            else if(selecionarOpcaoDePagamento === "Pix"){
                handleNext();
            } }} className="botao-confirmar-compra-checkout">Confirmar Compra</button> : ""}
                    {step === 4  && (selecionarOpcaoDePagamento == "Cartao") ? <button onClick={() => {handleNext()}} className="botao-confirmar-compra-checkout">Continuar compra</button> : ""}
                </div> : ""}
                
            </div> : ""}
            <div
  style={{
    position: "fixed",
    bottom: selecioneUmaOpcao ? "20px" : "-100px", // começa fora da tela
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#111111",
    color: "#ffffff",
    padding: "20px",
    width: "600px",
    borderRadius: "6px",
    margin: "20px",
    transition: "bottom 0.3s ease-in-out", // efeito suave
  }}
>
  Selecione uma opção para continuar
</div>

{((step === 5 && (selecionarOpcaoDePagamento === "Boleto") ? <div>
            <div className="container-pagamento-finalizado">
                    <p style={{color:"white",fontSize:"20px"}}>Para finalizar a sua compra é só realizar o pagamento de R$30.00 via boleto!</p>
                    <img src="/images/bag-shopping.png" className="icone-pagamento-concluido"/>
                </div>
                <div className="container-card-pagamento-pix">
                    <div style={{width:"800px"}}className="card-pagamento-pix">
                        <p style={{fontSize:"18px"}}>Você tem 8 dias para pagar</p>
                        <div style={{alignItems:"start"}}className="lista-imagem-qr-code">
                        <p>Seu boleto foi gerado com sucesso!
                        Para concluir o pagamento, realize o pagamento até a data de vencimento. O prazo para confirmação é de até 2 dias úteis após o pagamento</p>
                        <div style={{borderBottom:"none",alignItems:"start"}}className="container-imagem-relogio-pagamento">
                        <img style={{marginTop:"8px"}}src="/images/time.png" className="imagem-relogio"/>
                        <p>Se o pagamento é feito de segunda a sexta, é creditado no dia seguinte.Se você paga no fim de semana, será creditado na terça-feira</p>
                        </div>
                        <img style={{width:"700px",height:"200px",padding:"0px"}}src="/images/numbers-metodos-pagamento.png" className="imagem-pix"/>
                        <p>1203891381293.3192371932719.172391793.37192372183</p>
                        </div>
                        
                        <div className="container-botao-copiar-codigo-minhas-compras">
                        <button style={{padding:"10px"}}className="botao-copiar-codigo-pix">Copiar linha digitável
                        </button>
                        <div style={{backgroundColor:"#f0f0f0",padding:"10px",borderRadius:"6px"}}>
                        <a style={{color:"#3483fa",textDecoration:"none"}}href="#">Imprimir boleto</a>
                            {boletoUrl && (
                            <a href={boletoUrl} target="_blank" rel="noopener noreferrer">
                                Clique aqui para pagar o boleto
                            </a>
                            )}
                            {idPagamentoBoleto && (
                                <button onClick={() => {handleSimularPagarBoleto(idPagamentoBoleto)}}>Simular pagar boleto</button>
                            )}
                            {boletoPago && (
                                <p>O boleto foi pago</p>
                            )}
                        </div>
                        <a style={{color:"#3483fa",textDecoration:"none"}}href="#">Ver o status da compra</a></div>
                        
                    </div>
                    <div className="container-avisos-pix">
                <p style={{fontSize:"14px"}}>* Se o pagamento não for confirmado, não se preocupe. O pedido será cancelado automaticamente.</p>
                        <p style={{fontSize:"14px"}}>Atenção: caso o boleto não seja pago até a data de vencimento, o pedido será automaticamente cancelado.</p>
                        </div>
                </div>
                </div> : ""))}

                {((step === 5 && (selecionarOpcaoDePagamento === "Pix") ? <div>
            <div className="container-pagamento-finalizado">
                    <p style={{color:"white",fontSize:"20px"}}>Para finalizar a sua compra é só realizar o pagamento com Pix!</p>
                    <img src="/images/bag-shopping.png" className="icone-pagamento-concluido"/>
                </div>
                <div className="container-card-pagamento-pix">
                    <div className="card-pagamento-pix">
                        <p style={{fontSize:"18px"}}>Escaneie este código QR para pagar</p>
                        <div className="lista-imagem-qr-code">
                        <ul>
                            <li>Acesse seu Internet Banking ou app de pagamentos.</li>
                            <li>Escolha pagar via Pix</li>
                            <li>Escaneie o seguinte código:</li>
                        </ul>
                        <img src="/images/qr-code.png" className="imagem-pix"/>
                        </div>
                        <div className="container-imagem-relogio-pagamento">
                        <img src="/images/time.png" className="imagem-relogio"/>
                        <p>Pague e será creditado na hora</p>
                        </div>
                        <div className="container-codigo-copia-cola">
                        <p style={{fontSize:"18px"}}>Ou copie este código para fazer o pagamento</p>
                        </div>
                        <div className="container-codigo-pix">
                        <p>Código</p>
                        <div className="container-copiar-codigo-pix">
                            <a style={{color:"#3483fa",textDecoration:"none"}} href= "#">Copiar</a>
                        </div>
                        </div>
                        <div className="container-botao-copiar-codigo-minhas-compras">
                        <button className="botao-copiar-codigo-pix">Copiar código</button>
                        <a style={{color:"#3483fa",textDecoration:"none"}}href="#">Ver em minhas compras</a></div>
                        
                    </div>
                    <div className="container-avisos-pix">
                <p style={{fontSize:"14px"}}>* Se o pagamento não for confirmado, não se preocupe. O pedido será cancelado automaticamente.</p>
                        <p style={{fontSize:"14px"}}>O prazo de entrega será contado após 1º dia útil da aprovação do pedido. Este procedimento costuma ocorrer em até 24 horas, mas tem período máximo para acontecer de até 48 horas (pagamento no cartão). Se o pagamento for realizado por boleto bancário, o banco tem o prazo de até três dias úteis para confirmar</p>
                        </div>
                </div>
                </div> : ""))}


                {step === 6 && (selecionarOpcaoDePagamento === "Cartao") && statusPagamento === "failed" ? <div className="secao-pagamento-recusado">
                <div className="container-pagamento-recusado">
                <div className="container-pagamento-recusado-imagem">
                <p style={{color:"white",fontSize:"20px"}}>Pagamento Recusado</p>
                <img src="/images/x-button.png" className="imagem-pagamento-recusado"/>
                </div>
                
                </div>
                <div className="container-card-pagamento-recusado">
                <div className="card-pagamento-recusado">
                <div className="container-imagens-texto-card-pagamento-recusado">
                    <div className="container-imagens-pagamento-recusado">
                    <img src="/images/document.png" className="imagem-pagamento-recusado-card"/>
                    <img src="/images/x-button.png" className="imagem-x-pagamento-recusado"/>
                    </div>
                    <div className="container-textos-card-pagamento-recusado">
                    <p style={{color:"white"}}>Algo saiu errado</p>
                    <p style={{color:"white"}}>Não foi possível processar o pagamento</p>
                    </div>
                    </div>
                    <div className="container-texto-botoes-pagamento-recusado">
                    <p>O que posso fazer?</p>
                    <p>Tente novamente mais tarde</p>
                    <div className="container-botoes-pagar-outro-jeito-voltar-ao-inicio">
                    <button className="botao-pagar-de-outro-jeito">Pagar de outro jeito</button>
                    <button className="botao-voltar-ao-inicio">Voltar ao início</button>   
                    </div>     
                    </div>      
                </div>
                </div>
                
                </div> : ""}


                
                {step === 6 && (selecionarOpcaoDePagamento === "Cartao") && statusPagamento === "analise" ? <div className="secao-pagamento-recusado">
                <div className="container-pagamento-em-analise">
                <div className="container-pagamento-recusado-imagem">
                <p style={{color:"white",fontSize:"20px"}}>Pagamento em análise</p>
                <img src="/images/caution.png" className="imagem-pagamento-em-analise"/>
                </div>
                
                </div>
                <div className="container-card-pagamento-recusado">
                <div className="card-pagamento-recusado">
                <div className="container-imagens-texto-card-pagamento-em-analise">
                    <div className="container-imagens-pagamento-recusado">
                    <img src="/images/caution.png" className="imagem-pagamento-recusado-card"/>
                   
                    </div>
                    <div className="container-textos-card-pagamento-em-analise">
                    <p style={{color:"white"}}>Seu pagamento está em análise de segurança</p>
                    <p style={{color:"white"}}>Estamos confirmando as informações<br/> e você receberá uma atualização em breve por e-mail.</p>
                    </div>
                    </div>
                    <div className="container-texto-botoes-pagamento-recusado">
                    <p>Contate seu banco para mais informações</p>
                    <p>Entraremos em contato quando a confirmação for concluída.</p>
                    <div className="container-botoes-pagar-outro-jeito-voltar-ao-inicio">
                    
                    <button className="botao-voltar-ao-inicio">Voltar ao início</button>   
                    </div>     
                    </div>      
                </div>
                </div>
                
                </div> : ""} 
                
                {step === 6 && (selecionarOpcaoDePagamento === "Cartao") && statusPagamento === "sucess" ? <div className="secao-pagamento-recusado">
                <div style={{backgroundColor:"#00a650"}}className="container-pagamento-em-analise">
                <div className="container-pagamento-recusado-imagem">
                <p style={{color:"white",fontSize:"20px"}}>Seu pagamento foi aprovado</p>
                <img src="/images/verified-pagamento-aprovado.png" className="imagem-pagamento-aprovado"/>
                </div>
                
                </div>
                <div className="container-card-pagamento-recusado">
                <div className="card-pagamento-recusado">
                <div style={{display:"flex",flexDirection:"row",alignItems:"center",gap:"30px",backgroundColor:"white"}} className="container-imagens-texto-card-pagamento-em-analise">
                    <img src="/images/credit-card-metodos-pagamento.png" style={{width:"100px",height:"100px",boxSizing:"border-box",border:"1px solid #c1c1c1",borderRadius:"50%",padding:"10px"}}/>
                    <div style={{gap:"5px",alignItems:"start"}}className="container-textos-card-pagamento-em-analise">
                    <p >Você pagou {numeroParcelas}x de R${valorParcela || calcularPrecoTotal().toFixed(2) } (Total: R$ {calcularPrecoTotal().toFixed(2)})</p>
                    <p>Cartão de crédito **** **** **** {cartaoSelecionado.card.last4} {cartaoSelecionado.card.display_brand}</p>
                    <p>Na fatura do seu cartão, você verá o pagamento em nome de Teste</p>
                    </div>
                    </div>      
                </div>
                <div className="card-pagamento-recusado">
                <div style={{backgroundColor:"#ffffff"}} className="container-imagens-texto-card-pagamento-em-analise">
                    <div className="container-imagens-pagamento-recusado">
                   
                    </div>
                    <div style={{gap:"100px",display:"flex",alignItems:"center"}}className="container-pagamento-aprovado-icone-qr-code">
                    <div style={{alignItems:"start"}}className="container-textos-card-pagamento-em-analise">
                    <img src="/images/html-5.png" style={{width:"80px",height:"80px"}}/>
                    <p>Agilize seu próximo pagamento!</p>
                    <p>Baixe o app do nosso site no seu celular<br/> escaneando o código QR</p>
                    </div>
                    <img src="/images/qr-code.png" style={{width:"200px",height:"200px"}}/>
                    </div>
                    </div>
                    <div className="container-texto-botoes-pagamento-recusado">
                    <button style={{justifyContent:"center",display:"flex",alignItems:"center"}}className="botao-voltar-ao-inicio"><img src="/images/html-5.png" style={{width:"50px",height:"30px"}}/><p style={{fontSize:"16px",fontWeight:"bold"}}>Baixar o app</p></button>
                    <button className="botao-voltar-ao-inicio">Voltar ao início</button> 
                    <div className="container-botoes-pagar-outro-jeito-voltar-ao-inicio">
                    
                      
                    </div>     
                    </div>      
                </div>
                </div>
                
                </div> : ""}
                
                
                
                
            
        <Footer/>
        </div>
    )
}

export default PaginaEscolherFormaEntrega;
