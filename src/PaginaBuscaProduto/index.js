import { useEffect, useState } from 'react';
import FiltroDropDown from '../componentes/filtro-dropdown';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';
import CardPaginaBuscaProduto from '../componentes/card-pagina-busca-produto';


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
    const produtosPorPagina = 8;
    const[paginaAtual, setPaginaAtual] = useState(1);
    
    const totalPaginas = Math.ceil(ofertas.length/produtosPorPagina);
    const indiceInicial = (paginaAtual - 1) * produtosPorPagina;
    const indiceFinal = indiceInicial + produtosPorPagina;
    const produtosPaginados = ofertas.slice(indiceInicial/indiceFinal);

    const limitePaginasVisiveis = 5;

    const calcularPaginasVisiveis = () => {
        const metade = Math.floor(limitePaginasVisiveis / 2);
        let inicio, fim;
    
        // Se a página atual está no início, mostramos as primeiras páginas
        if (paginaAtual <= metade) {
          inicio = 1;
          fim = Math.min(totalPaginas, limitePaginasVisiveis);
        }
        // Se a página atual está no final, mostramos as últimas páginas
        else if (paginaAtual >= totalPaginas - metade) {
          fim = totalPaginas;
          inicio = Math.max(1, totalPaginas - limitePaginasVisiveis + 1);
        }
        // Caso contrário, mantemos a página atual centralizada
        else {
          inicio = Math.max(1, paginaAtual - metade);
          fim = Math.min(totalPaginas, paginaAtual + metade);
        }
    
        return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
      };
    



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
    
        setInterval(avancar,8000);

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
                    <div className="secao-mostrar-produtos">
                        {produtosPaginados.map((oferta, index) => {
                      return(
                            <CardPaginaBuscaProduto key = {index} oferta={oferta}/>        
                    )
                        })}
                    </div>
                    <div className="secao-paginacao">
                        <div className="container-paginacao">
                            <div className="paginacao">
                            {paginaAtual > 1  && (
        <>
          <button
        onClick={() => {
            if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
                }
                 }} 
    >
         {"<"}

    </button></>
      )}
          
          {paginaAtual >= 5 && (<button onClick={() => setPaginaAtual(1)} style={{ fontWeight: paginaAtual === 1 ? "bold" : "normal" }} disabled={paginaAtual === 1}>
            1
          </button>)}
          {calcularPaginasVisiveis()[0] > 2 && <span>...</span>}
        

      {/* Renderiza os botões das páginas visíveis */}
      {calcularPaginasVisiveis().map((num) => (
        <button
          key={num}
          onClick={() => setPaginaAtual(num)}
          style={{ fontWeight: num === paginaAtual ? "bold" : "normal" }}
        >
          {num}
        </button>
      ))}

      {/* Botão para a última página */}
      {paginaAtual < totalPaginas - 2 && (
        <>
          {calcularPaginasVisiveis().slice(-1)[0] < totalPaginas - 1 && <span>...</span>}
          <button onClick={() => setPaginaAtual(totalPaginas)} style={{ fontWeight: paginaAtual === totalPaginas ? "bold" : "normal" }}>
            {totalPaginas}
          </button>
        </>
      )}

      {/* Botão Próximo */}
      {paginaAtual < 10 && (<button
        onClick={() => setPaginaAtual((prev) => Math.min(totalPaginas, prev + 1))}
        disabled={paginaAtual === totalPaginas}
      >
        {">"}
      </button>)}
 </div>
                        </div>
                    </div>
                    </div>

            </div>
            </div>
            <Footer />
        </div>
    );
}

export default PaginaBuscaProduto;