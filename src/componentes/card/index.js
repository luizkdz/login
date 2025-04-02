import './styles.css';



function Card({url, nome, preco,precoParcelado, precoPix, onClick}) {

    return (
        <div className="card-produto" onClick={onClick}>
            <img src={url} className="imagem-card"></img>
            <div className="info-produtos">
            <p className="nome-produto">{nome.length > 20 ? nome.slice(0,17) + "..." : nome}</p>
            <p className="preco-produto">R$ {preco}</p>
            <p className="preco-parcelado">R$ {precoParcelado}</p>
            <p className="preco-pix">ou R$ <strong>{precoPix}</strong> no Pix</p>
            
            </div>
        </div>

    )
}

export default Card;