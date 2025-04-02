import './styles.css';
import Card from '../card/index.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { calcularPrecoParcelado } from '../../utils/calcularPrecoParcelado.js';


function Carousel({titulo}) {
    const navigate = useNavigate();
    const redirectProduct = (id) => {
        navigate(`/produto/${id}`)
    }

    const [produtos,setProdutos] = useState([]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const itensPorPagina = 4;

    const proximoSlide = () => {
        if (indiceAtual < produtos.length - itensPorPagina) {
            setIndiceAtual(indiceAtual + 4);
        }
    };

    const anteriorSlide = () => {
        if (indiceAtual > 0) {
            setIndiceAtual(indiceAtual - 4);
        }
    };

    const fetchProducts = async () => {
        try{
            const resposta = await axios.get("http://localhost:5000/produtos");
            setProdutos(resposta.data);
        }
        catch(err){
            console.log("Erro ao buscar produtos", err);
        }

    }

    useEffect(() => {
        fetchProducts();
    },[])
    
    

    return(
        <div className="secao-produtos">
        <div className="container-produtos">
            <h1>{titulo}</h1>
            <div className="carousel-container">
            
            <button disabled={indiceAtual === 0} className="carousel-btn prev" onClick={anteriorSlide}><img src = "./images/setinha-esquerda.png" className="imagem-setinha-esquerda"/></button>
            <div className="carousel" key={indiceAtual}>
                    {produtos.slice(indiceAtual, indiceAtual + itensPorPagina).map((item) => (
                        <div className="carousel-item fade-in" key={item.id}>
                            <Card 
                                url={item.url} 
                                nome={item.nome} 
                                preco={item.preco} 
                                precoParcelado={
                                    item?.parcelas_máximas ? `${item.parcelas_máximas}x de ${calcularPrecoParcelado(item.preco_parcelado, item.parcelas_máximas)}`: "Consulte condições"
                                  }
                                precoPix={item.preco_pix}
                                onClick={() => {redirectProduct(item.id)}}
                            />
                        </div>
                    ))}
            </div>

            <button disabled={indiceAtual + itensPorPagina >= produtos.length}className="carousel-btn next" onClick={proximoSlide}><img src = "./images/setinha-direita.png" className="imagem-setinha-direita"/></button>
        
        </div>
        </div>
        </div>
    )
}

export default Carousel;