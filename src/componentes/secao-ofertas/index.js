import { useState } from 'react';
import './styles.css';

const ofertas = [
    {
        nome: "Notebook Arius 4124",
        imagem: "./images/prato1.jpeg",
        preco: "R$ 3.500,00",
        precoParcelado: "12x de R$ 350,00",
        precoPix: "R$ 3.200,00"
    },
    {
        nome: "Smartphone Zeta X10",
        imagem: "./images/prato2.jpeg",
        preco: "R$ 2.000,00",
        precoParcelado: "10x de R$ 200,00",
        precoPix: "R$ 1.850,00"
    },
    {
        nome: "Fone de Ouvido BassPro",
        imagem: "./images/prato3.jpeg",
        preco: "R$ 250,00",
        precoParcelado: "5x de R$ 50,00",
        precoPix: "R$ 220,00"
    },
    {
        nome: "Smart TV 55' Ultra HD",
        imagem: "./images/imagem-jogos.png",
        preco: "R$ 4.500,00",
        precoParcelado: "10x de R$ 450,00",
        precoPix: "R$ 4.100,00"
    },{
        nome: "Notebook Arius 4124",
        imagem: "./images/prato1.jpeg",
        preco: "R$ 3.500,00",
        precoParcelado: "12x de R$ 350,00",
        precoPix: "R$ 3.200,00"
    },
    {
        nome: "Smartphone Zeta X10",
        imagem: "./images/prato2.jpeg",
        preco: "R$ 2.000,00",
        precoParcelado: "10x de R$ 200,00",
        precoPix: "R$ 1.850,00"
    },
    {
        nome: "Fone de Ouvido BassPro",
        imagem: "./images/prato3.jpeg",
        preco: "R$ 250,00",
        precoParcelado: "5x de R$ 50,00",
        precoPix: "R$ 220,00"
    },
    {
        nome: "Smart TV 55' Ultra HD",
        imagem: "./images/imagem-jogos.png",
        preco: "R$ 4.500,00",
        precoParcelado: "10x de R$ 450,00",
        precoPix: "R$ 4.100,00"
    }
];

function SecaoOfertas() {

    const [indice,setIndice] = useState(0);

    const itensVisiveis = 4;

    const avancar = () => {
        if(indice + itensVisiveis < ofertas.length){
            setIndice(indice+4);    
        }
    };

    const voltar = () => {
        if(indice > 0){
            setIndice(indice - 4);
        }
    }


    return (
        <div className="secao-ofertas">
            <div className="container-ofertas">
            <h1 className="titulo-secao-ofertas">Explore nossos produtos</h1>
            <div className="container-ofertas-card" >
            <button className="botao-setinha" disabled={indice === 0} onClick={voltar}>
            <img src = "./images/setinha-esquerda.png" disabled={indice === 0} className="imagem-setinha-esquerda"/>
                </button>
                <div className="lista-ofertas" key={indice}>
                {ofertas.slice(indice, indice + itensVisiveis).map((item, index) => (
                        <div key={index} className="card-ofertas fade-in"  >
                            <img src={item.imagem} className="imagem-ofertas" alt={item.nome} />
                                <p className="nome-ofertas">{item.nome}</p>
                                <p className="preco-ofertas">{item.preco}</p>
                                <p className="preco-parcelado-ofertas">{item.precoParcelado}</p>
                                <p className="preco-pix-ofertas">ou <strong>{item.precoPix}</strong> no Pix</p>
                        </div>
                    ))}
                    </div>
                    <button onClick={avancar} className="botao-setinha-direita" disabled= {indice + itensVisiveis >= ofertas.length} ><img src = "./images/setinha-direita.png" className="imagem-setinha-direita"/></button>
                    </div>
                    
                
            </div>
            
        </div>
        )
}

export default SecaoOfertas;