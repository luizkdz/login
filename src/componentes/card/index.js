import './styles.css';



function Card({imagem, nome, preco, descricao, onClick}) {
    return (
        <div className="card-produto" onClick={onClick}>
            <img src={imagem} className="imagem-card"></img>
            <p className="nome-produto">{nome}</p>
            <h1 className="preco-produto">R${preco}</h1>
            <h1 className="descricao-produto">{descricao}</h1>
        </div>
    )
}

export default Card;