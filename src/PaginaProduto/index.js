import { useParams } from 'react-router-dom';
import './styles.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Header from '../componentes/header';
import Footer from '../componentes/footer';
import { calcularPrecoParcelado } from '../utils/calcularPrecoParcelado';
import { calcularFretePorCep } from '../utils/calcularFretePorCep';
import { useCep } from '../context/CepContext';
import ModalCep from '../componentes/modalCep/ModalCep';
import { useCarrinho } from '../context/carrinhoContext';
import ModalCarrinho from '../componentes/modalCarrinho/index.js';
import Carousel from '../componentes/carousel/index.js';
import CarouselPaginaProduto from '../componentes/carousel-pagina-produtos/index.js';
import CardAnuncio from '../componentes/card-anuncio/index.js';
import CardAnuncioPaginaProduto from '../componentes/card-anuncio-pagina-produto/index.js';

function PaginaProduto(){

    const cards = [{titulo:"CASHBACK ELECTROLUX",
        logo:"/images/html-5.png",
        descricao:"RECEBA ATÉ R$ 1200 DE PIX NA CONTA",
        link:"Compre já",
        imagem:"/images/coca-cola-anuncio.jpg"
    },
    {titulo:"Perfume do Cristiano",
        logo:"/images/js.png",
        descricao:"TECNOLOGIA PARA QUEM VOCÊ AMA",
        link:"Aproveite",
        imagem:"/images/perfume-anuncio.jpg"
    }
    ]

    const meiosDePagamento = [{titulo: "Linha de Crédito",
        imagem1:"/images/atm-machine-metodos-pagamento.png",
        imagem2:"",
        imagem3:"",
        imagem4:"",
        
    },
    {titulo: "Cartões de crédito",
        imagem1:"/images/bank-transfer-metodos-pagamento.png",
        imagem2:"/images/coin-metodos-pagamento.png",
        imagem3:"/images/contactless-metodos-pagamento.png",
        imagem4:"/images/credit-card-metodos-pagamento.png",
        
    },
    {titulo: "Cartões de débito",
        imagem1:"/images/money-metodos-pagamento.png",
        imagem2:"",
        imagem3:"",
        imagem4:"",
        
    },
    {titulo: "Pix",
        imagem1:"/images/payment-metodos-pagamento.png",
        imagem2:"",
        imagem3:"",
        imagem4:"",
        
    },
    {titulo: "Boleto bancário",
        imagem1:"/images/numbers-metodos-pagamento.png",
        imagem2:"",
        imagem3:"",
        imagem4:"",
        
    }]

    const {id} = useParams();
    const [produto,setProduto] = useState(null);
    const [imagemSelecionada, setImagemSelecionada] = useState("");
    const [localidade, setLocalidade] = useState("Insira seu cep");
    let [valorFrete, setValorFrete] = useState(null);
    const [prazo, setPrazo] = useState(null);
    const {cep} = useCep();
    const [mostrarModalCep, setMostrarModalCep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalCarrinho, setModalCarrinho] = useState(false);
    const [modalUnidades,setModalUnidades] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);
    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const [valorQuantidade, setValorQuantidade] = useState("mais");
    const [corSelecionada, setCorSelecionada] = useState(null);
    const [materialSelecionado, setMaterialSelecionado] = useState(null);
    const [voltagemSelecionada, setVoltagemSelecionada] = useState(null);
    const [generoSelecionado, setGeneroSelecionado] = useState(null);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
    const [estampaSelecionada, setEstampaSelecionada] = useState(null);
    const [pesoSelecionado, setPesoSelecionado] = useState(null);
    const [dimensoesSelecionada, setDimensoesSelecionada] = useState(null);
    const [outrosProdutos, setOutrosProdutos] = useState([]);
    const [ultimoProdutoAtualizado, setUltimoProdutoAtualizado] = useState(null);
    const [selecoes, setSelecoes] = useState({
        cor: null,
        materiais: null,
        voltagens: null,
        generos: null,
        tamanhos: null,
        estampas: null,
        pesos: null,
        dimensoes: null,
      });

      const [hover, setHover] = useState({
        cor: null,
        voltagens: null,
        dimensao: null,
        peso: null,
        genero: null,
        estampa: null,
        tamanhos: null,
        material: null,
      });
    
      const handleSelecao = (atributo, valor) => {
        setSelecoes((prevSelecoes) => ({
          ...prevSelecoes,
          [atributo]: valor,
        }));
      };
      const handleHover = (atributo, valor) => {
        let valorFormatado = valor;

        if(valor !== null){
            if(atributo === "dimensoes"){
                valorFormatado = `${valor.largura} ${valor.unidade} x ${valor.altura} ${valor.unidade} x ${valor.comprimento} ${valor.unidade}`;
            }
            else if(atributo === "pesos"){
                valorFormatado = `${valor.valor} ${valor.unidade}`; 
            }
            else if(atributo === "voltagens"){
                valorFormatado = `${valor.valor}V`;
            }
            
          }
          else{
            valorFormatado="";
          }
          setHover((prevHover) => ({
            ...prevHover,
            [atributo]: valorFormatado,
          }));
        }
        
    
    const {obterCarrinho, editarQuantidadeItemCarrinho, excluirItemCarrinho, carrinhoItens,setCarrinhoItens, adicionarAoCarrinho} = useCarrinho();

    const selecionarQuantidade = (quantidade) => {
        setQuantidadeSelecionada(Number(quantidade));
        setMostrarOpcoes(false);
    }

    
    
    const abrirModalCep = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setMostrarModalCep(true);
        },1000);
        
    };

    const abrirModalUnidadesProduto = () => {
        setModalUnidades(true);
    }
    const fecharModalUnidadesProduto = () => {
        setModalUnidades(false);
    };
    const fecharModalCep = () => {
        
        setMostrarModalCep(false);
    };
    useEffect(() => {
        const buscarProduto = async () => {
          try {
            const resposta = await axios.get(`http://localhost:5000/produto/${id}`);
            const produtoBuscado = resposta.data.produto;
            console.log(produtoBuscado);
            setProduto(produtoBuscado);
            
            setImagemSelecionada(produtoBuscado.imagens[0] || null);
            setCorSelecionada(produtoBuscado.cor?.[0].id || null );
            setMaterialSelecionado(produtoBuscado?.materiais?.[0].id ||  null );
            setVoltagemSelecionada(produtoBuscado?.voltagens?.[0].id || null);
            setGeneroSelecionado(produtoBuscado?.generos?.[0].id || null);
            setTamanhoSelecionado(produtoBuscado?.tamanhos?.[0].id || null);
            setEstampaSelecionada(produtoBuscado?.estampas?.[0].id || null);
            setPesoSelecionado(produtoBuscado?.pesos?.[0].id || null);

            setDimensoesSelecionada(produtoBuscado?.dimensoes?.[0].id ||  null);
            setSelecoes({
                cor: produtoBuscado?.cor?.[0]?.valor,
                materiais: produtoBuscado?.materiais?.[0]?.valor,   
                voltagens: produtoBuscado?.voltagens?.[0]?.valor ? `${produtoBuscado.voltagens[0].valor}V` : undefined,
                generos: produtoBuscado.generos?.[0]?.valor,
                tamanhos: produtoBuscado.tamanhos?.[0]?.valor,
                estampas: produtoBuscado.estampas?.[0]?.valor,
                pesos: produtoBuscado?.pesos?.[0]?.valor && produtoBuscado?.pesos?.[0]?.unidade 
           ? `${produtoBuscado.pesos[0].valor} ${produtoBuscado.pesos[0].unidade}` 
           : undefined,
                dimensoes: produtoBuscado?.dimensoes?.[0]?.largura && produtoBuscado?.dimensoes?.[0]?.altura && produtoBuscado?.dimensoes?.[0]?.comprimento
               ? `${produtoBuscado.dimensoes[0].largura} ${produtoBuscado.dimensoes[0].unidade} x ${produtoBuscado.dimensoes[0].altura} ${produtoBuscado.dimensoes[0].unidade} x ${produtoBuscado.dimensoes[0].comprimento} ${produtoBuscado.dimensoes[0].unidade}` 
               : undefined,
              });
        
        if(cep !== "Insira seu cep"){
         const respostaPrazoPreco = await axios.post(
            `http://localhost:5000/calcular-prazo-preco`,
            {
                cepOrigem: produtoBuscado.cep_origem,
                cepDestino: cep
            },
            {
                withCredentials: true
            }
        );
        console.log(respostaPrazoPreco.data);
            setPrazo(respostaPrazoPreco.data.prazoEmDias);
            setValorFrete(respostaPrazoPreco.data.precoEnvio);
            setLocalidade(respostaPrazoPreco.data.localidade);
        
        try{
            await axios.post("http://localhost:5000/inserir-frete-valor",
        {prazo:respostaPrazoPreco.data.prazoEmDias,
        valor:respostaPrazoPreco.data.precoEnvio,
        localidade:respostaPrazoPreco.data.localidade,
        produtoId:produtoBuscado.produto_id,
        estado:respostaPrazoPreco.data.estado
        },
                {withCredentials:true})

        }
        catch(err){
            console.error("Não foi possivel inserir o frete");
        }
           
        }
        
        
          } catch (err) {
            console.error("Erro ao buscar produto", err);
          }
       
        
        };

        
      
        buscarProduto();
      }, [id,cep]);
      
      

      useEffect(() => {
        fetchOtherProducts()
      },[])


    const abrirModalCarrinho = () => {
        document.body.classList.add("modal-aberto");
        setModalCarrinho(true);
    }
    const fecharModalCarrinho = () => {
        document.body.classList.remove("modal-aberto");
        setModalCarrinho(false);
    }
    const calcularEstrelas = (avaliacao) => {
        const totalEstrelas = 5;
        const inteira = Math.floor(avaliacao);
        const temMeia = avaliacao % 1 !== 0;
        const estrelas = [];
    
        for (let i = 0; i < inteira; i++) {
            estrelas.push(<img key={i} src="/images/estrelacheia.png" className="estrela-avaliacao" alt="⭐" />);
        }
        if (temMeia) {
            estrelas.push(<img key="meia" src="/images/meiaestrela.png" className="estrela-avaliacao" alt="⭐½" />);
        }
        while (estrelas.length < totalEstrelas) {
            estrelas.push(<img key={estrelas.length} src="/images/estrelavazia.png" className="estrela-avaliacao" alt="☆" />);
        }
        return estrelas;
    };
    
    const fetchOtherProducts = async () => {
        try{
            const resposta = await axios.get(`http://localhost:5000/produtos`);
            setOutrosProdutos(resposta.data);
        }
        catch(err){
            console.error("Não foi possível carregar os outros produtos");
        }
    }

    const fetchDadosPrazoEnvio = async () => {
        try{
            console.log(`produtoe`,produto);
            
        
        }
        catch(err){
            console.error("Não foi possivel calcular o prazo e o preço")
        }
    }


    return (
        <div>
            <Header props produto={produto}/>
            <div className="secao-pagina-produto">
            <div className="container-produto">
            {produto ? (
                <>
                <div className="titulo-produto-pagina-produto">
                    <h1>{produto.produto_nome.length > 255 ? produto.produto_nome.slice(0,252) + '...' : produto.produto_nome}</h1>
                    </div>
                    <div className="container-frete">
                    <div className="container-imagens">
                    <div className="container-imagem-falando-carousel">
                        <div className="container-imagens-imagem">
                    <div className="container-imagem-card-produto">
                    {produto.imagens?.slice(0,5).map((imagem, index) => (
        <img key={index} className="imagem-card-pagina-produto"src={imagem}  alt={produto.nome} onMouseOver={() => setImagemSelecionada(imagem)}/>
))}
                    
                    </div>
                    
                    <div className="container-imagem-pagina-produto">
                    <img className="imagem-pagina-produto" src={imagemSelecionada} alt={produto.nome} />
                    
                    </div>
                    </div>
                    <h2>O que os clientes estão falando do produto</h2>
                    <p>De acordo com os consumidores, este item se destaca pela praticidade e facilidade de uso, além de ser elogiado por seu design compacto e bonito. A maioria dos usuários descreve as bebidas como deliciosas, embora alguns comentem que a temperatura e a quantidade poderiam ser melhoradas.</p>
                    <div className="card-garantia-devolucao">
                        <div className="icone-texto-entrega-garantia-devolucao">
                            <img src="/images/delivery-truck.png" className="imagem-icone-texto-entrega-garantia"/>
                            <div className="texto-entrega-garantia-devolucao">
                                
                            <div className="container-titulo-garantia-devolucao"><a style={{fontSize:"14px"}}href="#">Entrega Completa</a></div>
                                <p style={{fontSize:"14px"}}>É entrega rápida, frete barato e mais segurança pra você</p>
                            </div>
                            </div>
                            <div className="icone-texto-entrega-garantia-devolucao">
                            <img src="/images/shield.png" className="imagem-icone-texto-entrega-garantia"/>
                            <div className="texto-entrega-garantia-devolucao">
                                <div className="container-titulo-garantia-devolucao"><a style={{fontSize:"14px"}} href="#">Garantia do Desenvolvedor</a></div>
                                <p style={{fontSize:"14px"}} >Garantimos a sua compra do pedido à entrega</p>
                                </div>
                            </div>
                            <div className="icone-texto-entrega-garantia-devolucao">
                            <img src="/images/recycling-symbol.png" className="imagem-icone-texto-entrega-garantia"/>
                            <div className="texto-entrega-garantia-devolucao">
                            <div className="container-titulo-garantia-devolucao"><a style={{fontSize:"14px"}}  href="#">Devolução grátis</a></div>
                                <p style={{fontSize:"14px"}} >É possível reembolsar ou trocar o item até 30 dias depois</p>
                            </div>
                            </div>
                        
                    </div>
                    
                    </div>
                    <div className="container-preco-avaliacao">
                        <p>{calcularEstrelas(produto.mediaAvaliacoes)} {produto.mediaAvaliacoes} ({produto.totalAvaliacoes}) <a href="#">Avaliar Produto</a></p>
                        
                        <img className="imagem-container-preco" src={produto.imagens[0]}></img>
                        
                        <p>Vendido e entregue por <a style={{ color: "black" }} href="#">{produto.vendedores[0].nome}</a></p>
                        <p>Nossa loja garante sua compra <a href="#">Saiba mais</a></p>
                        <p>R$ {produto.produto_preco}</p>
                        <p>{produto.produto_parcelas_máximas}x de R${calcularPrecoParcelado(produto.produto_preco_parcelado,produto.produto_parcelas_máximas)}</p>
                        <p>ou R$<strong className="paragrafo-preco-produto">{produto.produto_preco_pix}</strong> no Pix</p>
                        <div className="container-cartao">
                            <div className="secao-container-cartao">
                            <a href="#">Cartão de crédito</a>

                            <p>{produto.produto_juros_cartao} Sem juros</p>
                            </div>
                            <div className="preco-container-cartao">
                            <p>{produto.preco}</p>
                            <p>{produto.produto_parcelas_máximas}x de R${calcularPrecoParcelado(produto.produto_preco_parcelado,produto.produto_parcelas_máximas)}</p>                           
                            </div>
                        </div>
                            <div className="container-card-cor">
                            <div className="card-variacao">
                            {Object.entries(produto).map(([nome, opcoes]) => {
                                const atributosSuportados = [
                                    "cor",
                                    "voltagens",
                                    "generos",
                                    "tamanhos",
                                    "materiais",
                                    "estampas",
                                    "pesos",
                                    "dimensoes",
                                ];


                                
                                if (atributosSuportados.includes(nome) && Array.isArray(opcoes) && opcoes.length > 0) {
                                    let exibirHover;
                                    if(nome === "dimensoes"){
                                        exibirHover = hover[nome] || selecoes[nome] || `${opcoes[0].largura} ${opcoes[0].unidade} x ${opcoes[0].altura} ${opcoes[0].unidade} x ${opcoes[0].comprimento} ${opcoes[0].unidade}`
                                    }
                                    else if(nome === "pesos"){
                                        exibirHover = hover[nome] || selecoes[nome] || `${opcoes[0].valor} ${opcoes[0].unidade}`
                                    }
                                    else if(nome === "voltagens"){
                                        exibirHover = hover[nome] || selecoes[nome] || `${opcoes[0].valor}V`
                                    }
                                    else{
                                        exibirHover = hover[nome] || selecoes[nome] || opcoes[0].valor
                                    }
                                        
                                   
                                    
                                    
                                    return (
                                    <div className="card-variacao" key={nome}>
                                        {nome.charAt(0).toUpperCase() + nome.slice(1)}:{exibirHover}
                                        
                                        <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}} className={`container-card-${nome}`}>
                                        {opcoes?.map((item) => {
                                            return (
                                            <div
                                                key={item.id}
                                                style={{width:"150px"}}
                                                
                                                onClick={() => {
                                                
                                                // Atualiza a seleção de atributos
                                                let valorFormatado = item.valor;
                                                if(nome === "dimensoes"){
                                                    valorFormatado = `${item.largura} ${item.unidade} x ${item.altura} ${item.unidade} x ${item.comprimento} ${item.unidade}`;
                                                }
                                                else if (nome === "pesos") {
                                                    valorFormatado = `${item.valor} ${item.unidade}`;
                                                  } else if (nome === "voltagens") {
                                                    valorFormatado = `${item.valor}V`;
                                                  }
                                                setSelecoes((prevSelecoes) => ({
                                                    ...prevSelecoes,
                                                    [nome]: valorFormatado,
                                                }));
                                                if(nome === "cor")
                                                setCorSelecionada(item.id);
                                                if(nome === "materiais")
                                                setMaterialSelecionado(item.id);
                                                if(nome === "voltagens")
                                                setVoltagemSelecionada(item.id);
                                                if(nome === "generos")
                                                setGeneroSelecionado(item.id);
                                                if(nome === "tamanhos")
                                                setTamanhoSelecionado(item.id);
                                                if(nome === "estampas")
                                                setEstampaSelecionada(item.id);
                                                if(nome === "pesos")
                                                setPesoSelecionado(item.id);
                                                if(nome === "dimensoes")
                                                setDimensoesSelecionada(item.id);
                                            
                                                }}
                                                onMouseEnter={() => {if(nome === "dimensoes"){
                                                    
                                                    handleHover(nome, {
                                                        largura: item.largura,
                                                        altura: item.altura,
                                                        comprimento: item.comprimento,
                                                        unidade: item.unidade,  // Caso também precise da unidade
                                                      });
                                                }
                                                else if(nome === "pesos"){
                                                    handleHover(nome,{
                                                        valor:item.valor,
                                                        unidade:item.unidade})
                                                }
                                                else if(nome === "voltagens"){
                                                    handleHover(nome,{
                                                        valor:item.valor,
                                                        unidade:"V"
                                                    })
                                                }
                                                else{
                                                    handleHover(nome,item.valor)}}
                                                }
                                                
                                                onMouseLeave={() => {
                                                    
                                                    handleHover(nome,null)}}
                                                    className={`card-valor-cor ${
                                                        nome === "dimensoes"
                                                          ? selecoes[nome] === `${item.largura} ${item.unidade} x ${item.altura} ${item.unidade} x ${item.comprimento} ${item.unidade}`
                                                            ? "selecionado"
                                                            : ""
                                                          : nome === "pesos"
                                                          ? selecoes[nome] === `${item.valor} ${item.unidade}`
                                                            ? "selecionado"
                                                            : ""
                                                          : nome === "voltagens"
                                                          ? selecoes[nome] == `${item.valor}V` 
                                                            ? "selecionado"
                                                            : ""
                                                          : selecoes[nome] === item.valor 
                                                          ? "selecionado"
                                                          : ""
                                                      }`}                                     >
                                                <p>{nome === "dimensoes" ? `${item.largura}${item.unidade} x  ${item.altura}${item.unidade} x ${item.comprimento}${item.unidade}` : nome === "pesos" ? `${item.valor}${item.unidade}`:nome === "voltagens" ? `${item.valor}V`: item.valor}</p>
                                            </div>
                                            );
                                        })}
                                        </div>
                                    </div>
                                    );
                                }
                                })}
                            </div>
                            </div>
                        <div className="container-selecao-unidades">
                        <div className="container-quantidade-foto-dropdown">
                        <p style ={{cursor:"pointer"}} onClick={() => setMostrarOpcoes(!mostrarOpcoes)}>Quantidade: {quantidadeSelecionada !== "mais" ? `${quantidadeSelecionada} unidade${quantidadeSelecionada !== "1" ? "s" : ""}` : "Selecione a quantidade" }</p><img src={mostrarOpcoes ? "/images/setinha-cima-dropdown-preta.png" : "/images/setinha-dropdown-preta.png"} className="imagem-botao-dropdown-quantidade"/>
                        </div>
                            {mostrarOpcoes && (
                            <div className="selecao-unidades">
                            <p onClick={() => selecionarQuantidade(1)}>1 unidade</p>
                            <p onClick={() => selecionarQuantidade(2)}>2 unidades</p>
                            <p onClick={() => selecionarQuantidade(3)}>3 unidades</p>
                            <p onClick={() => selecionarQuantidade(4)}>4 unidades</p>
                            <p onClick={() => selecionarQuantidade(5)}>5 unidades</p>
                            <p onClick={() => selecionarQuantidade(6)}>6 unidades</p>
                            <p on onMouseLeave = {() => setModalUnidades(false)}onClick={() => {selecionarQuantidade("mais");setMostrarOpcoes(true);setModalUnidades(true)}}>{modalUnidades ? <div>
                               <p>Quantidade:</p>
                               <form onSubmit={(e) => {e.preventDefault(); selecionarQuantidade(valorQuantidade)}}>
                               <input type='number' className="input-valorQuantidade" style={{padding:"13px 12px"}} value = {valorQuantidade === "mais" ? "" :valorQuantidade} onChange={(e) => setValorQuantidade(e.target.value)} />
                               <button disabled={valorQuantidade === "mais" || valorQuantidade === ""} className="botao-valor-quantidade" type="submit">Aplicar</button>
                               </form>
                            </div> : "Mais que 6 unidades"} </p>
            
                            </div>
                        )}
                                            </div>
                            
                        <div className="container-botoes">
                        <button className="botao-comprar-agora"><img src="/images/shopping-bag.png" className="imagem-bolsa"/>Comprar agora</button>
                        <button className="botao-adicionar-carrinho" onClick={ () => {console.log(produto
);adicionarAoCarrinho(
    id,
    quantidadeSelecionada,
    corSelecionada || (produto.cor?.[0]?.id || null),
    voltagemSelecionada || (produto.voltagens?.[0]?.id || null),
    dimensoesSelecionada || (produto.dimensoes?.[0]?.id || null),
    pesoSelecionado || (produto.pesos?.[0]?.id || null),
    generoSelecionado || (produto.generos?.[0]?.id || null),
    estampaSelecionada || (produto.estampas?.[0]?.id || null),
    tamanhoSelecionado || (produto.tamanhos?.[0]?.id || null),
    materialSelecionado || (produto.materiais?.[0]?.id || null)
  );setUltimoProdutoAtualizado(produto);abrirModalCarrinho() }}><img src="/images/carrinho-de-compras.png" className="imagem-carrinho-botao"/>Adicionar ao carrinho</button>
                        <div className="card-cep">
                            <div className="container-imagem-cep">
                            <img src= "/images/localizacao.png" className="icone-localizacao-card-cep"/>
                            
                            <div className="cep-indicador"><div className="cep-cidade" style={{ gap: localidade !== "Insira seu cep" ? "50px" : "0px" }}>
                                <p>{cep}</p><p>{localidade === "Insira seu cep" ? "" : localidade}</p>
                                </div>
                            {loading && <span className="loading-indicator"></span>}</div>
                            <a className="botao-alterar"onClick={abrirModalCep}>Alterar</a>
                            </div>
                            
                        </div>
                        
                        </div>
                    </div>
                    
                    </div>
                    <div className="secao-produtos-carousel-pagamentos">
                    <CarouselPaginaProduto produtos={outrosProdutos} itensPassados={3} produto={produto} titulo="Explore e aproveite"/>
                    <div className="card-meios-de-pagamento">
                        <p>Meios de pagamentos</p>
                        <button className="botao-meios-de-pagamento">Pague em até 7x sem juros!</button>
                        {meiosDePagamento.map((item) => {return (
                            <div className="container-linha-de-credito">
                            <p>{item.titulo}</p>
                            <div className="container-imagens-linha-de-credito">
                            <img src={item.imagem1} className="imagem-meios-de-pagamento"/>
                            {item.imagem2 !== "" ? <img src={item.imagem2} className="imagem-meios-de-pagamento"/> : ""}
                            {item.imagem3 !== "" ? <img src={item.imagem3} className="imagem-meios-de-pagamento"/> : ""}
                            {item.imagem4 !== "" ? <img src={item.imagem4} className="imagem-meios-de-pagamento"/>: ""}
                            </div>
                        </div>
                        )})}
                        
                    </div>
                    </div>
                    {mostrarModalCep && (
                                <ModalCep fecharModalCep = {fecharModalCep} calcularFretePorCep={calcularFretePorCep} setLocalidade={setLocalidade} setPrazo={setPrazo} setValorFrete={setValorFrete} produtoId = {produto?.id}/>
                            )}
                    {modalCarrinho && (
                        
                        <ModalCarrinho ultimoProdutoAtualizado= {ultimoProdutoAtualizado} fecharModalCarrinho={fecharModalCarrinho} quantidadeSelecionada={quantidadeSelecionada}/>
                        
                    )}
                    <div className="container-card-frete">
                    <div className="container-card-anuncio">
                    {cards.map((item) => {return (
                        <CardAnuncioPaginaProduto titulo={item.titulo} imagem={item.imagem} logo={item.logo} link={item.link} descricao={item.descricao}/>
                    )})}
                    </div>
                    <div className="card-frete">
                        <div className="container-imagem-texto">
                        <img src="/images/caminhao.png" className="imagem-caminhao-frete"/>
                        <div className="texto-frete">
                        <p>Receba em até {prazo === null ? "Indisponível" : `${prazo}`} dias úteis</p>
                        <p>Após pagamento confirmado</p>
                        <p className="texto-prazo">Os prazos de entrega são contabilizados a partir da confirmação do pagamento e podem sofrer variações caso haja a compra de mais de uma unidade do mesmo produto.</p>
                        </div>
                        </div>
                        <p className="preco-frete"> {valorFrete === null ? "Indisponível" : `R$ ${valorFrete}`}</p> 
                                            
                        </div>
                        
                        </div>
                        <div className="container-informacoes-loja">
                            
                        </div>
                    </div>
                    
                    <div className="container-informacoes-produto">
                    <div className="secao-informacoes-produto">
                    <div className="card-informacoes-produto">
                    <h1>Informações do produto</h1>
                    <p>{produto.produto_descricao}</p>
                    </div>
                    <div className="card-vendedor">
                        <h1>Informações do vendedor</h1>
                        <div className="imagem-nome-data-vendedor">
                        <img src="/images/shop.png" className="imagem-loja" alt="imagem-lojas"/>
                        <div className="nome-data-vendedor">
                        <p>Vendedor: {produto.vendedores[0].nome}</p>
                        <p>Cadastrado desde {produto.vendedores[0].cliente_desde}</p>
                        </div>
                        
                        </div>
                        <img src="/images/barra-amarela.png" className="imagem-grafico" alt="imagem-grafico"/>
                        <div className="icones-avaliacoes-vendedor">
                            <div className="caixa-texto-icones">
                                <img src="/images/shopping-bag-preta.png" className="icone-avaliacao"/>
                                <p><strong>{produto.vendedores[0].total_vendidos}</strong></p>
                                <p className="fonte-produtos-vendidos">Produtos vendidos</p>
                            </div>
                            <div className="caixa-texto-icones">
                                <img src="/images/caminhao-entrega.png" className="icone-avaliacao"/>
                                <p><strong>{produto.vendedores[0].nota_entrega}</strong></p>
                                <p className="fonte-produtos-vendidos">Entrega</p>
                            </div>
                            <div className="caixa-texto-icones">
                                <img src="/images/chat.png" className="icone-avaliacao"/>
                                <p><strong>{produto.vendedores[0].nota_atendimento}</strong></p>
                                <p className="fonte-produtos-vendidos">Atendimento</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="informacoes-produto">
                    
                    
                    
                    <div className="ver-todas-avaliacoes">
                    <a className="link-todas-avaliacoes" href="#">Ver todas as avaliações<img src="/images/right-arrow.png" className="icone-seta-avaliacoes"/></a>
                    </div>
                    <h1>Avaliação dos clientes</h1>
                    <div className="container-avaliacao-clientes">
                        <div className="container-classificacao">
                        <div className="container-avaliacao-comentarios">
                        <div className="card-nota-imagem">
                        <h1>{produto.mediaAvaliacoes}</h1>
                        <img src="/images/estrela.png" className="estrela-avaliacao-grande"/>
                        
                        </div>
                        <div className="total-avaliacoes">
                        <p>{produto.totalAvaliacoes} {produto.totalAvaliacoes === 1 ? "avaliação" : "avaliações"}</p>
                        </div>

                        </div>
                        
                       <h3>Classificação</h3>
                       <div className="card-classificacao">
                        <div className="nota-imagem-classificacao">
                        <p><strong>5</strong></p><img src="/images/estrela.png" className="estrela-classificacao"/>
                        <img src="/images/barra-classificacao.png" className="barra-classificacao"/><p>85</p>
                        </div>
                        <div className="nota-imagem-classificacao">
                        <p><strong>4</strong></p><img src="/images/estrela.png" className="estrela-classificacao"/>
                        <img src="/images/barra-classificacao.png" className="barra-classificacao"/><p>85</p>
                        </div>
                        <div className="nota-imagem-classificacao">
                        <p><strong>3</strong></p><img src="/images/estrela.png" className="estrela-classificacao"/>
                        <img src="/images/barra-classificacao.png" className="barra-classificacao"/><p>85</p>
                        </div>
                        <div className="nota-imagem-classificacao">
                        <p><strong>2</strong></p><img src="/images/estrela.png" className="estrela-classificacao"/>
                        <img src="/images/barra-classificacao.png" className="barra-classificacao"/><p>85</p>
                        </div>
                        <div className="nota-imagem-classificacao">
                        <p><strong>1</strong></p><img src="/images/estrela.png" className="estrela-classificacao"/>
                        <img src="/images/barra-classificacao.png" className="barra-classificacao"/><p>85</p>
                        </div>

                        </div>
                        </div>
                        
                        <div className="card-comentarios">
                            <div className="total-comentarios">
                            <p>{produto.totalComentarios} {produto.totalComentarios === 1 ? "Comentário" : "Comentários"} </p>
                            </div>
                            <h3>Avaliações com fotos</h3>
                            {produto.usuariosComentarios.map((usuario, index) => (
                            <div className="usuario-nota-comentario">
                            <div className="nome-foto" key={index}>
                            <img src={usuario.foto_url} className="foto-usuario-comentarios" alt="Foto do usuário"/>
                            <h3>{usuario.nome}</h3>
                            <p>{calcularEstrelas(usuario.nota)}</p>
                            </div>

                            <p>{usuario.comentario}</p>

                            <p className="paragrafo-data-comentario">{usuario.dataFormatada}</p>
                            </div>))}
                            <button className="botao-ver-avaliacoes">Ver todas avaliacoes</button>
                        </div>
                        
                    </div>
                    </div>
                    </div>
                </>
            ) : (
                <p>Carregando...</p>
            )}
            </div>
            </div>
            <Footer/>
        </div>
    );  
}

export default PaginaProduto;