import './styles.css';
import { useEffect, useState } from 'react';
import { calcularPrecoParcelado } from '../../utils/calcularPrecoParcelado';
import { calcularEstrelas } from '../../utils/calcularEstrelas';
import { calcularDesconto } from '../../utils/calcularDesconto';
import { calcularFretePorCep } from '../../utils/calcularFretePorCep';
import { useCep } from '../../context/CepContext';

function CardPaginaBuscaProduto({oferta, onClick}){

    const [imagemCoracao, setImagemCoracao] = useState("/images/coracao-branco.png");
    const {cep} = useCep();
    const [localidade, setLocalidade] = useState("");
    const [valorFrete, setValorFrete] = useState("");
    const [prazo, setPrazo] = useState("");
    const mudarImagemCoracao = () => {
        setImagemCoracao((imagem) => 
            imagem === "/images/coracao-branco.png" ? "/images/heart.png"  : "/images/coracao-branco.png")
    }

    useEffect( () => {
        calcularFretePorCep(oferta.id,cep, setLocalidade, setValorFrete, setPrazo);
    },[cep,oferta.produto_id])
    

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
                    <img src={oferta.url} className="imagem-card-produto-pagina-busca"/>
                
                <div className="texto-card-produto-pagina-busca">
                    <p className="paragrafo-card">{oferta.nome.length > 25 ? oferta.nome.slice(0,22) + "..." : oferta.nome}</p>
                    <p className="paragrafo-card">{calcularEstrelas(oferta.media_avaliacoes)} {oferta.media_avaliacoes} ({oferta.total_avaliacoes})</p>
                    <p className="paragrafo-card">R${oferta.preco}</p>
                    <p className="paragrafo-card">em {oferta.parcelas_máximas}x de R${calcularPrecoParcelado(oferta.preco_parcelado, oferta.parcelas_máximas)}</p>
                    <p className="paragrafo-preco-card"><strong>{oferta.preco_pix}</strong> no Pix</p>
                    <p className="paragrafo-desconto">{calcularDesconto(oferta.desconto)}</p>
                    <p className="paragrafo-card">R${valorFrete ? valorFrete.toFixed(2): null}</p>
                </div>
                </div>
            </div>

)
}

export default CardPaginaBuscaProduto;