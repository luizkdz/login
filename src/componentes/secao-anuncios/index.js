import CardAnuncio from '../card-anuncio';
import './styles.css'

const cards = [{titulo:"CASHBACK ELECTROLUX",
    logo:"/images/html-5.png",
    descricao:"RECEBA ATÉ R$ 1200 DE PIX NA CONTA",
    link:"Compre já",
    imagem:"/images/coca-cola-anuncio.jpg"
},
{titulo:"Perfume do Cristiano",
    logo:"/images/js.png",
    descricao:"TECNOLOGIA PARA QUEM VOCÊ AMA",
    link:"Aproveite",
    imagem:"/images/perfume-anuncio.jpg"
}
]


function SecaoAnuncios(){
    return (
        <div className="secao-anuncios">
            <div className="container-anuncios">
                {cards.map((item) => {return (
                    <CardAnuncio titulo={item.titulo} descricao={item.descricao} link={item.link} imagem={item.imagem} logo={item.logo}/>)
                })}
                
            </div>
        </div>
    )
}

export default SecaoAnuncios;