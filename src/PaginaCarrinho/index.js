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
import { useCep } from '../context/CepContext.js';
import { useNavigate } from 'react-router-dom';

    

function PaginaCarrinho() {
    const navigate = useNavigate();
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
    const [dimensoesSelecionada,setDimensoesSelecionada] = useState("d");
    const [produtoAlterar, setProdutoAlterar] = useState("");
    const [precoEnvio, setPrecoEnvio] = useState({});
    const cep = useCep();
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
        
        setItemSelecionado(resposta.data.produto);

        const itemNoCarrinho = carrinhoItens.find((item) => {return item.id === resposta.data.produto.cart_item_id});
        
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
          
          setItemSelecionado(segundaResposta.data.produto);

        itemSalvo = await axios.get(`http://localhost:5000/itens-salvos`,{
              withCredentials: true})
        itemSalvoAlterar = itemSalvo.data.find((item) => {return item.id === segundaResposta.data.produto.produto_salvo?.produto_salvo_id});
        
        setProdutoAlterar(itemSalvoAlterar);
        setCorSelecionada(itemSalvoAlterar?.cor_id);
        setVoltagemSelecionada(itemSalvoAlterar?.voltagem_id);
        setMaterialSelecionado(itemSalvoAlterar?.material_id);
        setGeneroSelecionado(itemSalvoAlterar?.generos_id);
        setTamanhoSelecionado(itemSalvoAlterar?.tamanho_id);
        setEstampaSelecionada(itemSalvoAlterar?.estampas_id);
        setPesoSelecionado(itemSalvoAlterar?.peso_id);
        setDimensoesSelecionada(itemSalvoAlterar?.dimensoes_id)
        

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


    const atualizarItemSalvo = async (quantidade,itemId,corId = null,voltagemId = null, dimensoesId = null, pesosId = null,generoId = null, estampasId = null,tamanhosId = null, materiaisId = null,produtoId = null,alterar = null) => {
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
                produtoId,
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
            const preco = Number(item.preco);
            const quantidade = Number(item.quantidade);
            return soma + preco * quantidade
        },0);
    }

    const calcularFreteTotal = () =>
        Object.values(precoEnvio).reduce((total, valor) => total + parseFloat(valor), 0);

const fetchPrecoEnvio = async () => {
        try{
            if(cep !== "Insira seu cep"){
                console.log(cep);
            carrinhoItens.map( async (item) => {
              const respostaCEP = await axios.post(`http://localhost:5000/calcular-prazo-preco`, {
            cepOrigem:item.cep_origem,    
            cepDestino:cep.cep
            }, {withCredentials: true});

            setPrecoEnvio((prev) => ({
                ...prev,
                [item.id]: respostaCEP.data.precoEnvio
                }));

        }) 
            }
            
            }
            

        catch(err){
            console.error("Não foi possivel carregar o endereço de envio");
        }
        
        
    }
useEffect(() => {
    fetchPrecoEnvio();
},[cep]);    
    
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
                
                let precoTotalPix = Number(item.quantidade) * Number(item.preco_pix);
                precoTotalPix = parseFloat(precoTotalPix)

                return (
                    <div className="card-carrinho">
                    <CardCarrinho fetchItemSelecionado={fetchItemSelecionado} mostrarModalAlterar={handleMostrarModalAlterar} item = {item} precoTotal={precoTotal} precoTotalPix={precoTotalPix} setItensSalvos={setItensSalvos} carregarItensSalvos={carregarItensSalvos} adicionarItemSalvo={adicionarItemSalvo}/>
                    
                    <div className="container-preco-frete">
                        <p>Frete</p>
                        <p>R${precoEnvio[item.id]}</p>
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
                <p style={{cursor:"pointer",fontSize:"14px",color:"var(--andes-color-blue-500, #3483fa)"}} >Inserir código de cupom</p>
                <div className="container-total">
                <p>Total</p>
                <p>R${precoTotalMaisFrete.toFixed(2)}</p>
                </div>
                <div className="container-botao">
                    <button style={{cursor:"pointer"}} onClick={() => {navigate("/checkout")}}>Continuar a Compra</button>
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
            {itensSalvos.length > 0 ? <div className="card-item-salvo">
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

                        let precoTotalPix = (parseFloat(item.quantidade) * parseFloat(item.preco)).toFixed(2);
                        return (
                            
                        
                        <CardProdutoSalvo mostrarModalAlterar={handleMostrarModalAlterar} fetchItemSalvo={fetchItemSalvo} atualizarItemSalvo={atualizarItemSalvo} item = {item} obterCarrinho={obterCarrinho} precoTotal={precoTotal} excluirItemSalvo={excluirItemSalvo} precoTotalPix={precoTotalPix} setItensSalvos={setItensSalvos} carregarItensSalvos={carregarItensSalvos} adicionarItemSalvo={adicionarItemSalvo}/>
                    )})}
                    </div>
                        )}
                
                
                
                
            </div> : ""}
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
                <p className="titulo-alterar" >Escolha os detalhes deste produto:</p>
                <div className="container-atributos-suportados">
                    {Object.entries(itemSelecionado).map(([nome,opcoes]) => {
                         const atributosSuportados = [
                            "cor",
                            "voltagens",
                            "generos",
                            "tamanhos",
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
                            voltagens: "voltagem_valor",
                            generos: "genero_valor",
                            tamanhos : "tamanho_valor",
                            estampas: "estampa_valor",
                            pesos: "peso_valor",
                            
                          }

                        if(atributosSuportados.includes(nome) && opcoes.length > 0){
                            const nomeCarrinho = nomeMapeado[nome] || nome;
                        
                            const nomeSalvo = nomeMapeadoAlterar[nome];
                        
                            return (
                                <div className={`card-atributo-suportado ${atributoSelecionado === nome ? "selecionado" : ""}`} onClick={() => { setAtributoSelecionado(nome);const itemNoCarrinho = carrinhoItens.find((item) => {return item.id === itemSelecionado.cart_item_id
                                }
                                );
                                console.log(`itemNoCarrinho é`,itemNoCarrinho);
                                console.log(`itemSalvo A`, itemSalvo);
                                if(itemNoCarrinho){
                                    if(nomeCarrinho === "dimensoes"){
                                        const larguras = itemNoCarrinho.larguras
                                        const alturas = itemNoCarrinho.alturas
                                        const comprimentos = itemNoCarrinho.comprimentos
                                        const unidade = itemNoCarrinho.dimensoes_unidade;
                                        setNomeValor(`${larguras}${unidade} x ${alturas}${unidade} x ${comprimentos}${unidade}`);
                                    }
                                    else if(nomeCarrinho === "pesos"){
                                        const valor = itemNoCarrinho.pesos;
                                        const unidade = itemNoCarrinho.pesos_unidade;
                                        setNomeValor(`${valor}${unidade}`);
                                    }
                                    else if(nomeCarrinho === "voltagens"){
                                        const valor = itemNoCarrinho.voltagens;
                                        setNomeValor(`${valor}V`);
                                    }
                                    else{
                                        setNomeValor(itemNoCarrinho?.[nomeCarrinho]);
                                    }
                                    
                                    setAtributoSelecionado(nome);
                                    
                                }
                                else{
                                    console.log(`pdae`,produtoAlterar);
                                    if(nome === "dimensoes"){
                                        const larguras = produtoAlterar?.largura
                                        const alturas = produtoAlterar?.altura
                                        const comprimentos = produtoAlterar?.comprimento
                                        const unidade = produtoAlterar?.dimensoes_unidade;
                                        setNomeValor(`${larguras}${unidade} x ${alturas}${unidade} x ${comprimentos}${unidade}`);
                                    }
                                    else if(nome === "pesos"){
                                        const valor = produtoAlterar?.peso_valor;
                                        const unidade = produtoAlterar?.peso_unidade;
                                        setNomeValor(`${valor}${unidade}`);
                                    }
                                    else if(nome === "voltagens"){
                                        const valor = produtoAlterar?.voltagem_valor;
                                        setNomeValor(`${valor}V`);
                                    }
                                    else{
                                        setNomeValor(produtoAlterar?.[nomeSalvo]);
                                    }

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
                            "voltagens",
                            "generos",
                            "tamanhos",
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
                       
                       const encontrado = carrinhoItens.find((item) => item.id === itemSelecionado.cart_item_id);
                       
                       if(encontrado){
                        editarQuantidadeItemCarrinho(quantidadeSelecionada,encontrado.id,corSelecionada,voltagemSelecionada,dimensoesSelecionada,pesoSelecionado,generoSelecionado,estampaSelecionada,tamanhoSelecionado,materialSelecionado,encontrado.produto_id,"alterar")}
                        else{
                        atualizarItemSalvo(quantidadeSelecionada,produtoAlterar.id,corSelecionada,voltagemSelecionada,dimensoesSelecionada,pesoSelecionado,generoSelecionado,estampaSelecionada,tamanhoSelecionado,materialSelecionado,produtoAlterar.produto_id, "alterar");
                        };handleMostrarModalAlterar()}}className="botao-atualizar-alterar">Atualizar</button>
                </div>
            </div>
        </div>)}
        <Footer/>           
        </div>
    )
}

export default PaginaCarrinho;