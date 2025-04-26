import CardCarouselPropagandas from '../card-carousel-propagandas';
import './styles.css'
import { useState } from 'react';

const cards = [{titulo:"Entre na sua conta",
    imagem:"/images/tab.png",
    descricao:"Aproveite ofertas para comprar tudo o que quiser",
    link:"Entre na sua conta"
},{titulo:"Meios de pagam....",
    imagem:"/images/wallet.png",
    descricao:"Pague suas compras com rapidez e segurança",
    link:"Mostrar meios"
},
{titulo:"Menos de R$100",
    imagem:"/images/coins.png",
    descricao:"Confira produtos com preço baixo",
    link:"Mostrar produtos"
},
{titulo:"Mais vendidos",
    imagem:"/images/bag-shopping.png",
    descricao:"Explore os produtos que são tendência",
    link:"Ir para Mais vendidos"
},
{titulo:"Compra garantida",
    imagem:"/images/suitcase.png",
    descricao:"Você pode devolver sua compra grátis",
    link:"Como funciona"
},
{titulo:"Lojas oficiais",
    imagem:"/images/store.png",
    descricao:"Suas marcas preferidas",
    link:"Mostrar lojas"
},
{titulo:"Nossas categorias",
    imagem:"/images/categories.png",
    descricao:"Encontre celulares, roupas, imóveis e muito mais",
    link:"Ir para categorias"
}

];

function SecaoCarouselPropagandas(){

    const [index, setIndex] = useState(0);
    const next = () => {
        
        setIndex((prev) => (prev + 1) % 2);
        
      };
    
      const prev = () => {
            setIndex((prev) => (prev - 1 + 2) % 2);
      };

    return (
        <div className="container-carousel-propagandas">
            <div className="carousel-propagandas-wrapper">
            <button className="seta-esquerda-carousel-propagandas" onClick={prev}>
                    <img src="./images/setinha-esquerda.png" className="setinha-esquerda-banner" />
                </button>
            <div className="carousel-itens">
                <div className="track" style={{ transform: `translateX(calc(-${index * (220)}px))`}}>
                {cards.map((item) => {return (
                    <CardCarouselPropagandas titulo={item.titulo} imagem={item.imagem} descricao={item.descricao} link={item.link} />)
                 })}
                
            </div>
            </div>
            <button className="seta-direita-carousel-propagandas" onClick={next}>
                    <img src="./images/setinha-direita.png" className="setinha-direita-banner" />
                </button>      
            </div>
        </div>
    )
}

export default SecaoCarouselPropagandas;