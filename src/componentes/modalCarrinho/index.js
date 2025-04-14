import { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useCarrinho } from '../../context/carrinhoContext';



function ModalCarrinho(){

    const [produtos,setProdutos] = useState([]);
    const {carrinhoItens} = useCarrinho();
const fetchProducts = async () => {
    try{
        const respostas = await Promise.all(carrinhoItens.map(item => axios.get(`http://localhost:5000/produto/${item.produto_id}`)));
        console.log(`Resposta é`,respostas);
        const produtosComQuantidade = respostas.map((res,index) => ({
            ...res.data.produto,
            quantidade:carrinhoItens[index].quantidade
        }))
        setProdutos(produtosComQuantidade);
    }
    catch(err){
        console.error("Não foi possível carregar o produto");
    }
}

useEffect(() => {
    
    fetchProducts();
    
},[carrinhoItens]);

useEffect(() => {
    console.log(produtos);
})
    return (
        <div className="modal-carrinho">
            <div className="container-secoes-modal-carrinho">
            {produtos.map((produto, index) => {
                console.log(`O produto é`,produto);
    return (
        <div key={index} className="container-imagem-item-carrinho">
            <img src={produto.imagens?.[0]} alt={produto.produto_nome} />
            <div className="texto-item-carrinho">
                <p>Adicionado ao carrinho</p>
                <p>{produto.produto_nome}</p>
                <p>Quantidade: {produto.quantidade}</p>
            </div>
        </div>
    );
})}
            <div className="segunda-secao-modal-carrinho">
                <p>Aproveite os nossos outros produtos com desconto</p>
                <div className="container-card-modal-carrinho">
                <div className="card-modal-carrinho">
                    <img src =""/>
                    <p>titulo</p>
                    <p>preço</p>
                </div>
                <div className="card-modal-carrinho">
                    <img src =""/>
                    <p>titulo</p>
                    <p>preço</p>
                </div>
                <div className="card-modal-carrinho">
                    <img src =""/>
                    <p>titulo</p>
                    <p>preço</p>
                </div>
                <div className="card-modal-carrinho">
                    <img src =""/>
                    <p>titulo</p>
                    <p>preço</p>
                </div>
                <div className="card-modal-carrinho">
                    <img src =""/>
                    <p>titulo</p>
                    <p>preço</p>
                </div>
                <div className="card-modal-carrinho">
                    <img src =""/>
                    <p>titulo</p>
                    <p>preço</p>
                </div>
                <div className="card-modal-carrinho">
                    <img src =""/>
                    <p>titulo</p>
                    <p>preço</p>
                </div>
                <div className="card-modal-carrinho">
                    <img src =""/>
                    <p>titulo</p>
                    <p>preço</p>
                </div>
                <div className="card-modal-carrinho">
                    <img src =""/>
                    <p>titulo</p>
                    <p>preço</p>
                </div>
                <div className="card-modal-carrinho">
                    <img src =""/>
                    <p>titulo</p>
                    <p>preço</p>
                </div>
                </div>
                
            </div>
            
        </div>
        <div className="container-botoes-modal-carrinho">
    
                    <button>Ver mais produtos</button>
                    <button>Ir para o carrinho</button>
                    
                </div>
        </div>
    )
}

export default ModalCarrinho;