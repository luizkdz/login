import './styles.css';
import Header from '../componentes/header/index.js';
import Footer from '../componentes/footer/index.js';
import { useCarrinho } from '../context/carrinhoContext.js';
import { useEffect } from 'react';
import { useState } from 'react';
import Carousel from '../componentes/carousel/index.js';


function PaginaCarrinho() {

    
    
    const calcularDesconto = (desconto) => {
        const descontoNumber = Number(desconto);
        return descontoNumber ? `-${descontoNumber}%` : "";
    }

    const {obterCarrinho, carrinhoItens ,excluirItemCarrinho,editarQuantidadeItemCarrinho} = useCarrinho();

    

    useEffect(() => {
        obterCarrinho();
    },[]);

    const calcularPrecoTotal = () => {
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

                    <div className="container-imagem-texto-carrinho">
                    <img src={item.imagem_produto} className="imagem-produto-pagina-carrinho"/>
                    <div className="container-texto-botoes">
                    <p>{item.produto_nome}</p>
                    <div className="container-botoes-excluir-salvar-altera">
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}} onClick={() => excluirItemCarrinho(item.id)}>Excluir</p>
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}}>Salvar</p>
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}}>Alterar</p>
                        <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}}>Comprar Agora</p>
                        </div>
                    
                    </div>
                    <div className="container-botao-alterar-quantidade">
                    <img src="/images/minus.png" className="botao-menos-quantidade" onClick={() => editarQuantidadeItemCarrinho(item.quantidade - 1, item.id)}/>
                    <p>{item.quantidade}</p>
                    <img src = "/images/plus.png" className="botao-mais-quantidade" onClick={() => editarQuantidadeItemCarrinho(item.quantidade + 1, item.id)}/>
                    </div>
                    <div className="container-preco-preco-pix-desconto">
                        <div className="container-preco-desconto">
                        <p style = {{fontSize: "12px", color:`#00a650`}}>{calcularDesconto(item.desconto)}</p>
                        <p style = {{fontSize: "12px", textDecoration: "line-through"}}>R${precoTotal}</p>
                        </div>
                        <p style={{fontSize:"20px",marginLeft:"10px"}}>R${precoTotalPix.toFixed(2)}</p>
                        
                    </div>
                    </div>
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
                <p>R${calcularPrecoTotal()}</p>
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
            <div className="container-texto-recomendacoes">
            <p className="texto-recomendacoes">Recomendações para você</p>
            <Carousel itensPassados={4} carrinhoItens={carrinhoItens}/>
            </div>
        </div>
        
        <Footer/>           
        </div>
    )
}

export default PaginaCarrinho;