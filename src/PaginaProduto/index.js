import { useParams } from 'react-router-dom';
import './styles.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Header from '../componentes/header';
import Footer from '../componentes/footer';
function PaginaProduto(){
    const { id} = useParams();
    const [produto,setProduto] = useState(null);
    const [imagemSelecionada, setImagemSelecionada] = useState("");
    const buscarProduto = async () => {
        try{
            const resposta = await axios.get(`http://localhost:5000/produto/${id}`);
            setProduto(resposta.data.produto);
            setImagemSelecionada(resposta.data.produto.imagens[0]);
        }
        catch(err){
            console.log("Erro ao buscar produto");
        }
    }
    useEffect(() => {
        buscarProduto();
    },[])

    const calcularEstrelas = (avaliacao) => {
        const totalEstrelas = 5;
        const inteira = Math.floor(avaliacao);
        const temMeia = avaliacao % 1 !== 0;
        const estrelas = [];
    
        for (let i = 0; i < inteira; i++) {
            estrelas.push(<img key={i} src="/images/estrelacheia.png" className="estrela-avaliacao" alt="⭐" />);
        }
        if (temMeia) {
            estrelas.push(<img key="meia" src="/images/meiaestrela.png" className="estrela-avaliacao" alt="⭐½" />);
        }
        while (estrelas.length < totalEstrelas) {
            estrelas.push(<img key={estrelas.length} src="/images/estrelavazia.png" className="estrela-avaliacao" alt="☆" />);
        }
        return estrelas;
    };
    
    const valoresFrete = {
        "Belo Horizonte": 15.00,
        "São Paulo": 20.00,
        "Rio de Janeiro": 18.50,
        "Curitiba": 22.00,
        "Porto Alegre": 25.00,
        "Salvador": 19.50,
        "Recife": 21.00,
        "Fortaleza": 23.50,
        "Brasília": 17.00,
        "Manaus": 30.00
    };
    
    const calcularDesconto = (desconto) => {
        const descontoNumber = Number(desconto);
        return descontoNumber ? `(${descontoNumber}% de desconto no pix)` : "";
    }

    const calcularPrecoParcelado = (preco, parcelas) => {
        
        return (preco / parcelas).toFixed(2);
    };

    const calcularFretePorCep = async (cep) => {
       try{

        
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
        const localidade = response.data.localidade;

        const valorFrete = valoresFrete[localidade] || 25.00;
    
        return {
            localidade,
            valorFrete
        }
    }

    catch(err){
        console.log("Erro ao buscar cep",err);
        return {localidade: "Desconhecida" , valorFrete: 25.00}
    }
    }

    return (
        <div>
            <Header props/>
            <div className="secao-pagina-produto">
            <div className="container-produto">
            {produto ? (
                <>
                <div className="titulo-produto-pagina-produto">
                    <h1>{produto.produto_nome.length > 255 ? produto.produto_nome.slice(0,252) + '...' : produto.produto_nome}</h1>
                    </div>
                    <div className="container-frete">
                    <div className="container-imagens">
                    <div className="container-imagem-card-produto">
                    <img className="imagem-card-pagina-produto"src={produto.imagens[0]} alt={produto.nome} onMouseOver={() => setImagemSelecionada(produto.imagens[0])}/>
                    <img className="imagem-card-pagina-produto"src={produto.imagens[1]} alt={produto.nome} onMouseOver={() => setImagemSelecionada(produto.imagens[1])}/>
                    <img className="imagem-card-pagina-produto"src={produto.imagens[2]} alt={produto.nome} onMouseOver={() => setImagemSelecionada(produto.imagens[2])}/>
                    <img className="imagem-card-pagina-produto"src={produto.imagens[3]} alt={produto.nome} onMouseOver={() => setImagemSelecionada(produto.imagens[3])}/>
                    <img className="imagem-card-pagina-produto"src={produto.imagens[4]} alt={produto.nome} onMouseOver={() => setImagemSelecionada(produto.imagens[4])}/>
                    
                    </div>
                    <div className="container-imagem-pagina-produto">
                    <img className="imagem-pagina-produto" src={imagemSelecionada} alt={produto.nome} />
                    </div>
                    <div className="container-preco-avaliacao">
                        <p>{calcularEstrelas(produto.mediaAvaliacoes)} {produto.mediaAvaliacoes} ({produto.totalAvaliacoes}) <a href="#">Avaliar Produto</a></p>
                        <p>{produto.variacoes[0].nome}:{produto.variacoes[0].valor}</p>
                        <img className="imagem-container-preco" src={produto.imagens[0]}></img>
                        <p>Vendido e entregue por </p>
                        <p>Nossa loja garante sua compra <a href="#">Saiba mais</a></p>
                        <p>{produto.produto_preco}</p>
                        <p>{produto.produto_parcelas_máximas}x de {calcularPrecoParcelado(produto.produto_preco_parcelado,produto.produto_parcelas_máximas)}</p>
                        <p>ou <strong>{produto.produto_preco_pix}</strong> no Pix</p>
                        <div className="container-cartao">
                            <div className="secao-container-cartao">
                            <a href="#">Cartão de crédito</a>

                            <p>{produto.produto_juros_cartao} Sem juros</p>
                            </div>
                            <div className="preco-container-cartao">
                            <p>{produto.preco}</p>
                            <p>{produto.produto_parcelas_máximas}x de {calcularPrecoParcelado(produto.produto_preco_parcelado,produto.produto_parcelas_máximas)}</p>                           
                            </div>
                        </div>
                        <div className="container-botoes">
                        <button className="botao-comprar-agora"><img src="/images/shopping-bag.png" className="imagem-bolsa"/>Comprar agora</button>
                        <button className="botao-adicionar-carrinho"><img src="/images/carrinho-de-compras.png" className="imagem-carrinho-botao"/>Adicionar ao carrinho</button>
                        <div className="card-cep">
                            <div className="container-imagem-cep">
                            <img src= "/images/localizacao.png" className="icone-localizacao-card-cep"/>
                            <p>Insira seu cep</p>
                            </div>
                            <a href="#">alterar</a>
                        </div>
                        
                        </div>
                    </div>
                    
                    </div>
                    <div className="container-card-frete">
                        <div className="empty"></div>
                    <div className="card-frete">
                        <div className="container-imagem-texto">
                        <img src="/images/caminhao.png" className="imagem-caminhao-frete"/>
                        <div className="texto-frete">
                        <p>Receba em até {produto.frete[0].prazo} dias úteis</p>
                        <p>Após pagamento confirmado</p>
                        <p className="texto-prazo">Os prazos de entrega são contabilizados a partir da confirmação do pagamento e podem sofrer variações caso haja a compra de mais de uma unidade do mesmo produto.</p>
                        </div>
                        </div>
                        <p className="preco-frete">R$ {produto.frete[0].valor}</p> 
                                            
                        </div>
                        
                        </div>
                        <div className="container-informacoes-loja">
                            
                        </div>
                    </div>
                    
                    <div className="container-informacoes-produto">
                    <div className="secao-informacoes-produto">
                    <div className="card-informacoes-produto">
                    <h1>Informações do produto</h1>
                    <p>{produto.produto_descricao}</p>
                    </div>
                    <div className="card-vendedor">
                        <h1>Informações do vendedor</h1>
                        <div className="imagem-nome-data-vendedor">
                        <img src="/images/shop.png" className="imagem-loja" alt="imagem-lojas"/>
                        <div className="nome-data-vendedor">
                        <p>Vendedor: {produto.vendedores[0].nome}</p>
                        <p>Cadastrado desde {produto.vendedores[0].cliente_desde}</p>
                        </div>
                        
                        </div>
                        <img src="/images/barra-amarela.png" className="imagem-grafico" alt="imagem-grafico"/>
                        <div className="icones-avaliacoes-vendedor">
                            <div className="caixa-texto-icones">
                                <img src="/images/shopping-bag-preta.png" className="icone-avaliacao"/>
                                <p><strong>{produto.vendedores[0].total_vendidos}</strong></p>
                                <p className="fonte-produtos-vendidos">Produtos vendidos</p>
                            </div>
                            <div className="caixa-texto-icones">
                                <img src="/images/caminhao-entrega.png" className="icone-avaliacao"/>
                                <p><strong>{produto.vendedores[0].nota_entrega}</strong></p>
                                <p className="fonte-produtos-vendidos">Entrega</p>
                            </div>
                            <div className="caixa-texto-icones">
                                <img src="/images/chat.png" className="icone-avaliacao"/>
                                <p><strong>{produto.vendedores[0].nota_atendimento}</strong></p>
                                <p className="fonte-produtos-vendidos">Atendimento</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="informacoes-produto">
                    
                    
                    
                    <div className="ver-todas-avaliacoes">
                    <a className="link-todas-avaliacoes" href="#">Ver todas as avaliações<img src="/images/right-arrow.png" className="icone-seta-avaliacoes"/></a>
                    </div>
                    <h1>Avaliação dos clientes</h1>
                    <div className="container-avaliacao-clientes">
                        <div className="container-classificacao">
                        <div className="container-avaliacao-comentarios">
                        <div className="card-nota-imagem">
                        <h1>{produto.totalAvaliacoes}</h1>
                        <img src="/images/estrela.png" className="estrela-avaliacao-grande"/>
                        
                        </div>
                        <div className="total-avaliacoes">
                        <p>{produto.totalAvaliacoes} {produto.totalAvaliacoes === 1 ? "avaliação" : "avaliações"}</p>
                        </div>

                        </div>
                        
                       <h3>Classificação</h3>
                       <div className="card-classificacao">
                        <div className="nota-imagem-classificacao">
                        <p><strong>5</strong></p><img src="/images/estrela.png" className="estrela-classificacao"/>
                        <img src="/images/barra-classificacao.png" className="barra-classificacao"/><p>85</p>
                        </div>
                        <div className="nota-imagem-classificacao">
                        <p><strong>4</strong></p><img src="/images/estrela.png" className="estrela-classificacao"/>
                        <img src="/images/barra-classificacao.png" className="barra-classificacao"/><p>85</p>
                        </div>
                        <div className="nota-imagem-classificacao">
                        <p><strong>3</strong></p><img src="/images/estrela.png" className="estrela-classificacao"/>
                        <img src="/images/barra-classificacao.png" className="barra-classificacao"/><p>85</p>
                        </div>
                        <div className="nota-imagem-classificacao">
                        <p><strong>2</strong></p><img src="/images/estrela.png" className="estrela-classificacao"/>
                        <img src="/images/barra-classificacao.png" className="barra-classificacao"/><p>85</p>
                        </div>
                        <div className="nota-imagem-classificacao">
                        <p><strong>1</strong></p><img src="/images/estrela.png" className="estrela-classificacao"/>
                        <img src="/images/barra-classificacao.png" className="barra-classificacao"/><p>85</p>
                        </div>

                        </div>
                        </div>
                        
                        <div className="card-comentarios">
                            <div className="total-comentarios">
                            <p>{produto.totalComentarios} {produto.totalComentarios === 1 ? "Comentário" : "Comentários"} </p>
                            </div>
                            <h3>Avaliações com fotos</h3>
                            {produto.usuariosComentarios.map((usuario, index) => (
                            <div className="usuario-nota-comentario">
                            <div className="nome-foto" key={index}>
                            <img src={usuario.foto_url} className="foto-usuario-comentarios" alt="Foto do usuário"/>
                            <h3>{usuario.nome}</h3>
                            <p>{calcularEstrelas(usuario.nota)}</p>
                            </div>

                            <p>{usuario.comentario}</p>

                            <p className="paragrafo-data-comentario">{usuario.dataFormatada}</p>
                            </div>))}
                            <button className="botao-ver-avaliacoes">Ver todas avaliacoes</button>
                        </div>
                        
                    </div>
                    </div>
                    </div>
                </>
            ) : (
                <p>Carregando...</p>
            )}
            </div>
            </div>
            <Footer/>
        </div>
    );  
}

export default PaginaProduto;