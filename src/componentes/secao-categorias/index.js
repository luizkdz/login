import { useEffect, useState } from 'react';
import './styles.css'
import axios from 'axios';


function SecaoCategorias() {

    const [categorias,setCategorias] = useState([]);
    const [index, setIndex] = useState(0);
    const totalIndicadores = categorias.length/12;

    const next = () => {
        
        setIndex((prev) => (prev + 1) % 3);
        
      };
    
      const prev = () => {
            setIndex((prev) => (prev - 1 + 3) % 3);
      };

    const fetchCategoria =async () => {
        const resposta = await axios.get("http://localhost:5000/categorias-tipo");
        setCategorias(resposta.data);
    }
    useEffect(() => {
        fetchCategoria();
    },[]);
    return (
    <div className="secao-categorias">
        <div className="container-secao-categorias">
            <div className="card-todas-categorias">
                <div className="titulo-card-categoria-container">
                <div className="texto-titulo-card-categoria">
                <h2>Categorias</h2>
                <p>Mostrar todas as categorias</p>
                </div>
                <div className="indicadores-card-categoria">
                    {Array.from({length:totalIndicadores}, (_,i) => {
                        return (
                            <span
                                key={i}
                                className={`indicador ${i === index ? 'ativo' : ''}`}
                                onClick={() => setIndex(i)}
                            ></span>
                        )
                    })}
                </div>
                
                </div>
                <div key = {index} className="container-cards-categoria fade-in" >
                <button className="seta-esquerda-carousel" onClick={prev}>
                    <img src="./images/setinha-esquerda.png" className="setinha-esquerda-banner" />
                </button>
                {categorias.slice(index * 12, (index + 1) * 12).map((item, idx) => {
                    return (
                        <div className="card-cada-categoria fade-in">
                    <div className="container-imagem-card-cada-categoria">
                    <img src={item.imagem} className="imagem-card-cada-categoria"/>
                    </div>
                    <div className="container-texto-valor-card-cada-categoria">
                    <p>{item.valor}</p>
                        </div>
                        </div>
                    )
                })}
                <button className="seta-direita-carousel" onClick={next}>
                    <img src="./images/setinha-direita.png" className="setinha-direita-banner" />
                </button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default SecaoCategorias;