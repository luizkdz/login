import { useState } from "react";
import './styles.css';

const imagens = ["./images/cafe1.jpg",
    "./images/cafe2.jpeg",
    "./images/cafe3.jpeg"
];
function Banner() {

    const [indice, setIndice] = useState(0);

    const proxImagem = () => {
        setIndice((imagem) => ((imagem + 1 % imagens.length) % imagens.length));
    }

    const imagemAnterior = () => {
        setIndice((imagem) => ((imagem - 1 + imagens.length) % imagens.length));
    }

    const selecionarImagem = (index) => {
        setIndice(index);
    }
    

    return (
        <div className="banner-container">
            <button className="seta-esquerda" onClick={imagemAnterior}>⬅️</button>
            <img src = {imagens[indice]} className="imagem-banner" alt="foto-banner"/>
            <button className="seta-direita" onClick={proxImagem}>➡️</button>
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
    )
}

export default Banner;