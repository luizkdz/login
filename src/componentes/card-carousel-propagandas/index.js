import './styles.css';

function CardCarouselPropagandas({titulo,imagem, descricao, link }){
    return(
        <div className="carousel-card-propagandas">
                    <p>{titulo}</p>
                    <img src={imagem} className="imagem-carousel-card-propaganda"/>
                    <div className="container-descricao-card-propagandas">
                    <p>{descricao}</p>
                    </div>
                    <button className="botao-card-carousel-propagandas"><a style={{textDecoration:"none"}}href="#">{link}</a></button>
                </div>
    )
}

export default CardCarouselPropagandas;