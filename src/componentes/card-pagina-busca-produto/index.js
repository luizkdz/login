import './styles.css';
import { useState } from 'react';

function CardPaginaBuscaProduto({oferta, onClick}){

    const [imagemCoracao, setImagemCoracao] = useState("/images/coracao-branco.png");

    const mudarImagemCoracao = () => {
        setImagemCoracao((imagem) => 
            imagem === "/images/coracao-branco.png" ? "/images/heart.png"  : "/images/coracao-branco.png")
    }

    const calcularEstrelas = (avaliacao) => {
        const totalEstrelas = 5;
        const inteira = Math.floor(avaliacao);
        const temMeia = avaliacao % 1 !== 0;
        const estrelas = [];
    
        for (let i = 0; i < inteira; i++) {
            estrelas.push(<img key={i} src="/images/estrelacheia.png" className="estrela-avaliacao" alt="⭐" />);
        }
        if (temMeia) {
            estrelas.push(<img key="meia" src="/images/meiaestrela.png" className="estrela-avaliacao" alt="⭐½" />);
        }
        while (estrelas.length < totalEstrelas) {
            estrelas.push(<img key={estrelas.length} src="/images/estrelavazia.png" className="estrela-avaliacao" alt="☆" />);
        }
        return estrelas;
    };
    const calcularFrete = (valor) => {
        return valor == 0 ? "Frete Grátis" : `Frete: R$ ${valor.toFixed(2)}`;
    };
    
    const calcularDesconto = (desconto) => {
        const descontoNumber = Number(desconto);
        return descontoNumber ? `(${descontoNumber}% de desconto no pix)` : "";
    }

    const calcularPrecoParcelado = (preco, parcelas) => {
        return (preco / parcelas).toFixed(2);
    };

    return (
                <div className="card-produto-pagina-busca">
                <div className="container-card-produto-pagina-busca">
                    <div className="container-frete-favorito">
                        <div className="container-icone-frete">
                            <div className="card-icone-frete">
                            <img src="/images/truck.png" className="icone-caminhao-frete"/><p className="texto-entrega">{oferta.entrega}</p>
                            </div>
                        
                        <div className="favorito" onClick={mudarImagemCoracao}>
                            <img src={imagemCoracao} className="icone-coracao"/>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="imagem-card-clique" onClick={onClick}>
                    <img src={oferta.imagem} className="imagem-card-produto-pagina-busca"/>
                
                <div className="texto-card-produto-pagina-busca">
                    <p className="paragrafo-card">{oferta.nome}</p>
                    <p className="paragrafo-card">{calcularEstrelas(oferta.avaliacao)} {oferta.avaliacao} (340)</p>
                    <p className="paragrafo-card">R${oferta.preco}</p>
                    <p className="paragrafo-card">em {oferta.parcelas_maximas}x de R${calcularPrecoParcelado(oferta.preco_parcelado, oferta.parcelas_maximas)}</p>
                    <p className="paragrafo-preco-card"><strong>{oferta.preco_pix}</strong> no Pix</p>
                    <p className="paragrafo-desconto">{calcularDesconto(oferta.desconto)}</p>
                    <p className="paragrafo-card">{calcularFrete(oferta.frete)}</p>
                </div>
                </div>
            </div>

)
}

export default CardPaginaBuscaProduto;