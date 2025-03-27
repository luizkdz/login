import { useState } from 'react';
import FiltroDropDown from '../componentes/filtro-dropdown';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';


const filtros = [
    { titulo: 'Categoria', itens: ['Elétrica', 'Manual', 'Pneumática', 'Acessórios', 'Compressor'], isCheckBox: false },
    { titulo: 'Marcas', itens: ['Apple', 'Arcomprimido Brasil', 'Atena', 'Bellator', 'BELZER'], isCheckBox: true },
    { titulo: 'Preço', itens: ['Até R$50', 'R$50 - R$100', 'R$100 - R$500', 'Acima de R$500'], isCheckBox: false },
    { titulo: 'Promoções', itens: ['Ofertas do dia', 'Ofertas relâmpago'], isCheckBox: true },
    { titulo: 'Entrega', itens: ['Frete Grátis', 'Retire Grátis', 'Entrega Rápida', 'Full'], isCheckBox: true },
    { titulo: 'Avaliação', itens: ['5 estrelas', '4 estrelas e acima', '3 estrelas e acima', '2 estrelas e acima', '1 estrela e acima'], isCheckBox: true },
    { titulo: 'Vendido por', itens: ['Loja 1', 'Loja 2', 'Loja 3'], isCheckBox: true },
    { titulo: 'Tipo de Compra', itens: ['Compra nacional', 'Compra internacional'], isCheckBox: true },
    { titulo: 'Tipo de Produto', itens: ['Alicate', 'Chave de fenda', 'Martelo', 'Furadeira'], isCheckBox: true },
];

const ofertas = [
    {
        nome: "Notebook Arius 4124",
        imagem: "./images/prato1.jpeg",
        preco: "R$ 3.500,00",
        precoParcelado: "12x de R$ 350,00",
        precoPix: "R$ 3.200,00"
    },
    {
        nome: "Smartphone Zeta X10",
        imagem: "./images/prato2.jpeg",
        preco: "R$ 2.000,00",
        precoParcelado: "10x de R$ 200,00",
        precoPix: "R$ 1.850,00"
    },
    {
        nome: "Fone de Ouvido BassPro",
        imagem: "./images/prato3.jpeg",
        preco: "R$ 250,00",
        precoParcelado: "5x de R$ 50,00",
        precoPix: "R$ 220,00"
    },
    {
        nome: "Smart TV 55' Ultra HD",
        imagem: "./images/imagem-jogos.png",
        preco: "R$ 4.500,00",
        precoParcelado: "10x de R$ 450,00",
        precoPix: "R$ 4.100,00"
    },{
        nome: "Notebook Arius 4124",
        imagem: "./images/prato1.jpeg",
        preco: "R$ 3.500,00",
        precoParcelado: "12x de R$ 350,00",
        precoPix: "R$ 3.200,00"
    },
    {
        nome: "Smartphone Zeta X10",
        imagem: "./images/prato2.jpeg",
        preco: "R$ 2.000,00",
        precoParcelado: "10x de R$ 200,00",
        precoPix: "R$ 1.850,00"
    },
    {
        nome: "Fone de Ouvido BassPro",
        imagem: "./images/prato3.jpeg",
        preco: "R$ 250,00",
        precoParcelado: "5x de R$ 50,00",
        precoPix: "R$ 220,00"
    },
    {
        nome: "Smart TV 55' Ultra HD",
        imagem: "./images/imagem-jogos.png",
        preco: "R$ 4.500,00",
        precoParcelado: "10x de R$ 450,00",
        precoPix: "R$ 4.100,00"
    }
];

function PaginaBuscaProduto() {

    const [indice,setIndice] = useState(0);
    
        const itensVisiveis = 2;
    
        const avancar = () => {
            if(indice + itensVisiveis < ofertas.length){
                setIndice(indice+2);    
            }
            else{
                setIndice(0);
            }
        };
    
        const voltar = () => {
            if(indice > 0){
                setIndice(indice - 2);
            }
            else{
                setIndice(ofertas.length - itensVisiveis)
            }
        }

    return (
        <div className="pagina-toda-busca-produto">
            <Header props/>
            <div className="secao-ferramentas">
            <div className="secao-busca-produto">
                <h1>Ferramentas</h1>
                {filtros.map(({ titulo, itens, isCheckBox }) => (
                    <FiltroDropDown key={titulo} titulo={titulo} itens={itens} isCheckBox={isCheckBox} />
                ))}
            </div>
            <div className="secao-categoria-produtos">
                <div className="titulo-categoria-produtos">
            <h1>Os mais vendidos da categoria</h1>
            <div className="container-botao-carousel">
            <div className="container-card-produtos">
            <button className="botao-voltar" onClick={voltar}><img src="/images/setinha-esquerda.png" className="imagem-setinha-esquerda"/></button>
                <div className="imagem-texto-card" key={indice} >
                   {ofertas.slice(indice, indice + 2).map((oferta,index) => {
                    return (
                    <div className="card-produto-busca-produto fade-in" key={index}>
                        <img src={oferta.imagem} className="imagem-secao-card-produtos"/>
                            <div className="container-texto-card-produto">
                                <p className="oferta-nome">{oferta.nome}</p>
                                <p>{oferta.preco}</p>
                                <p>{oferta.precoParcelado}</p>
                                <p><strong>{oferta.precoPix}</strong> no Pix</p>
                        </div>
                        </div>
                    )
                   })} 
                    

                </div>
                <button className="botao-avancar" onClick={avancar}><img src="/images/setinha-direita.png" className="imagem-setinha-direita"/></button>
                </div>
            </div>
            </div>
                <div className="secao-exibicao-produtos">
                    <div className="container-titulo-exibicao-produtos">
                        <p> + de 10.000 produtos encontrados</p>
                        <p>Ordenar por
                        
                        <select id="options" className="select">
                            <option value="Nome">Relevância</option>
                            <option value="Data">Mais vendidos</option>
                            <option value="Preço">Mais bem avaliados</option>
                            <option value="Preço">Lançamento</option>
                            <option value="Preço">Menor preço</option>
                            <option value="Preço">Maior preco</option>
                        </select>
                        </p>
                    </div>
                    </div>

            </div>
            </div>
            <Footer />
        </div>
    );
}

export default PaginaBuscaProduto;