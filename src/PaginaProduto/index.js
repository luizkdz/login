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
            setImagemSelecionada(resposta.data.produto.imagem)
        }
        catch(err){
            console.log("Erro ao buscar produto");
        }
    }
    useEffect(() => {
        buscarProduto();
    },[])

    return (
        <div>
            <Header props/>
            <div className="secao-pagina-produto">
            <div className="container-produto">
            {produto ? (
                <>
                <div className="titulo-produto-pagina-produto">
                    <h1>{produto.nome}</h1>
                    </div>
                    <div className="container-frete">
                    <div className="container-imagens">
                    <div className="container-imagem-card-produto">
                    <img className="imagem-card-pagina-produto"src={produto.imagem} alt={produto.nome} onMouseOver={() => setImagemSelecionada(produto.imagem)}/>
                    <img className="imagem-card-pagina-produto"src={produto.imagem} alt={produto.nome} onMouseOver={() => setImagemSelecionada(produto.imagem)}/>
                    <img className="imagem-card-pagina-produto"src={produto.imagem} alt={produto.nome} onMouseOver={() => setImagemSelecionada(produto.imagem)}/>
                    <img className="imagem-card-pagina-produto"src={produto.imagem} alt={produto.nome} onMouseOver={() => setImagemSelecionada(produto.imagem)}/>
                    <img className="imagem-card-pagina-produto"src={produto.imagem} alt={produto.nome} onMouseOver={() => setImagemSelecionada(produto.imagem)}/>
                    
                    </div>
                    <div className="container-imagem-pagina-produto">
                    <img className="imagem-pagina-produto" src={imagemSelecionada} alt={produto.nome} />
                    </div>
                    <div className="container-preco-avaliacao">
                        <p>*********** 4.8 (3199) <a href="#">Avaliar Produto</a></p>
                        <p>Cor: preta</p>
                        <img className="imagem-container-preco" src={produto.imagem}></img>
                        <p>Vendido e entregue por </p>
                        <p>Nossa loja garante sua compra <a href="#">Saiba mais</a></p>
                        <p>{produto.preco}</p>
                        <p>{produto.preco}</p>
                        <p>ou {produto.preco} no Pix</p>
                        <div className="container-cartao">
                            <div className="secao-container-cartao">
                            <a href="#">Cartão de crédito</a>

                            <p>Sem juros</p>
                            </div>
                            <div className="preco-container-cartao">
                            <p>{produto.preco}</p>
                            <p>6x de {produto.preco}</p>                           
                            </div>
                        </div>
                        <div className="container-botoes">
                        <button className="botao-comprar-agora"><img src="/images/shopping-bag.png" className="imagem-bolsa"/>Comprar agora</button>
                        <button className="botao-adicionar-carrinho"><img src="/images/carrinho-de-compras.png" className="imagem-carrinho-botao"/>Adicionar ao carrinho</button>
                        <div className="card-cep">
                            <div className="container-imagem-cep">
                            <img src= "/images/localizacao.png" className="icone-localizacao-card-cep"/>
                            <p>30710-550</p>
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
                        <p>Receba em até 8 dias úteis</p>
                        <p>Após pagamento confirmado</p>
                        <p className="texto-prazo">Os prazos de entrega são contabilizados a partir da confirmação do pagamento e podem sofrer variações caso haja a compra de mais de uma unidade do mesmo produto.</p>
                        </div>
                        </div>
                        <p className="preco-frete">R$ 15,00</p> 
                                            
                        </div>
                        
                        </div>
                        <div className="container-informacoes-loja">
                            
                        </div>
                    </div>
                    
                    <div className="container-informacoes-produto">
                    <div className="secao-informacoes-produto">
                    <h1>Informações do produto</h1>
                    <div className="card-vendedor">
                        <h1>Informações do vendedor</h1>
                        <div className="imagem-nome-data-vendedor">
                        <img src="/images/shop.png" className="imagem-loja" alt="imagem-lojas"/>
                        <div className="nome-data-vendedor">
                        <p>Nome do vendedor</p>
                        <p>Vendedor cadastrado desde 2019</p>
                        </div>
                        
                        </div>
                        <img src="/images/barra-amarela.png" className="imagem-grafico" alt="imagem-grafico"/>
                        <div className="icones-avaliacoes-vendedor">
                            <div className="caixa-texto-icones">
                                <img src="/images/shopping-bag-preta.png" className="icone-avaliacao"/>
                                <p><strong>+200</strong></p>
                                <p className="fonte-produtos-vendidos">Produtos vendidos</p>
                            </div>
                            <div className="caixa-texto-icones">
                                <img src="/images/caminhao-entrega.png" className="icone-avaliacao"/>
                                <p><strong>Entrega</strong></p>
                                <p className="fonte-produtos-vendidos">Entrega pontual</p>
                            </div>
                            <div className="caixa-texto-icones">
                                <img src="/images/chat.png" className="icone-avaliacao"/>
                                <p><strong>Atendimento</strong></p>
                                <p className="fonte-produtos-vendidos">Responde rápido</p>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="informacoes-produto">
                    
                    <p>{produto.descricao}</p>
                    
                    <div className="ver-todas-avaliacoes">
                    <a className="link-todas-avaliacoes" href="#">Ver todas as avaliações<img src="/images/right-arrow.png" className="icone-seta-avaliacoes"/></a>
                    </div>
                    <h1>Avaliação dos clientes</h1>
                    <div className="container-avaliacao-clientes">
                        <div className="container-classificacao">
                        <div className="container-avaliacao-comentarios">
                        <div className="card-nota-imagem">
                        <h1>4.5</h1>
                        <img src="/images/estrela.png" className="estrela-avaliacao-grande"/>
                        
                        </div>
                        <div className="total-avaliacoes">
                        <p>Total avaliações</p>
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
                            <p>Total Comentários</p>
                            </div>
                            <h3>Avaliações com fotos</h3>
                            <div className="nome-foto">
                            <img src="/images/foto-usuario.png" className="foto-usuario-comentarios"/>
                            <h3>Ana</h3>
                            <img src="/images/cinco-estrelas.png" className="foto-5-estrelas"/>
                            </div>
                            <p>Estou simplesmente apaixonado por essa cafeteira! Ela é prática, fácil de usar e prepara um café delicioso em poucos minutos. O sistema corta-pingo é super útil, e a placa aquecedora mantém o café quente por bastante tempo sem alterar o sabor. Além disso, o design é moderno e combina perfeitamente com minha cozinha. Sem dúvidas, foi uma excelente compra! ☕✨</p>
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