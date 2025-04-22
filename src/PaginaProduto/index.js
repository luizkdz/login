import { useParams } from 'react-router-dom';
import './styles.css';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Header from '../componentes/header';
import Footer from '../componentes/footer';
import { calcularPrecoParcelado } from '../utils/calcularPrecoParcelado';
import { calcularFretePorCep } from '../utils/calcularFretePorCep';
import { useCep } from '../context/CepContext';
import ModalCep from '../componentes/modalCep/ModalCep';
import { useCarrinho } from '../context/carrinhoContext';
import ModalCarrinho from '../componentes/modalCarrinho/index.js';

function PaginaProduto(){
    const {id} = useParams();
    const [produto,setProduto] = useState(null);
    const [imagemSelecionada, setImagemSelecionada] = useState("");
    const [localidade, setLocalidade] = useState("Insira seu cep");
    let [valorFrete, setValorFrete] = useState(null);
    const [prazo, setPrazo] = useState(null);
    const {cep} = useCep();
    const [mostrarModalCep, setMostrarModalCep] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalCarrinho, setModalCarrinho] = useState(false);
    const [modalUnidades,setModalUnidades] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);
    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const [valorQuantidade, setValorQuantidade] = useState("mais");
    const [corSelecionada, setCorSelecionada] = useState(null);
    const [materialSelecionado, setMaterialSelecionado] = useState(null);
    const [voltagemSelecionada, setVoltagemSelecionada] = useState(null);
    const [generoSelecionado, setGeneroSelecionado] = useState(null);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
    const [estampaSelecionada, setEstampaSelecionada] = useState(null);
    const [pesoSelecionado, setPesoSelecionado] = useState(null);
    const [dimensoesSelecionada, setDimensoesSelecionada] = useState(null);

    const atributos = [
        { chave: 'cor', nome: 'Cor' },
        { chave: 'voltagem', nome: 'Voltagem' },
        { chave: 'dimensao', nome: 'Dimensões' },
        { chave: 'peso', nome: 'Pesos' },
        { chave: 'genero', nome: 'Gênero' },
        { chave: 'estampa', nome: 'Estampas' },
        { chave: 'tamanho', nome: 'Tamanhos' },
        { chave: 'material', nome: 'Materiais' },
      ];

      const [selecoes, setSelecoes] = useState({
        cor: null,
        voltagem: null,
        dimensao: null,
        peso: null,
        genero: null,
        estampa: null,
        tamanho: null,
        material: null,
      });

      const [hover, setHover] = useState({
        cor: null,
        voltagem: null,
        dimensao: null,
        peso: null,
        genero: null,
        estampa: null,
        tamanho: null,
        material: null,
      });
    
      const handleSelecao = (atributo, valor) => {
        setSelecoes((prevSelecoes) => ({
          ...prevSelecoes,
          [atributo]: valor,
        }));
      };
      const handleHover = (atributo, valor) => {
        setHover((prevHover) => ({
          ...prevHover,
          [atributo]: valor,
        }));
      };
    
    const {obterCarrinho, editarQuantidadeItemCarrinho, excluirItemCarrinho, carrinhoItens,setCarrinhoItens, adicionarAoCarrinho} = useCarrinho();

    const selecionarQuantidade = (quantidade) => {
        setQuantidadeSelecionada(Number(quantidade));
        setMostrarOpcoes(false);
    }

    
    
    const abrirModalCep = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setMostrarModalCep(true);
        },1000);
        
    };

    const abrirModalUnidadesProduto = () => {
        setModalUnidades(true);
    }
    const fecharModalUnidadesProduto = () => {
        setModalUnidades(false);
    };
    const fecharModalCep = () => {
        
        setMostrarModalCep(false);
    };
    useEffect(() => {
        const buscarProduto = async () => {
          try {
            const resposta = await axios.get(`http://localhost:5000/produto/${id}`);
            const produtoBuscado = resposta.data.produto;
            setProduto(produtoBuscado);
            setImagemSelecionada(produtoBuscado.imagens[0]);
            setCorSelecionada(produtoBuscado.cor?.[0].valor);
            setMaterialSelecionado(produtoBuscado?.materiais?.[0].id);
            setVoltagemSelecionada(produtoBuscado?.voltagem?.[0].id);
            setGeneroSelecionado(produtoBuscado?.genero?.[0].id);
            setTamanhoSelecionado(produtoBuscado?.tamanho?.[0].id);
            setEstampaSelecionada(produtoBuscado?.estampa?.[0].id);
            setPesoSelecionado(produtoBuscado?.peso?.[0].id);
            setDimensoesSelecionada(produtoBuscado?.dimensoes?.[0].id);
          } catch (err) {
            console.error("Erro ao buscar produto", err);
          }
        };
      
        buscarProduto();
      }, [id]);
      
      useEffect(() => {
        if (produto && cep && cep.length === 8) {
          calcularFretePorCep(
            produto.produto_id,
            cep,
            setLocalidade,
            setValorFrete,
            setPrazo
          );
        }
      }, [produto, cep]);


    const abrirModalCarrinho = () => {
        document.body.classList.add("modal-aberto");
        setModalCarrinho(true);
    }
    const fecharModalCarrinho = () => {
        document.body.classList.remove("modal-aberto");
        setModalCarrinho(false);
    }
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

    return (
        <div>
            <Header props produto={produto}/>
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
                    {produto.imagens?.slice(0,5).map((imagem, index) => (
        <img key={index} className="imagem-card-pagina-produto"src={imagem}  alt={produto.nome} onMouseOver={() => setImagemSelecionada(imagem)}/>
))}
                    
                    </div>
                    
                    <div className="container-imagem-pagina-produto">
                    <img className="imagem-pagina-produto" src={imagemSelecionada} alt={produto.nome} />
                    </div>
                    <div className="container-preco-avaliacao">
                        <p>{calcularEstrelas(produto.mediaAvaliacoes)} {produto.mediaAvaliacoes} ({produto.totalAvaliacoes}) <a href="#">Avaliar Produto</a></p>
                        
                        <img className="imagem-container-preco" src={produto.imagens[0]}></img>
                        
                        <p>Vendido e entregue por <a style={{ color: "black" }} href="#">{produto.vendedores[0].nome}</a></p>
                        <p>Nossa loja garante sua compra <a href="#">Saiba mais</a></p>
                        <p>R$ {produto.produto_preco}</p>
                        <p>{produto.produto_parcelas_máximas}x de R${calcularPrecoParcelado(produto.produto_preco_parcelado,produto.produto_parcelas_máximas)}</p>
                        <p>ou R$<strong className="paragrafo-preco-produto">{produto.produto_preco_pix}</strong> no Pix</p>
                        <div className="container-cartao">
                            <div className="secao-container-cartao">
                            <a href="#">Cartão de crédito</a>

                            <p>{produto.produto_juros_cartao} Sem juros</p>
                            </div>
                            <div className="preco-container-cartao">
                            <p>{produto.preco}</p>
                            <p>{produto.produto_parcelas_máximas}x de R${calcularPrecoParcelado(produto.produto_preco_parcelado,produto.produto_parcelas_máximas)}</p>                           
                            </div>
                        </div>
                            <div className="container-card-cor">
                            <div className="card-variacao">
                            {Object.entries(produto).map(([nome, opcoes]) => {
                                const atributosSuportados = [
                                    "cor",
                                    "voltagem",
                                    "generos",
                                    "tamanho",
                                    "materiais",
                                    "estampas",
                                    "pesos",
                                    "dimensoes",
                                ];


                                
                                if (atributosSuportados.includes(nome) && Array.isArray(opcoes) && opcoes.length > 0) {
                                    const exibirHover = hover[nome] || selecoes[nome] || opcoes[0].valor
                                    return (
                                    <div className="card-variacao" key={nome}>
                                        {nome.charAt(0).toUpperCase() + nome.slice(1)}: {exibirHover}
                                        <div className={`container-card-${nome}`}>
                                        {opcoes?.map((item) => {
                                            return (
                                            <div
                                                key={item.id}
                                                onClick={() => {
                                                
                                                // Atualiza a seleção de atributos
                                                ;setSelecoes((prevSelecoes) => ({
                                                    ...prevSelecoes,
                                                    [nome]: item.valor,
                                                }));
                                                if(nome === "cor")
                                                setCorSelecionada(item.id);
                                                if(nome === "materiais")
                                                setMaterialSelecionado(item.id);
                                                if(nome === "voltagem")
                                                setVoltagemSelecionada(item.id);
                                                if(nome === "generos")
                                                setGeneroSelecionado(item.id);
                                                if(nome === "tamanho")
                                                setTamanhoSelecionado(item.id);
                                                if(nome === "estampas")
                                                setEstampaSelecionada(item.id);
                                                if(nome === "pesos")
                                                setPesoSelecionado(item.id);
                                                if(nome === "dimensoes")
                                                setDimensoesSelecionada(item.id);
                                                // Log da seleção
                                                console.log(`${nome} id é`, item.id);
                                                }}
                                                onMouseEnter={() => handleHover(nome,item.valor)}
                                                onMouseLeave={() => handleHover(nome,null)}
                                                className="card-valor-cor"
                                            >
                                                <p>{item.valor}</p>
                                            </div>
                                            );
                                        })}
                                        </div>
                                    </div>
                                    );
                                }
                                })}
                            </div>
                            </div>
                        <div className="container-selecao-unidades">
                        <div className="container-quantidade-foto-dropdown">
                        <p style ={{cursor:"pointer"}} onClick={() => setMostrarOpcoes(!mostrarOpcoes)}>Quantidade: {quantidadeSelecionada !== "mais" ? `${quantidadeSelecionada} unidade${quantidadeSelecionada !== "1" ? "s" : ""}` : "Selecione a quantidade" }</p><img src={mostrarOpcoes ? "/images/setinha-cima-dropdown-preta.png" : "/images/setinha-dropdown-preta.png"} className="imagem-botao-dropdown-quantidade"/>
                        </div>
                            {mostrarOpcoes && (
                            <div className="selecao-unidades">
                            <p onClick={() => selecionarQuantidade(1)}>1 unidade</p>
                            <p onClick={() => selecionarQuantidade(2)}>2 unidades</p>
                            <p onClick={() => selecionarQuantidade(3)}>3 unidades</p>
                            <p onClick={() => selecionarQuantidade(4)}>4 unidades</p>
                            <p onClick={() => selecionarQuantidade(5)}>5 unidades</p>
                            <p onClick={() => selecionarQuantidade(6)}>6 unidades</p>
                            <p on onMouseLeave = {() => setModalUnidades(false)}onClick={() => {selecionarQuantidade("mais");setMostrarOpcoes(true);setModalUnidades(true)}}>{modalUnidades ? <div>
                               <p>Quantidade:</p>
                               <form onSubmit={(e) => {e.preventDefault(); selecionarQuantidade(valorQuantidade)}}>
                               <input type='number' className="input-valorQuantidade" style={{padding:"13px 12px"}} value = {valorQuantidade === "mais" ? "" :valorQuantidade} onChange={(e) => setValorQuantidade(e.target.value)} />
                               <button disabled={valorQuantidade === "mais" || valorQuantidade === ""} className="botao-valor-quantidade" type="submit">Aplicar</button>
                               </form>
                            </div> : "Mais que 6 unidades"} </p>
            
                            </div>
                        )}
                                            </div>
                            
                        <div className="container-botoes">
                        <button className="botao-comprar-agora"><img src="/images/shopping-bag.png" className="imagem-bolsa"/>Comprar agora</button>
                        <button className="botao-adicionar-carrinho" onClick={() => {console.log(`é`,produto.materiais[0].id);adicionarAoCarrinho(id,quantidadeSelecionada,corSelecionada,voltagemSelecionada,dimensoesSelecionada,pesoSelecionado,generoSelecionado,estampaSelecionada,tamanhoSelecionado,materialSelecionado);abrirModalCarrinho() }}><img src="/images/carrinho-de-compras.png" className="imagem-carrinho-botao"/>Adicionar ao carrinho</button>
                        <div className="card-cep">
                            <div className="container-imagem-cep">
                            <img src= "/images/localizacao.png" className="icone-localizacao-card-cep"/>
                            
                            <div className="cep-indicador"><div className="cep-cidade" style={{ gap: localidade !== "Insira seu cep" ? "50px" : "0px" }}>
                                <p>{cep}</p><p>{localidade === "Insira seu cep" ? "" : localidade}</p>
                                </div>
                            {loading && <span className="loading-indicator"></span>}</div>
                            <a className="botao-alterar"onClick={abrirModalCep}>Alterar</a>
                            </div>
                            
                        </div>
                        
                        </div>
                    </div>
                    
                    </div>
                    {mostrarModalCep && (
                                <ModalCep fecharModalCep = {fecharModalCep} calcularFretePorCep={calcularFretePorCep} setLocalidade={setLocalidade} setPrazo={setPrazo} setValorFrete={setValorFrete} produtoId = {produto?.id}/>
                            )}
                    {modalCarrinho && (
                        
                        <ModalCarrinho fecharModalCarrinho={fecharModalCarrinho} quantidadeSelecionada={quantidadeSelecionada}/>
                        
                    )}
                    <div className="container-card-frete">
                        <div className="empty"></div>
                    <div className="card-frete">
                        <div className="container-imagem-texto">
                        <img src="/images/caminhao.png" className="imagem-caminhao-frete"/>
                        <div className="texto-frete">
                        <p>Receba em até {prazo === null ? "Indisponível" : `${prazo}`} dias úteis</p>
                        <p>Após pagamento confirmado</p>
                        <p className="texto-prazo">Os prazos de entrega são contabilizados a partir da confirmação do pagamento e podem sofrer variações caso haja a compra de mais de uma unidade do mesmo produto.</p>
                        </div>
                        </div>
                        <p className="preco-frete"> {valorFrete === null ? "Indisponível" : `R$ ${valorFrete.toFixed(2)}`}</p> 
                                            
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
                        <h1>{produto.mediaAvaliacoes}</h1>
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