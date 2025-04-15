import './styles.css';
import Header from '../componentes/header/index.js';
import Footer from '../componentes/footer/index.js';
import { useCarrinho } from '../context/carrinhoContext.js';
import { useEffect } from 'react';




function PaginaCarrinho() {
    const calcularDesconto = (desconto) => {
        const descontoNumber = Number(desconto);
        return descontoNumber ? `-${descontoNumber}%` : "";
    }

    const {obterCarrinho, carrinhoItens ,excluirItemCarrinho} = useCarrinho();

    useEffect(() => {
        obterCarrinho();
    },[]);
    return (
        
        <div className="pagina-toda-carrinho">
        <Header props="barra-carrinho"/> 
        <div className="secao-carrinho">
            <div className="alinhar-carrinho-2">
            <div className="alinhar-carrinho">
                <div className="container-titulo-produtos">
                <p style= {{fontSize:"18px"}}>Produtos</p>
                </div>
           <div className="container-card-carrinho">
            
            {carrinhoItens.map((item) => {
                return (
                    <div className="card-carrinho">

                    <div className="container-imagem-texto-carrinho">
                    <img src={item.imagem_produto} className="imagem-produto-pagina-carrinho"/>
                    <div className="container-texto-botoes">
                    <p>{item.produto_nome}</p>
                    <p>Cor:Rosa</p>
                    <div className="container-botoes-excluir-salvar-altera">
                        <p onClick={() => excluirItemCarrinho(item.id)}>Excluir</p>
                        <p>Salvar</p>
                        <p>Alterar</p>
                        <p>Comprar Agora</p>
                        </div>
                    
                    </div>
                    <div className="container-botao-alterar-quantidade">
                    <img src="/images/minus.png" className="botao-menos-quantidade"/>
                    <p>3</p>
                    <img src = "/images/plus.png" className="botao-mais-quantidade"/>
                    </div>
                    <div className="container-preco-preco-pix-desconto">
                        <div className="container-preco-desconto">
                        <p style = {{fontSize: "12px", color:`#00a650`}}>{calcularDesconto(item.desconto)}</p>
                        <p style = {{fontSize: "12px", textDecoration: "line-through"}}>R${item.preco}</p>
                        </div>
                        <p style={{fontSize:"20px",marginLeft:"10px"}}>R${item.preco_pix}</p>
                        
                    </div>
                    
                    </div>
                    
                    
                    </div>
                )
            })}
            
            </div>
            </div>
            <div className="card-resumo-da-compra">
                <div className="titulo-resumo-da-compra">
                <p style={{fontSize:"18px"}}>Resumo da compra</p>
                </div>
                <div className="container-total">
                <p>Total</p>
                <p>R$Oi</p>
                </div>
                <div className="container-botao">
                    <button>Continuar a Compra</button>
                </div>
            </div>
            </div>
        </div>
        <Footer/>           
        </div>
    )
}

export default PaginaCarrinho;