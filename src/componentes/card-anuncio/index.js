import './styles.css';


function CardAnuncio({titulo,descricao,link,imagem,logo}){
    return (
        <div className="card-anuncio">
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

export default CardAnuncio;