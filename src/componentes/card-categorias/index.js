import './styles.css';
const categorias = [
    { nome: "Ofertas imperdíveis", imagem: "./images/imagem-ofertas.jpg" },
    { nome: "Acessórios para casa", imagem: "./images/imagem-acessorios-casa.jpg" },
    { nome: "Ferramentas", imagem: "./images/imagem-ferramentas.jpg" },
    { nome: "Jogos", imagem: "./images/imagem-jogos.png" },
    { nome: "Brinquedos", imagem: "./images/imagem-brinquedos.jpg" },
    { nome: "Eletrônicos", imagem: "./images/imagem-eletronicos.png" },
    { nome: "Livros", imagem: "./images/imagem-livros.png" },
    { nome: "Saúde", imagem: "./images/imagem-saude.png" }
];

function CardCategorias() {
    return (
        
        <div className="card-categorias">
            <div className="titulo-categorias">
            <h1 className="titulo-card-categorias">O que você procura?</h1></div>
            <div class="secao-categoria">
            <div className="categorias-container">
                {categorias.map((categoria, index) => {
            return (
                    <div key={index} className="categoria-item">
                        <img src={categoria.imagem} className="imagem-item"/>
                        <p className="paragrafo-item">{categoria.nome}</p>
                    </div>
                )
                })}
                </div>
                </div>
                <h1></h1>

    </div>
    )
}

export default CardCategorias;