import './styles.css';
import Card from '../card/index.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { calcularPrecoParcelado } from '../../utils/calcularPrecoParcelado.js';


function Carousel({produtos: produtosProp, setProdutos :setProdutosProp,itensPassados, titulo, carrinhoItens}  ) {
    
    const [produtos,setProdutos] = useState([]);
    const [index, setIndex] = useState(0);

    const produtosAtuais = produtosProp ?? produtos;
    const setProdutosAtuais = setProdutosProp ?? setProdutos;
    const produtosDisponiveis = produtosAtuais.filter((item) => !carrinhoItens?.some((p) => p.produto_id === item.id));
    const totalPaginas = Math.ceil(produtosDisponiveis.length / itensPassados);
      const next = () => {
        
        setIndex((prev) => (prev + 1) % totalPaginas);
        
      };
    
      const prev = () => {
            setIndex((prev) => (prev - 1 + totalPaginas) % totalPaginas);
      };
      const fetchProducts = async () => {
        try{
            const resposta = await axios.get("http://localhost:5000/produtos");
            setProdutosAtuais(resposta.data);
        }
        catch(err){
            console.log("Erro ao buscar produtos", err);
        }

    }

    useEffect(() => {
        fetchProducts();
    },[])
  

    return (
    <div className="container-carousel-carrinho">
        <div className="titulo-produtos-carousel">
        <div className="titulo-carousel"><h2>{titulo}</h2></div>
            <div className="carousel-wrapper">
            <button className="seta-esquerda-carousel" onClick={prev}>
                    <img src="./images/setinha-esquerda.png" className="setinha-esquerda-banner" />
                </button>
      
      <div style={{overflow:"hidden",width:`${produtosAtuais.length >= 2 ? itensPassados * 250 + (itensPassados * 10 - 10) : (1 * 250)}px` }}>
        <div
          className="carousel-track"
          style={{ transform: `translateX(calc(-${index * (250 * itensPassados)}px - ${index * 10 * itensPassados}px))` }}
        >
          {produtosAtuais.map((item, i) => {
            const jaNoCarrinho = (carrinhoItens?.some((p) => {return p.produto_id === item.id}));
            if(jaNoCarrinho) return null;
            return (
            <div className="card-carousel-carrinho" key={i}>
              <img src={item.url} alt={item.nome} className="imagem-carousel" />
              <p className="nome-produto">{item.nome.length > 20 ? item.nome.slice(0,17) + "..." : item.nome}</p>
              <p>R$ {item.preco}</p>
              <p className="preco-parcelado">{item.parcelas_máximas}x de R$ {calcularPrecoParcelado(item.preco_parcelado,item.parcelas_máximas)}</p>
              <p>ou R$<strong>{item.preco_pix}</strong> no Pix</p>
              <p>{item.entrega}</p>
              
            </div>
            )
})}
        </div>
      </div>

      <button className="seta-direita-carousel" onClick={next}>
                    <img src="./images/setinha-direita.png" className="setinha-direita-banner" />
                </button>
    </div>
    </div>
            </div>
            
            )
}

export default Carousel;