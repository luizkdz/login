import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCarrinho } from '../../context/carrinhoContext';
import { Navigate, useNavigate } from 'react-router-dom';
const calcularDesconto = (desconto) => {
    const descontoNumber = Number(desconto);
    return descontoNumber ? `${descontoNumber}% OFF` : "";
}

function ModalCarrinho({fecharModalCarrinho,quantidadeSelecionada}){

    const [produtos,setProdutos] = useState([]);
    const {carrinhoItens} = useCarrinho();
    const [outrosProdutos,setOutrosProdutos] = useState([]);
    const navigate = useNavigate();
const fetchProducts = async () => {
    try{
        const respostas = await Promise.all(carrinhoItens.map(item => axios.get(`http://localhost:5000/produto/${item.produto_id}`)));
        console.log(`Resposta é`,respostas);
        const produtosComQuantidade = respostas.map((res,index) => ({
            ...res.data.produto,
            quantidade:quantidadeSelecionada
        }))
        setProdutos(produtosComQuantidade);
    }
    catch(err){
        console.error("Não foi possível carregar o produto");
    }
}

const fetchOtherProducts = async () => {
    try{
        const resposta = await axios.get(`http://localhost:5000/produtos`);
        setOutrosProdutos(resposta.data);
    }
    catch(err){
        console.error("Não foi possível carregar os outros produtos");
    }
}

useEffect(() => {
    
    fetchProducts();
    fetchOtherProducts();
    
},[setOutrosProdutos,carrinhoItens]);

useEffect(() => {
    console.log(produtos);
})
    return (
        <div className="modal-carrinho">
            <div className="container-secoes-modal-carrinho">
            <div className="container-imagem-fechar-modal">
            <img onClick={() => fecharModalCarrinho()}src = "/images/close.png" className= "imagem-fechar-modal" />
            </div>
            {produtos.map((produto, index) => {
                console.log(`O produto é`,produto);
    return (
        <div key={index} className="container-imagem-item-carrinho">
            <div className="container-imagem-icone-verificado">
            <img src={produto.imagens?.[0]} className="imagem-produto-modal-carrinho" alt={produto.produto_nome} />
            <img src="/images/verificado.png" className="imagem-verificado"/>
            </div>
            <div className="texto-item-carrinho">
                <p className="titulo-adicionado-ao-carrinho">Adicionado ao carrinho</p>
                <p>{produto.produto_nome > 26 ? produto.produto_nome.slice(0,23) + "..." : produto.produto_nome}</p>
                <p>{produto.quantidade > 1 ? produto.quantidade + ` unidades` : produto.quantidade + ` unidade`} </p>
            </div>
        </div>
    );
})}
            <div className="segunda-secao-modal-carrinho">
                <div className="titulo-outros-produtos-modal-carrinho">
                <p>Aproveite os nossos outros produtos com desconto</p>
                </div>
                <div className="container-card-modal-carrinho">
                {outrosProdutos.map(produto => {
                    const jaNoCarrinho = produtos.some((p) => p.produto_id === produto.id);
                    if(jaNoCarrinho) return null;
                    return (
                    <div className="card-modal-carrinho" onClick={() => {fecharModalCarrinho();navigate(`/produto/${produto.id}`)}}>
                    <img src ={produto.url} className="imagem-outros-produtos-modal-carrinho"/>
                    <p className="paragrafo-outros-produtos-modal-carrinho">{produto.nome.length > 20 ? produto.nome.slice(0,17) + "..." : produto.nome}</p>
                    <p style={{color: "rgba(0, 0, 0, .55)",fontSize : "12px", textDecoration: "line-through"}}>{produto.preco}</p>
                    <div className="preco-preco-pix-desconto-modal-carrinho">
                    <p style={{fontSize: "15px"}}>R${produto.preco_pix}</p>
                    <p style={{fontSize: "12px", color:`#00a650`}}>{calcularDesconto(produto.desconto)}</p>
                    </div>
                </div>
                )
                })}
                </div>
                
            </div>
            
        </div>
        <div className="container-botoes-modal-carrinho">
    
                    <button><strong>Ver mais produtos</strong></button>
                    <button><strong>Ir para o carrinho</strong></button>
                    
                </div>
        </div>
    )
}

export default ModalCarrinho;