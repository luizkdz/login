import './styles.css';
import { useState } from 'react';

function CardPaginaBuscaProduto({oferta}){

    const [imagemCoracao, setImagemCoracao] = useState("/images/coracao-branco.png");

    const mudarImagemCoracao = () => {
        setImagemCoracao((imagem) => 
            imagem === "/images/coracao-branco.png" ? "/images/heart.png"  : "/images/coracao-branco.png")
    }
    return (
                <div className="card-produto-pagina-busca">
                <div className="container-card-produto-pagina-busca">
                    <div className="container-frete-favorito">
                        <div className="container-icone-frete">
                            <div className="card-icone-frete">
                            <img src="/images/truck.png" className="icone-caminhao-frete"/><p className="texto-entrega">Entrega</p>
                            </div>
                        
                        <div className="favorito" onClick={mudarImagemCoracao}>
                            <img src={imagemCoracao} className="icone-coracao"/>
                        </div>
                        </div>
                    </div>
                    <img src={oferta.imagem} className="imagem-card-produto-pagina-busca"/>
                </div>
                <div className="texto-card-produto-pagina-busca">
                    <p className="paragrafo-card">{oferta.nome}</p>
                    <p className="paragrafo-card">avaliação</p>
                    <p className="paragrafo-card">{oferta.preco}</p>
                    <p className="paragrafo-card">{oferta.precoParcelado}</p>
                    <p className="paragrafo-preco-card"><strong>{oferta.precoPix}</strong> no Pix</p>
                    <p className="paragrafo-desconto">Desconto</p>
                    <p className="paragrafo-card">Frete gratis</p>
                </div>
            </div>

)
}

export default CardPaginaBuscaProduto;