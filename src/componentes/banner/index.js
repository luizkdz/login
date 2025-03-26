import { useState } from "react";
import './styles.css';

const imagens = [
    "./images/cafe1.jpg",
    "./images/cafe2.jpeg",
    "./images/cafe3.jpeg"
];

function Banner() {
    const [indice, setIndice] = useState(0);

    const proxImagem = () => {
        setIndice((imagem) => (imagem + 1) % imagens.length);
    };

    const imagemAnterior = () => {
        setIndice((imagem) => (imagem - 1 + imagens.length) % imagens.length);
    };

    const selecionarImagem = (index) => {
        setIndice(index);
    };
    
    return (
        <div className="banner-container">
            <div className="secao-banner">
                <button className="seta-esquerda" onClick={imagemAnterior}>
                    <img src="./images/setinha-esquerda.png" className="setinha-esquerda-banner" />
                </button>
                <div className="banner-wrapper" key={indice}>
                    <img src={imagens[indice]} className="imagem-banner fade-in-banner" alt="foto-banner" />
                </div>
                <button className="seta-direita" onClick={proxImagem}>
                    <img src="./images/setinha-direita.png" className="setinha-direita-banner" />
                </button>
            </div>
            <div className="indicadores">
                {imagens.map((_, index) => (
                    <span
                        key={index}
                        className={`bolinha ${index === indice ? "ativa" : ""}`}
                        onClick={() => selecionarImagem(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
}

export default Banner;