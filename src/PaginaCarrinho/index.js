import './styles.css';
import Header from '../componentes/header/index.js';
import Footer from '../componentes/footer/index.js';
import { useCarrinho } from '../context/carrinhoContext.js';
import { useEffect } from 'react';
import { useState } from 'react';
import Carousel from '../componentes/carousel/index.js';
import axios from 'axios';
import CardCarrinho from '../componentes/card-carrinho/index.js';
import CardProdutoSalvo from '../componentes/card-produto-salvo/index.js';


function PaginaCarrinho() {

    const [mostrarProdutosSalvos,setMostrarProdutosSalvos] = useState(false);
    const [itensSalvos, setItensSalvos] = useState([]);
    const [selecionarAlterar, setSelecionarAlterar] = useState(false);
    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const [mostrarOpcoesSegundoInput, setMostrarOpcoesSegundoInput] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);
    const [modalUnidades,setModalUnidades] = useState(false);
    const [valorQuantidade, setValorQuantidade] = useState("mais");
    const selecionarQuantidade = (quantidade) => {
        setQuantidadeSelecionada(Number(quantidade));
        setMostrarOpcoes(false);
    }

const handleMostrarOpcoesSegundoInput = () => {
    setMostrarOpcoesSegundoInput(!mostrarOpcoesSegundoInput);
}

const handleSelecionarAlterar = () =>{
    setSelecionarAlterar(!selecionarAlterar);
}

   const handleMostrarProdutos = () => {
    setMostrarProdutosSalvos(!mostrarProdutosSalvos);
   } 
    

    const {obterCarrinho, carrinhoItens,editarQuantidadeItemCarrinho} = useCarrinho();

    const carregarItensSalvos = async () => {
        try{
            const resposta = await axios.get("http://localhost:5000/itens-salvos",{withCredentials:true});
            setItensSalvos(resposta.data);
        }
        catch(err){
            console.error("Não foi possivel carregar os itens salvos");
        }
    }
    
    const adicionarItemSalvo = async (produtoId) => {
        try{
            await axios.post("http://localhost:5000/itens-salvos",{ produtoId },{withCredentials:true});
            await carregarItensSalvos();
        }
        catch(err){
            console.error("Não foi possivel adicionar item salvo");
        }
    }

    const excluirItemSalvo = async (item) => {
        try {
            await axios.delete("http://localhost:5000/itens-salvos", {
                data: { produtoId: item },
                withCredentials: true
            });
            await carregarItensSalvos();
        } catch (err) {
            console.error("Não foi possível excluir o item salvo");
        }
    };

    

    useEffect(() => {
        obterCarrinho();
    },[carrinhoItens]);

    useEffect(() => {
        carregarItensSalvos();
    },[])

    const calcularPrecoTotal = (item) => {
        return carrinhoItens.reduce((soma,item) => {
            const preco = Number(item.preco_pix);
            const quantidade = Number(item.quantidade);
            return soma + preco * quantidade
        },0);
    }

    const calcularFreteTotal = () => {
        return carrinhoItens.reduce((soma,item) => {
            const precoFrete = Number(item.valor_frete);
            return soma + precoFrete;
        },0);
    }

    const precoTotalMaisFrete = calcularPrecoTotal() + calcularFreteTotal();
    return (
        
        <div className="pagina-toda-carrinho">
        <Header props="barra-carrinho"/> 
        <div className="secao-carrinho">
            <div className="secao-carrinho-resumo-compra-recomendacoes">
            <div className="container-carrinho-resumo-compra">
            
            <div className={carrinhoItens.length > 0 ? "card-carrinho-com-item" : "card-carrinho-vazio"}>
            
                <div className={carrinhoItens.length > 0 ? "container-titulo-produtos" : ""}>
                {carrinhoItens.length > 0 ? <p style= {{fontSize:"18px"}}>Produtos</p> : ""}
                </div>
           <div className="container-card-carrinho">
            
            {carrinhoItens.length > 0 ? carrinhoItens.map((item) => {
                let precoTotal = parseFloat(item.quantidade) * parseFloat(item.preco)
                console.log(item.quantidade);
                console.log(item.preco);
                precoTotal = precoTotal.toFixed(2);
                console.log(precoTotal);
                let precoTotalPix = parseFloat(item.quantidade) * parseFloat(item.preco_pix);

                return (
                    <div className="card-carrinho">
                    <CardCarrinho item = {item} precoTotal={precoTotal} precoTotalPix={precoTotalPix} setItensSalvos={setItensSalvos} carregarItensSalvos={carregarItensSalvos} adicionarItemSalvo={adicionarItemSalvo}/>
                    
                    <div className="container-preco-frete">
                        <p>Frete</p>
                        <p>R${item.valor_frete}</p>
                    </div>
                    </div>
                )
            }) : <div className="container-carrinho-vazio">
                <img src ="/images/shopping-cart.png" className="imagem-carrinho-vazio"/>
                <div className="texto-carrinho-vazio">
                <p style={{fontSize:"18px"}}>Seu carrinho está vazio</p>
                <p style={{fontSize:"14px"}}>Navegue para descobrir ofertas incríveis,adicione produtos</p>           
                </div>
                <p style={{color:"var(--andes-color-blue-500, #3483fa)"}}>Conferir produtos</p>
                    </div>}
            
            </div>
            </div>
            {carrinhoItens.length > 0 ? <div className="card-resumo-da-compra">
                <div className="titulo-resumo-da-compra">
                <p style={{fontSize:"18px"}}>Resumo da compra</p>
                </div>
                <div className="produto-preco-produto">
                <p>Produto:</p>
                <p>R${calcularPrecoTotal().toFixed(2)}</p>
                </div>
                <div className="frete-preco-frete">
                <p>Frete:</p>
                <p>R${calcularFreteTotal().toFixed(2)}</p>
                </div>
                <p style={{fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}} >Inserir código de cupom</p>
                <div className="container-total">
                <p>Total</p>
                <p>R${precoTotalMaisFrete.toFixed(2)}</p>
                </div>
                <div className="container-botao">
                    <button>Continuar a Compra</button>
                </div>
            </div> : <div className="card-resumo-da-compra">
                <div className="titulo-resumo-da-compra">
                <p style={{color:"rgba(0, 0, 0, .25)",fontSize:"18px"}}>Resumo da compra</p>
                </div>
                <div className="container-total">
                <p style={{color:"rgba(0, 0, 0, .25)",fontSize:"14px"}}>Aqui você encontrará os valores da sua compra assim que adicionar os produtos</p>
                </div>
            </div>}
            </div>
            <div>
            
            </div>
            <div className="container-item-salvo">
            <div className="card-item-salvo">
                <div className="titulo-salvo-imagem">
                <p>Produtos salvos</p>
                <img src={itensSalvos?.[0]?.url} className={!mostrarProdutosSalvos ? "produto-salvo-imagem" : "produto-salvo-imagem-opacity"}/>
                </div>
                <div className="mostrar-produtos-imagem-drop-down" onClick={() => handleMostrarProdutos()}>
                <p style={{color:"#3483fa"}}>Ver produtos</p><img src={mostrarProdutosSalvos ? "/images/setinha-cima-dropdown-preta.png" : "/images/setinha-dropdown-preta.png"} className="imagem-botao-dropdown-produtos-salvos"/></div>
                {mostrarProdutosSalvos && (
                <div className="container-item-salvo">
                    {itensSalvos?.map((item) => {
                        let precoTotal = parseFloat(item.quantidade) * parseFloat(item.preco)
                        console.log(item.quantidade);
                        console.log(item.preco);
                        precoTotal = precoTotal.toFixed(2);
                        console.log(precoTotal);
                        let precoTotalPix = parseFloat(item.quantidade) * parseFloat(item.preco);
                        return (
                            
                        
                        <CardProdutoSalvo item = {item} obterCarrinho={obterCarrinho} precoTotal={precoTotal} excluirItemSalvo={excluirItemSalvo} precoTotalPix={precoTotalPix} setItensSalvos={setItensSalvos} carregarItensSalvos={carregarItensSalvos} adicionarItemSalvo={adicionarItemSalvo}/>
                    )})}
                    </div>
                        )}
                
                
                
                
            </div>
        </div>
            <div className="container-texto-recomendacoes">
            <p className="texto-recomendacoes">Recomendações para você</p>
            <Carousel itensPassados={4} carrinhoItens={carrinhoItens}/>
            </div>
        
        </div>
        </div>
        <div className="secao-alterar">
            <div className="container-alterar">
                <div className="imagem-texto-preco-alterar">
                    <img src = ""/>
                    <p>Nome Produto</p>
                    <p>Preco</p>
                    <a href="#">Ver detalhe do produto</a>
                </div>
                <div className="titulo-inputs-alterar">
                <p className="titulo-alterar" >Escolha os detalhes deste produto</p>
                <div className="container-input-alterar">
                <p>Cor:</p>
                        <div className="container-quantidade-foto-dropdown-alterar">
                        <p style ={{cursor:"pointer"}} onClick={() => setMostrarOpcoes(!mostrarOpcoes)}> {quantidadeSelecionada !== "mais" ? `${quantidadeSelecionada} unidade${quantidadeSelecionada !== "1" ? "s" : ""}` : "Selecione a quantidade" }</p><img src={mostrarOpcoes ? "/images/setinha-cima-dropdown-preta.png" : "/images/setinha-dropdown-preta.png"} className="imagem-botao-dropdown-quantidade"/>
                        </div>
                            {mostrarOpcoes && (
                            <div className="selecao-input-cor">
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
                                            <div className="container-input-alterar">
                                            <p>Quantidade:</p>
                        <div className="container-quantidade-foto-dropdown-alterar">
                        <p style ={{cursor:"pointer"}} onClick={() => handleMostrarOpcoesSegundoInput()}>{quantidadeSelecionada !== "mais" ? `${quantidadeSelecionada} unidade${quantidadeSelecionada !== "1" ? "s" : ""}` : "Selecione a quantidade" }</p><img src={mostrarOpcoes ? "/images/setinha-cima-dropdown-preta.png" : "/images/setinha-dropdown-preta.png"} className="imagem-botao-dropdown-quantidade"/>
                        </div>
                            {mostrarOpcoesSegundoInput && (
                            <div className="selecao-input-cor">
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
                    <button className="botao-atualizar-alterar">Atualizar</button>
                </div>
            </div>
        </div>
        <Footer/>           
        </div>
    )
}

export default PaginaCarrinho;