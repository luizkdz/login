import './styles.css';



function Card({imagem, nome, preco, descricao, onClick}) {
    return (
        <div className="card-produto" onClick={onClick}>
            <img src={imagem} className="imagem-card"></img>
            <div className="info-produtos">
            <p className="nome-produto">{nome}</p>
            <p className="preco-produto">R$ {preco}</p>
            <p className="descricao-produto">{descricao}</p>
            </div>
        </div>

    )
}

export default Card;