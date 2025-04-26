import './styles.css';
import Header from '../componentes/header/index.js';
import Footer from '../componentes/footer/index.js';
import { useCarrinho } from '../context/carrinhoContext.js';
import { useEffect } from 'react';
import { useState } from 'react';
import Carousel from '../componentes/carousel/index.js';
import axios from 'axios';
import CardCarrinho from '../componentes/card-carrinho/index.js';
import CardProdutoSalvo from '../componentes/card-produto-salvo/index.js';
import InputProdutoAlterar from '../componentes/inputProdutoAlterar/index.js';

    

function PaginaCarrinho() {

    const [mostrarProdutosSalvos,setMostrarProdutosSalvos] = useState(false);
    const [itensSalvos, setItensSalvos] = useState([]);
    const [selecionarAlterar, setSelecionarAlterar] = useState(false);
    const [mostrarOpcoes, setMostrarOpcoes] = useState(null);
    const [mostrarOpcoesSegundoInput, setMostrarOpcoesSegundoInput] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(1);
    const [modalUnidades,setModalUnidades] = useState(false);
    const [valorQuantidade, setValorQuantidade] = useState("mais");
    const [mostrarModalAlterar, setMostrarModalAlterar] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState([]);
    const [nomeValor, setNomeValor] = useState("");    
    const [mostrarInputAtributo, setMostrarInputAtributo] = useState("");
    const [atributoSelecionado, setAtributoSelecionado] = useState();
    const [corSelecionada,setCorSelecionada] = useState("");
    const [materialSelecionado,setMaterialSelecionado] = useState("");
    const [voltagemSelecionada,setVoltagemSelecionada] = useState("");
    const [generoSelecionado,setGeneroSelecionado] = useState("");
    const [tamanhoSelecionado,setTamanhoSelecionado] = useState("");
    const [estampaSelecionada,setEstampaSelecionada] = useState("");
    const [pesoSelecionado,setPesoSelecionado] = useState("");
    const [dimensoesSelecionada,setDimensoesSelecionada] = useState("");
    const [produtoAlterar, setProdutoAlterar] = useState("");
    const estadosSelecionados = {
        cor: corSelecionada,
        material: materialSelecionado,
        voltagem: voltagemSelecionada,
        genero: generoSelecionado,
        tamanho: tamanhoSelecionado,
        estampa: estampaSelecionada,
        peso: pesoSelecionado,
        dimensoes: dimensoesSelecionada
      };

    let itemSalvo;
    let itemSalvoAlterar;

    const handleMostrarInputAtributo = (nome) => {
        setMostrarInputAtributo(nome);
    }
    const fetchItemSelecionado =async (itemId,quantidade,corId = null,voltagemId = null,dimensoesId = null,pesosId = null,generoId = null,estampasId = null,tamanhosId = null,materiaisId = null) => {
        const resposta = await axios.get(
            `http://localhost:5000/produto/${itemId}`,
            {
              params: {
                corId,
                voltagemId,
                dimensoesId,
                pesosId,
                generoId,
                estampasId,
                tamanhosId,
                materiaisId
              },
              withCredentials: true
            }
          );
        console.log(`data.produto e`,resposta.data.produto);
        setItemSelecionado(resposta.data.produto);

        const itemNoCarrinho = carrinhoItens.find((item) => {return item.id === resposta.data.produto.cart_item_id});
        console.log(`itemNoCarrinho é`,itemNoCarrinho);
        setCorSelecionada(itemNoCarrinho?.cores_ids);
        setVoltagemSelecionada(itemNoCarrinho?.voltagem_ids);
        setMaterialSelecionado(itemNoCarrinho?.materiais_ids);
        setGeneroSelecionado(itemNoCarrinho?.generos_ids);
        setTamanhoSelecionado(itemNoCarrinho?.tamanhos_ids);
        setEstampaSelecionada(itemNoCarrinho?.estampas_ids);
        setPesoSelecionado(itemNoCarrinho?.pesos_ids);
        setDimensoesSelecionada(itemNoCarrinho?.dimensoes_ids);

        setNomeValor("Selecione uma opção");

        setQuantidadeSelecionada(quantidade);
    }

    const fetchItemSalvo = async (itemId,quantidade,corId = null,voltagemId = null,dimensoesId = null,pesosId = null,generoId = null,estampasId = null,tamanhosId = null,materiaisId = null) => {
        const segundaResposta = await axios.get(
            `http://localhost:5000/produto/${itemId}`,
            {
              params: {
                corId,
                voltagemId,
                dimensoesId,
                pesosId,
                generoId,
                estampasId,
                tamanhosId,
                materiaisId
              },
              withCredentials: true
            }
          );
          console.log(`segundarespostadataprodutoe`,segundaResposta.data.produto);
          setItemSelecionado(segundaResposta.data.produto);

        itemSalvo = await axios.get(`http://localhost:5000/itens-salvos`,{
              withCredentials: true})
        itemSalvoAlterar = itemSalvo.data.find((item) => {return item.id === segundaResposta.data.produto.produto_salvo?.produto_salvo_id});
        console.log(`itemSalvodata`, itemSalvo.data);
        console.log(`itemSalvoAlterar é`,itemSalvoAlterar);
        setProdutoAlterar(itemSalvoAlterar);
        setCorSelecionada(itemSalvoAlterar?.cor_id);
        setVoltagemSelecionada(itemSalvoAlterar?.voltagem_id);
        setMaterialSelecionado(itemSalvoAlterar?.material_id);
        setGeneroSelecionado(itemSalvoAlterar?.generos_id);
        setTamanhoSelecionado(itemSalvoAlterar?.tamanho_id);
        setEstampaSelecionada(itemSalvoAlterar?.estampas_id);
        setPesoSelecionado(itemSalvoAlterar?.peso_id);
        setDimensoesSelecionada(itemSalvoAlterar?.dimensoes_id)
        console.log(`isaé`,itemSalvoAlterar?.cor_id)

        setNomeValor("Selecione uma opção");
        setQuantidadeSelecionada(quantidade);
    }


    const handleMostrarModalAlterar = () => {
        setMostrarModalAlterar(!mostrarModalAlterar);
    }
    const selecionarQuantidade = (quantidade) => {
        setQuantidadeSelecionada(Number(quantidade));
        setMostrarOpcoes(false);
    }

    const selecionarNomeValor = (valor) => {
        setNomeValor(valor);
        setMostrarOpcoes(false);
    }

const handleMostrarOpcoesSegundoInput = () => {
    setMostrarOpcoesSegundoInput(!mostrarOpcoesSegundoInput);
}

   const handleMostrarProdutos = () => {
    setMostrarProdutosSalvos(!mostrarProdutosSalvos);
   } 
    

    const {obterCarrinho, carrinhoItens,editarQuantidadeItemCarrinho} = useCarrinho();

    const carregarItensSalvos = async () => {
        try{
            const resposta = await axios.get("http://localhost:5000/itens-salvos",{withCredentials:true});
            setItensSalvos(resposta.data);
        }
        catch(err){
            console.error("Não foi possivel carregar os itens salvos");
        }
    }
    
    const adicionarItemSalvo = async (produtoId, corId = null, voltagemId = null, dimensoesId = null, pesosId = null, generoId = null, estampasId = null, tamanhosId = null, materiaisId = null) => {
        try{
            await axios.post("http://localhost:5000/itens-salvos",{ produtoId,
                corId,
                voltagemId,
                dimensoesId,
                pesosId,
                generoId,
                estampasId,
                tamanhosId,
                materiaisId
             },{withCredentials:true});
            await carregarItensSalvos();
        }
        catch(err){
            console.error("Não foi possivel adicionar item salvo");
        }
    }

    const excluirItemSalvo = async (item, corId = null, voltagemId = null, dimensoesId = null, pesosId = null, generoId = null, estampasId = null, tamanhosId = null, materiaisId = null) => {
        try {
            await axios.delete("http://localhost:5000/itens-salvos", {
                data: { produtoId: item,
                    corId,
                    voltagemId,
                    dimensoesId,
                    pesosId,
                    generoId,
                    estampasId,
                    tamanhosId,
                    materiaisId
                },
                withCredentials: true
            });
            await carregarItensSalvos();
        } catch (err) {
            console.error("Não foi possível excluir o item salvo");
        }
    };


    const atualizarItemSalvo = async (quantidade,itemId,corId = null,voltagemId = null, dimensoesId = null, pesosId = null,generoId = null, estampasId = null,tamanhosId = null, materiaisId = null,alterar = null) => {
        try {
            await axios.put(`http://localhost:5000/itens-salvos/${itemId}`,{
                quantidade,
                corId,
                voltagemId,
                dimensoesId,
                pesosId,
                generoId,
                estampasId,
                tamanhosId,
                materiaisId,
                alterar
            },{withCredentials:true});
            await carregarItensSalvos();
        } catch (err) {
            console.error("Não foi possível excluir o item salvo");
        }
    };

    useEffect(() => {
        obterCarrinho();
    },[carrinhoItens]);

    useEffect(() => {
        carregarItensSalvos();
    },[itensSalvos])

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
    useEffect(() => {
        if (itemSelecionado) {
          const primeiroAtributo = Object.keys(itemSelecionado).find((chave) =>
            atributosSuportados.includes(chave)
          );
          if (primeiroAtributo) {
            setMostrarInputAtributo(primeiroAtributo);
            setAtributoSelecionado(primeiroAtributo);
          }
        }
      }, [itemSelecionado]);

    const calcularPrecoTotal = (item) => {
        return carrinhoItens.reduce((soma,item) => {
            const preco = Number(item.preco_pix);
            const quantidade = Number(item.quantidade);
            return soma + preco * quantidade
        },0);
    }

    const calcularFreteTotal = () => {
        return carrinhoItens.reduce((soma,item) => {
            const precoFrete = Number(item.valor_frete);
            return soma + precoFrete;
        },0);
    }

    const precoTotalMaisFrete = calcularPrecoTotal() + calcularFreteTotal();
    return (
        
        <div className="pagina-toda-carrinho">
        <Header props="barra-carrinho"/> 
        <div className="secao-carrinho">
            <div className="secao-carrinho-resumo-compra-recomendacoes">
            <div className="container-carrinho-resumo-compra">
            
            <div className={carrinhoItens.length > 0 ? "card-carrinho-com-item" : "card-carrinho-vazio"}>
            
                <div className={carrinhoItens.length > 0 ? "container-titulo-produtos" : ""}>
                {carrinhoItens.length > 0 ? <p style= {{fontSize:"18px"}}>Produtos</p> : ""}
                </div>
           <div className="container-card-carrinho">
            
            {carrinhoItens.length > 0 ? carrinhoItens.map((item) => {
                let precoTotal = parseFloat(item.quantidade) * parseFloat(item.preco)
                
                precoTotal = precoTotal.toFixed(2);
                
                let precoTotalPix = parseFloat(item.quantidade) * parseFloat(item.preco_pix);

                return (
                    <div className="card-carrinho">
                    <CardCarrinho fetchItemSelecionado={fetchItemSelecionado} mostrarModalAlterar={handleMostrarModalAlterar} item = {item} precoTotal={precoTotal} precoTotalPix={precoTotalPix} setItensSalvos={setItensSalvos} carregarItensSalvos={carregarItensSalvos} adicionarItemSalvo={adicionarItemSalvo}/>
                    
                    <div className="container-preco-frete">
                        <p>Frete</p>
                        <p>R${item.valor_frete}</p>
                    </div>
                    </div>
                )
            }) : <div className="container-carrinho-vazio">
                <img src ="/images/shopping-cart.png" className="imagem-carrinho-vazio"/>
                <div className="texto-carrinho-vazio">
                <p style={{fontSize:"18px"}}>Seu carrinho está vazio</p>
                <p style={{fontSize:"14px"}}>Navegue para descobrir ofertas incríveis,adicione produtos</p>           
                </div>
                <p style={{color:"var(--andes-color-blue-500, #3483fa)"}}>Conferir produtos</p>
                    </div>}
            
            </div>
            </div>
            {carrinhoItens.length > 0 ? <div className="card-resumo-da-compra">
                <div className="titulo-resumo-da-compra">
                <p style={{fontSize:"18px"}}>Resumo da compra</p>
                </div>
                <div className="produto-preco-produto">
                <p>Produto:</p>
                <p>R${calcularPrecoTotal().toFixed(2)}</p>
                </div>
                <div className="frete-preco-frete">
                <p>Frete:</p>
                <p>R${calcularFreteTotal().toFixed(2)}</p>
                </div>
                <p style={{fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}} >Inserir código de cupom</p>
                <div className="container-total">
                <p>Total</p>
                <p>R${precoTotalMaisFrete.toFixed(2)}</p>
                </div>
                <div className="container-botao">
                    <button>Continuar a Compra</button>
                </div>
            </div> : <div className="card-resumo-da-compra">
                <div className="titulo-resumo-da-compra">
                <p style={{color:"rgba(0, 0, 0, .25)",fontSize:"18px"}}>Resumo da compra</p>
                </div>
                <div className="container-total">
                <p style={{color:"rgba(0, 0, 0, .25)",fontSize:"14px"}}>Aqui você encontrará os valores da sua compra assim que adicionar os produtos</p>
                </div>
            </div>}
            </div>
            <div>
            
            </div>
            <div className="container-item-salvo">
            <div className="card-item-salvo">
                <div className="titulo-salvo-imagem">
                <p>Produtos salvos</p>
                <img src={itensSalvos?.[0]?.url} className={!mostrarProdutosSalvos ? "produto-salvo-imagem" : "produto-salvo-imagem-opacity"}/>
                </div>
                <div className="mostrar-produtos-imagem-drop-down" onClick={() => handleMostrarProdutos()}>
                <p style={{color:"#3483fa"}}>Ver produtos</p><img src={mostrarProdutosSalvos ? "/images/setinha-cima-dropdown-preta.png" : "/images/setinha-dropdown-preta.png"} className="imagem-botao-dropdown-produtos-salvos"/></div>
                {mostrarProdutosSalvos && (
                <div className="container-item-salvo">
                    {itensSalvos?.map((item) => {
                        let precoTotal = parseFloat(item.quantidade) * parseFloat(item.preco)
                        
                        precoTotal = precoTotal.toFixed(2);

                        let precoTotalPix = parseFloat(item.quantidade) * parseFloat(item.preco);
                        return (
                            
                        
                        <CardProdutoSalvo mostrarModalAlterar={handleMostrarModalAlterar} fetchItemSalvo={fetchItemSalvo} atualizarItemSalvo={atualizarItemSalvo} item = {item} obterCarrinho={obterCarrinho} precoTotal={precoTotal} excluirItemSalvo={excluirItemSalvo} precoTotalPix={precoTotalPix} setItensSalvos={setItensSalvos} carregarItensSalvos={carregarItensSalvos} adicionarItemSalvo={adicionarItemSalvo}/>
                    )})}
                    </div>
                        )}
                
                
                
                
            </div>
        </div>
            <div className="container-texto-recomendacoes">
            <p className="texto-recomendacoes">Recomendações para você</p>
            <Carousel itensPassados={4} carrinhoItens={carrinhoItens}/>
            </div>
        
        </div>
        </div>
        {mostrarModalAlterar && (
        <div className="secao-alterar">
            <div className="container-alterar">
                <div className="imagem-texto-preco-alterar">
                
            
                    <img src = {Array.isArray(itemSelecionado.imagens) 
        ? itemSelecionado.imagens?.[0] 
        : itemSelecionado.produto_salvo?.imagens || 'caminho/para/imagem/por/defeito.jpg'} className="imagem-produto-alterar"/>
                    <p style={{fontSize:"20px"}}>{itemSelecionado?.produto_nome ? itemSelecionado?.produto_nome : itemSelecionado.produto_salvo?.produto_nome}</p>
                    <p style={{fontSize:"24px"}}>R${itemSelecionado?.produto_preco ? itemSelecionado?.produto_preco : itemSelecionado.produto_salvo?.produto_preco}</p>
                    <div className="botao-detalhe-do-produto">
                    <a href="#">Ver detalhe do produto</a>
                    </div>
                </div>
                <div className="titulo-inputs-alterar">
                <div className="botao-fechar-alterar">
                <img onClick={() => handleMostrarModalAlterar()}src = "/images/close.png" className= "imagem-fechar-modal" />
                </div>
                <p className="titulo-alterar" >Escolha os detalhes deste produto</p>
                <div className="container-atributos-suportados">
                    {Object.entries(itemSelecionado).map(([nome,opcoes]) => {
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
                          const nomeMapeado = {
                            cor: "cores",
                            materiais: "materiais",
                            voltagem: "voltagens",
                            generos: "generos",
                            tamanho: "tamanhos",
                            estampas: "estampas",
                            pesos: "pesos",
                            dimensoes: "dimensoes",
                          };
                          const nomeMapeadoAlterar = {
                            cor:"cor_valor",
                            materiais: "material_valor",
                            voltagem: "voltagem_valor",
                            generos: "genero_valor",
                            tamanho : "tamanho_valor",
                            estampas: "estampa_valor",
                            pesos: "peso_valor",
                            dimensoes: "dimensoes_valor"
                          }

                        if(atributosSuportados.includes(nome)){
                            const nomeCarrinho = nomeMapeado[nome] || nome;
                            const nomeSalvo = nomeMapeadoAlterar[nome];
                            return (
                                <div className={`card-atributo-suportado ${atributoSelecionado === nome ? "selecionado" : ""}`} onClick={() => { setAtributoSelecionado(nome);console.log(itemSelecionado);console.log(`ITEMsALVOALTERAR É`,itemSalvoAlterar);const itemNoCarrinho = carrinhoItens.find((item) => {return item.id === itemSelecionado.cart_item_id
                                }
                                );
                                console.log(`itemNoCarrinho é`,itemNoCarrinho);
                                console.log(`itemSalvo A`, itemSalvo);
                                if(itemNoCarrinho){
                                    if(nomeCarrinho === "dimensoes"){
                                        const larguras = itemNoCarrinho.larguras
                                        const alturas = itemNoCarrinho.alturas
                                        const comprimentos = itemNoCarrinho.comprimentos
                                        setNomeValor(`${larguras} x ${alturas} x ${comprimentos}`);
                                    }
                                    else{
                                        
                                        setNomeValor(itemNoCarrinho?.[nomeCarrinho]);
                                        
                                    }
                                    setAtributoSelecionado(nome);
                                    
                                }
                                else{
                                    console.log(itemSalvoAlterar);
                                    console.log(`produto alterar e`,produtoAlterar);
                                    setNomeValor(produtoAlterar?.[nomeSalvo]);
                                }
                                
                                
                                
                                }}>
                                    <p onClick={() => {handleMostrarInputAtributo(nome);
                                        const itemNoCarrinho = carrinhoItens.find((item) => {return item.produto_id === itemSelecionado.produto_id});
                                    if(itemNoCarrinho || itemSalvoAlterar){
                                        const valorSelecionado = itemNoCarrinho[`${nome}Id`];
                                        setNomeValor(valorSelecionado);
                                    }
                                }}>{nome}</p>
                                </div>)
                        }
                    })
                        
                    }
                    </div>
                    {Object.entries(itemSelecionado).map(([nome,opcoes]) => {
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


                        if(atributosSuportados.includes(nome) && mostrarInputAtributo === nome){
                            
                            return (<div>
                                <InputProdutoAlterar setNomeValor={setNomeValor} nome={nome} mostrarOpcoes={mostrarOpcoes} setMostrarOpcoes = {setMostrarOpcoes} setMostrarOpcoesSegundoInput={setMostrarOpcoesSegundoInput} selecionarNomeValor = {selecionarNomeValor} nomeValor={nomeValor} itemSelecionado={itemSelecionado} setCorSelecionada={setCorSelecionada} setMaterialSelecionado = {setMaterialSelecionado} setVoltagemSelecionada = {setVoltagemSelecionada} setGeneroSelecionado = {setGeneroSelecionado} setTamanhoSelecionado = {setTamanhoSelecionado} setEstampaSelecionada={setEstampaSelecionada} setPesoSelecionado={setPesoSelecionado} setDimensoesSelecionada ={setDimensoesSelecionada}/>
 
                                <div>
                                    
                                </div>
                            </div>)
                                
                            }
                    })
                        
                    }
                                            <div className="container-input-alterar">
                                            <p>Quantidade:</p>
                        <div className="container-quantidade-foto-dropdown-alterar">
                        <p style ={{cursor:"pointer"}} onClick={() => {handleMostrarOpcoesSegundoInput();setMostrarOpcoes(false)}}>{quantidadeSelecionada !== "mais" ? `${quantidadeSelecionada} unidade${quantidadeSelecionada !== 1 ? "s" : ""}` : "Selecione a quantidade" }</p><img src={mostrarOpcoes ? "/images/setinha-cima-dropdown-preta.png" : "/images/setinha-dropdown-preta.png"} className="imagem-botao-dropdown-quantidade"/>
                        </div>
                            {mostrarOpcoesSegundoInput && (
                            <div className="selecao-input-cor">
                            {Array.from({length: itemSelecionado.produto_estoque}, (_,index) => {
                                return (
                                <div key={index}>
                                    <p onClick={() => {selecionarQuantidade(index + 1);handleMostrarOpcoesSegundoInput()}}>{index !== 0 ? index + 1 + ` unidades` : index + 1 + ` unidade`}</p>
                               </div>
                               )
                            })}
            
                            </div>
                        )}
                                            </div>          
                    <button onClick={() => {
                       console.log(`ets`,produtoAlterar); 
                       const encontrado = carrinhoItens.find((item) => item.id === itemSelecionado.cart_item_id);
                       console.log(`encontrado é`,encontrado);
                       console.log(quantidadeSelecionada)
                       console.log(corSelecionada);
                       if(encontrado && (corSelecionada !== encontrado.cores_ids || voltagemSelecionada !== encontrado.voltagem_ids || dimensoesSelecionada !== encontrado.dimensoes_ids || pesoSelecionado !== encontrado.pesos_ids || generoSelecionado !== encontrado.generos_ids || estampaSelecionada !== encontrado.estampas_ids || tamanhoSelecionado !== encontrado.tamanhos_ids || materialSelecionado !== encontrado.materiais_ids)){
                        editarQuantidadeItemCarrinho(quantidadeSelecionada,encontrado.id,corSelecionada,voltagemSelecionada,dimensoesSelecionada,pesoSelecionado,generoSelecionado,estampaSelecionada,tamanhoSelecionado,materialSelecionado,"alterar")}
                        else{
                        atualizarItemSalvo(quantidadeSelecionada,produtoAlterar.id,corSelecionada,voltagemSelecionada,dimensoesSelecionada,pesoSelecionado,generoSelecionado,estampaSelecionada,tamanhoSelecionado,materialSelecionado, "alterar");
                        };handleMostrarModalAlterar()}}className="botao-atualizar-alterar">Atualizar</button>
                </div>
            </div>
        </div>)}
        <Footer/>           
        </div>
    )
}

export default PaginaCarrinho;