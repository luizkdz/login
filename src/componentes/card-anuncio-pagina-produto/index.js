import './styles.css';


function CardAnuncioPaginaProduto({titulo,descricao,link,imagem,logo}){
    return (
        <div className="card-anuncio-pagina-produto">
                    <img src={logo} className="anuncio-logo"/>
                    <div className="texto-card-anuncio">
                        <p style={{fontSize:"10px"}}>{titulo}</p>
                        <h2 style={{fontSize:"15px"}}>{descricao}</h2>
                        <p style={{fontSize:"10px"}}>{link}</p>
                    </div>
                    <img src={imagem} className="imagem-anuncio"/>
                </div>
    )
}

export default CardAnuncioPaginaProduto;