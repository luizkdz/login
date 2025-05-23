import React, { useEffect, useRef, useState } from 'react';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PaginaAnunciarProduto(){
    const [nomeProduto,setNomeProduto] = useState("");
    const navigate = useNavigate();
    const [cor,setCor] = useState("");
    const [material,setMaterial] = useState("");
    const [dimensao,setDimensao] = useState("");
    const [estampa,setEstampa] = useState("");
    const [genero,setGenero] = useState("");
    const [peso,setPeso] = useState("");
    const [voltagem,setVoltagem] = useState("");
    const [tamanho,setTamanho] = useState("");
    const [comprimento,setComprimento] = useState("");
    const [largura,setLargura] = useState("");
    const [altura,setAltura] = useState("");
    const [disableComprimento,setDisableComprimento] = useState(false);
    const [disableLargura, setDisableLargura] = useState(false);
    const [disableAltura, setDisableAltura] = useState(false);
    const [disableCor, setDisableCor] = useState(false);
    const [disableMaterial, setDisableMaterial] = useState(false);
    const [disableDimensao, setDisableDimensao] = useState(false);
    const [disableEstampa, setDisableEstampa] = useState(false);
    const [disableGenero, setDisableGenero] = useState(false);
    const [disablePeso, setDisablePeso] = useState(false);
    const [disableVoltagem, setDisableVoltagem] = useState(false);
    const [disableTamanho, setDisableTamanho] = useState(false);
    const [estoque,setEstoque] = useState("");
    const [precoFrete,setPrecoFrete] = useState("");
    const [quantidadeDeFotos,setQuantidadeDeFotos] = useState("");
    const [opiniaoClientes, setOpiniaoClientes] = useState("");
    const [descricao,setDescricao] = useState("");
    const [imagemCondicaoProduto, setImagemCondicaoProduto] = useState("/images/giftbox.png");
    const [valorLink, setValorLink] = useState(Array(quantidadeDeFotos).fill(''));
    const [fade, setFade] = useState(true);
    const [cep,setCep] = useState("");
    const [cidade,setCidade] = useState("");
    const [estado,setEstado] = useState("");
    const [erroCep,setErroCep] = useState("");
    const [precoProduto,setPrecoProduto] = useState("");
    const [mostrarMaisInformacoes, setMostrarMaisInformacoes] = useState(false);
    const [condicaoProduto, setCondicaoProduto] = useState(1);
    const [freteSelecionado, setFreteSelecionado] = useState("frete-gratis");

    const [step,setStep] = React.useState(1);
    const isPoppingState = useRef(false);

    const [unidadeDimensoes, setUnidadeDimensoes] = useState("cm");
    const [unidadePeso, setUnidadePeso] = useState("kg");
    const [sugestoesCor, setSugestoesCor] = useState([]);
    const [mostrarSugestoesCor,setMostrarSugestoesCor] = useState(false);
    const [idCor, setIdCor] = useState("");
    const [sugestoesMateriais, setSugestoesMateriais] = useState([]);
    const [mostrarSugestoesMateriais, setMostrarSugestoesMateriais] = useState(false);
    const [idMaterial, setIdMaterial] = useState("");

    const [sugestoesEstampas, setSugestoesEstampas] = useState([]);
    const [mostrarSugestoesEstampas,setMostrarSugestoesEstampas] = useState(false);
    const [idEstampa, setIdEstampa] = useState("");


    const [sugestoesGenero, setSugestoesGenero] = useState([]);
    const [mostrarSugestoesGenero,setMostrarSugestoesGenero] = useState(false);
    const [idGenero, setIdGenero] = useState("");
    
    const [sugestoesTamanho, setSugestoesTamanho] = useState([]);
    const [mostrarSugestoesTamanho, setMostrarSugestoesTamanho] = useState(false);
    const [idTamanho, setIdTamanho] = useState("");
    
    const [sugestoesVoltagem, setSugestoesVoltagem] = useState([]);
    const [mostrarSugestoesVoltagem, setMostrarSugestoesVoltagem] = useState(false);
    const [idVoltagem, setIdVoltagem] = useState("");


    const [coresSelecionadas, setCoresSelecionadas] = useState([]);

    const [materiaisSelecionadas, setMateriaisSelecionados] = useState([]);

    const [estampasSelecionadas, setEstampasSelecionadas] = useState([]);

    const [generosSelecionados,setGenerosSelecionados] = useState([]);

    const [tamanhosSelecionados, setTamanhosSelecionados] = useState([]);

    const [voltagensSelecionadas,setVoltagensSelecionadas] = useState([]);

    const [numeroMaximoParcelas, setNumeroMaximoParcelas] = useState(2);

    const [numeroParcelasGratis, setNumeroParcelasGratis] = useState(1);

    const [precoProdutoPix, setPrecoProdutoPix] = useState("");
    
    const [taxaJurosAoMes, setTaxaJurosAoMes] = useState(0.1);
   
    const [aceitaPix, setAceitaPix] = useState("nao");
    
    const [aceitaParcelar, setAceitaParcelar] = useState("nao");

    const [erroDigiteUmNome, setErroDigiteUmNome] = useState(false);
    
    const [erroPreenchaOsCampos, setErroPreenchaOsCampos] = useState(false);
    
    const [erroFoto, setErroFoto] = useState(false);
    
    const [erroOpiniaoClientes, setErroOpiniaoClientes] = useState(false);

    const [erroDescricaoProduto, setErroDescricaoProduto] = useState(false);

    const [erroPrecoProdutoEstoque, setErroPrecoProdutoEstoque] = useState(false);

    const [erroCepIncompleto, setErroCepIncompleto] = useState(false);

    const [produtoId,setProdutoId] = useState("");

    const handleMostrarErroCep = () => {
        setErroCepIncompleto(true);
        setTimeout(() => {
            setErroCepIncompleto(false);
        },3000)
    }

    const handleMostrarErroPrecoEstoque = () => {
        setErroPrecoProdutoEstoque(true);
        setTimeout(() => {
            setErroPrecoProdutoEstoque(false);
        },3000)
    }
    
    
    const handleErroDescricaoProduto = () => {
        setErroDescricaoProduto(true);
        setTimeout(() => {
            setErroDescricaoProduto(false);
        },3000)
    }
    
    
    
    const handleErroOpiniaoClientes = () => {
        setErroOpiniaoClientes(true);
        setTimeout(() => {
            setErroOpiniaoClientes(false);
        },3000)
    }


    const handleMostrarErroFoto = () => {
        setErroFoto(true);
        setTimeout(() => {
            setErroFoto(false);
        },3000)
    }


    const handleErroDigiteUmNome = () => {
        setErroDigiteUmNome(true);
        setTimeout(() => {
            setErroDigiteUmNome(false);
        },3000)
    }

    const handleErroPreenchaOsCampos = () => {
        setErroPreenchaOsCampos(true);
        setTimeout(() => {
            setErroPreenchaOsCampos(false);
        },3000)
    }


    const calcularParcelas = (preco, numParcelas, numParcelasGratis, taxaJuros) => {
        const parcelas = [];
        const jurosMensal = taxaJuros / 100;
      
        for (let i = 1; i <= numParcelas; i++) {
          let tipo = i <= numParcelasGratis ? "sem juros" : "com juros";
      
          let valorTotal;
          if (tipo === "sem juros") {
            valorTotal = preco;
          } else {
            const n = (i - numeroParcelasGratis) ;
            const fator = Math.pow(1 + jurosMensal, n);
            const parcelaComJuros = (preco * jurosMensal * fator) / (fator - 1);
            valorTotal = (parcelaComJuros) * (n) ;
          }
      
          parcelas.push({
            numeroParcelas: i,
            tipo,
            valorParcela: (valorTotal / i).toFixed(2),
            valorTotal: valorTotal.toFixed(2),
          });
        }
      
        return parcelas;
      };

   const resultado = calcularParcelas(Number(precoProduto),Number(numeroMaximoParcelas),Number(numeroParcelasGratis),Number(taxaJurosAoMes));
    const adicionarVoltagem = (valor = voltagem) => {
        if(valor && !voltagensSelecionadas.includes(valor) && voltagensSelecionadas.length < 3){
            setVoltagensSelecionadas([...voltagensSelecionadas,valor])
            setVoltagem("")
        }
    }

    const removerVoltagem = (voltagemParaRemover) => {
        setVoltagensSelecionadas(voltagensSelecionadas.filter((v) => {return v !== voltagemParaRemover}));
    }

    
    const adicionarTamanho = (valor = tamanho) => {
        if(valor && !tamanhosSelecionados.includes(valor) && tamanhosSelecionados.length < 3){
            setTamanhosSelecionados([...tamanhosSelecionados,valor]);
            setTamanho("");
        }
    }

    const removerTamanho = (tamanhoParaRemover) => {
        setTamanhosSelecionados(tamanhosSelecionados.filter((t) => {return t !== tamanhoParaRemover}));
    }
    
    
    const adicionarGenero = (valor = genero) => {
        if(valor && !generosSelecionados.includes(valor) && generosSelecionados.length < 3){
            setGenerosSelecionados([...generosSelecionados,valor]);
            setGenero("")
        }
    }

    const removerGenero = (generoParaRemover) => {
        setGenerosSelecionados(generosSelecionados.filter((g) => {return g !== generoParaRemover}));

    }
    
    
    const adicionarEstampa = (valor=estampa) => {
        if(valor && !estampasSelecionadas.includes(valor) && estampasSelecionadas.length < 3){
            setEstampasSelecionadas([...estampasSelecionadas,valor]);
            setEstampa("");
        }
    }

    const removerEstampa = (estampaParaRemover) => {
        setEstampasSelecionadas(estampasSelecionadas.filter((e) => {return e !== estampaParaRemover}));

    }


    
    const adicionarMaterial = (valor = material) => {
        if(valor && !materiaisSelecionadas.includes(valor) && materiaisSelecionadas.length < 3){
            setMateriaisSelecionados([...materiaisSelecionadas,valor]);
            setMaterial("");
        }
    }

    const removerMaterial = (materialParaRemover) => {
        setMateriaisSelecionados(materiaisSelecionadas.filter((m) => {return m !== materialParaRemover}));

    }

    const adicionarCor = (valor = cor) => {
        if(valor && !coresSelecionadas.includes(valor) && coresSelecionadas.length < 3){
            setCoresSelecionadas([...coresSelecionadas,valor]);
            setCor("");
        }
        
    }

    const removerCor = (corParaRemover) => {
        setCoresSelecionadas(coresSelecionadas.filter((c) => {return c !== corParaRemover}))
    };

    const handleAnunciarProduto = async () => {
        try{
            const resposta = await axios.post("http://localhost:5000/anunciar-produto",{
                nomeProduto,
                cor:coresSelecionadas,
                material:materiaisSelecionadas,
                estampa:estampasSelecionadas,
                genero:generosSelecionados,
                pesos:{peso,
                    unidadePeso
                },
                voltagem:voltagensSelecionadas,
                tamanho:tamanhosSelecionados,
                dimensoes:{comprimento,
                    largura,
                    altura,
                    unidadeDimensoes
                },
                estoque,
                precoProduto,
                descricao,
                opiniaoClientes,
                imagens:{imagem1:valorLink[0],
                    imagem2:valorLink[1],
                    imagem3:valorLink[2],
                    imagem4:valorLink[3],
                    imagem5:valorLink[4]
                },
                cep,
                precoProdutoPix,
                numeroParcelas:resultado[resultado.length -1].numeroParcelas,
                precoTotalParcelado:resultado[resultado.length -1].valorTotal,
                desconto:(precoProdutoPix ? ((Number(precoProduto) - Number(precoProdutoPix) ) /Number(precoProduto)) * 100 : null),
                numeroParcelasGratis,
                taxaJurosAoMes,
                condicaoProduto,
                freteSelecionado
            },{withCredentials:true})

            setProdutoId(resposta.data);
        }
        catch(err){
            console.log(err);
            console.error("Não foi possível anunciar o produto");
        }
    }


    const selecionarSugestoesVoltagem = (valor) => {
        setVoltagem(valor);
        setMostrarSugestoesVoltagem(false);
    }
    
    
    const handleChangeVoltagem = (e) => {    
        const valor = e.target.value;
        setVoltagem(valor);
        if (!disableVoltagem && valor.trim()) {
          fetchVoltagemBanco(valor);
        } else {
          setSugestoesVoltagem([]);
          setMostrarSugestoesVoltagem(false);
        }
      };
    
    
    const fetchVoltagemBanco = async (nomeVoltagem) => {
        try{
            const resposta = await axios.get(`http://localhost:5000/buscar-voltagens-produto/${nomeVoltagem}`,{withCredentials:true})
            if(resposta.data){
                setSugestoesVoltagem(resposta.data);
                setMostrarSugestoesVoltagem(true);
            }
        }
        catch(err){
            console.error("Não foi possivel carregar os materiais");
        }
    }



    const selecionarSugestaoTamanho = (valor) => {
        setTamanho(valor);
        setMostrarSugestoesTamanho(false);
    }
    
    
    const handleChangeTamanho = (e) => {    
        const valor = e.target.value;
        setTamanho(valor);
        if (!disableTamanho && valor.trim()) {
          fetchTamanhoBanco(valor);
        } else {
          setSugestoesTamanho([]);
          setMostrarSugestoesTamanho(false);
        }
      };
    
    
    const fetchTamanhoBanco = async (nomeTamanho) => {
        try{
            const resposta = await axios.get(`http://localhost:5000/buscar-tamanhos-produto/${nomeTamanho}`,{withCredentials:true})
            if(resposta.data){
                setSugestoesTamanho(resposta.data);
                setMostrarSugestoesTamanho(true);
            }
        }
        catch(err){
            console.error("Não foi possivel carregar os materiais");
        }
    }
    
    
    
    
    const selecionarSugestaoGenero = (valor) => {
        setGenero(valor);
        setMostrarSugestoesGenero(false);
    }
    
    
    const handleChangeGenero = (e) => {    
        const valor = e.target.value;
        setGenero(valor);
        if (!disableGenero && valor.trim()) {
          fetchGeneroBanco(valor);
        } else {
          setSugestoesGenero([]);
          setMostrarSugestoesGenero(false);
        }
      };
    
    
    const fetchGeneroBanco = async (nomeGenero) => {
        try{
            const resposta = await axios.get(`http://localhost:5000/buscar-genero-produto/${nomeGenero}`,{withCredentials:true})
            if(resposta.data){
                setSugestoesGenero(resposta.data);
                setMostrarSugestoesGenero(true);
            }
        }
        catch(err){
            console.error("Não foi possivel carregar os materiais");
        }
    }


    const fetchEstampaBanco = async (nomeEstampa) => {
        try{
            const resposta = await axios.get(`http://localhost:5000/buscar-estampa-produto/${nomeEstampa}`,{withCredentials:true})
            if(resposta.data){
                setSugestoesEstampas(resposta.data);
                setMostrarSugestoesEstampas(true);
            }
        }
        catch(err){
            console.error("Não foi possivel carregar os materiais");
        }
    }

    const handleChangeEstampas = (e) => {    
        const valor = e.target.value;
        setEstampa(valor);
        if (!disableEstampa && valor.trim()) {
          fetchEstampaBanco(valor);
        } else {
          setSugestoesEstampas([]);
          setMostrarSugestoesEstampas(false);
        }
      };

      const selecionarSugestaoEstampa = (valor) => {
        setEstampa(valor);
        setMostrarSugestoesEstampas(false);
    }
    
    const fetchMaterialBanco = async (nomeMaterial) => {
        try{
            const resposta = await axios.get(`http://localhost:5000/buscar-materiais-produto/${nomeMaterial}`,{withCredentials:true})
            if(resposta.data){
                setSugestoesMateriais(resposta.data);
                setMostrarSugestoesMateriais(true);
            }
        }
        catch(err){
            console.error("Não foi possivel carregar os materiais");
        }
    }

    const handleChangeMaterial = (e) => {    
        const valor = e.target.value;
        setMaterial(valor);
        if (!disableMaterial && valor.trim()) {
          fetchMaterialBanco(valor);
        } else {
          setSugestoesMateriais([]);
          setMostrarSugestoesMateriais(false);
        }
      };

      const selecionarSugestaoMateriais = (valor) => {
        setMaterial(valor);
        setMostrarSugestoesMateriais(false);
    }
    


    const fetchCoresBanco = async (nomeCor) => {
        try{
            const resposta = await axios.get(`http://localhost:5000/buscar-cores-produto/${encodeURIComponent(nomeCor.trim())}`,{withCredentials:true});
            if(resposta.data){
                setSugestoesCor(resposta.data);
                setMostrarSugestoesCor(true);
            }
        
        }
        catch(err){
            console.error("Não foi possivel carregar as cores");
        }
    }

    const handleChangeCor = (e) => {    
        const valor = e.target.value;
        setCor(valor);
        if (!disableCor && valor.trim()) {
          fetchCoresBanco(valor);
        } else {
          setSugestoesCor([]);
          setMostrarSugestoesCor(false);
        }
      };

    const selecionarSugestaoCor = (valor) => {
        setCor(valor);
        setMostrarSugestoesCor(false);
    }


    const handleMostrarMaisInformacoes = () => {
        setFade(false);
        setTimeout(() => {
            setMostrarMaisInformacoes(!mostrarMaisInformacoes);
            setFade(true);
        },300)
        
        
    }

    const calcularPrecoTotal = () => {
        if(Number(precoFrete) !== NaN){
            const soma = Number(precoProduto) + Number(precoFrete); 
        return soma;
        }
        else{
        return Number(precoProduto);
        }
       
       
    }


    const trocarImagem = (novaImagem) => {
        setFade(false);
        setTimeout(() => {
            setImagemCondicaoProduto(novaImagem);
            setFade(true);
        }, 300);
    };

    const calcularCidadeEstado = async (cep) => {
        const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
        
        if (resposta.data && resposta.data.localidade && resposta.data.estado) {
        setCidade(resposta.data.localidade);
        setEstado(resposta.data.uf);
        setErroCep("");
    }
        else{
            setErroCep("Digite um CEP válido.Tente novamente");
            setCidade("");
            setEstado("");
        }
    }
    const handleNext = () => {
        setStep((prev) => prev + 1);
    };
    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    useEffect(() => {
            if (!isPoppingState.current) {
                window.history.pushState({ step }, '');
            } else {
                isPoppingState.current = false;
            }
        }, [step]);
        
        useEffect(() => {
            const onPopState = (event) => {
                if (event.state) {
                    isPoppingState.current = true;
                    setStep(event.state.step);
                    
                }
            };
        
            window.addEventListener('popstate', onPopState);
            return () => {
                window.removeEventListener('popstate', onPopState);
            };
            
        }, []);
    
    return (
        <div className="pagina-toda-anunciar-produto">
            <Header props="p"/>
            {step === 1 ? <div className="secao-anunciar-produto">
                <h2>O que você está anunciando?</h2>
                <div className="container-anunciar-produto">
                <div style={{marginTop:"20px",cursor:"pointer",}}onClick={() => {handleNext()}} className="card-anunciar-produto">
                    <img src="/images/sneakers-pagina-anunciar.png" className="imagem-card-anunciar-produto"/>
                    <p>Produtos</p>
                </div>
                </div>
                
            </div>: ""}
            {step === 2 ? <div className="secao-identificar-produto">
                <p>Etapa 1 de 2</p>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:"100px"}}>
                <h2>Vamos começar identificando seu <br/>produto</h2>
                <img src="/images/shirt.png" style={{width:"200px",height:"200px"}}/>
                </div>
                <div className="card-secao-identificar-produto">
                    <p>Indique o nome do produto e principais caracteristicas</p>
                    <div style={{display:"flex",flexDirection:"column"}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div style={{position:"relative",width:"100%"}}>
                    <input onChange={(e) => {setNomeProduto(e.target.value)}} placeholder="Exemplo:celular nokia nomepesquisa etc" style={{width:"80%",height:"50px",borderRadius:"6px",border:"1px solid #c1c1c1",paddingLeft:"40px"}}/>
                    <img src="/images/search.png" style={{position:"absolute",left:"10px",top:"16px",width:"20px",height:"20px"}}/>
                    </div>
                    <button onClick={() => {
                        if(nomeProduto != ""){
                            handleNext()
                        }
                        else{
                            handleErroDigiteUmNome();
                        }
                    
                    }} style={{height:"50px",width:"100px",backgroundColor:"#111111",border:"none",borderRadius:"6px",color:"white",fontWeight:"bold"}}>Próximo</button>
                    
                    </div>
                    <p style={{fontSize:"12px"}}>Adicione as principais caractéristicas do produto</p>
                    </div>
                </div>
                </div>
                <div
  style={{
    position: "fixed",
    bottom: erroDigiteUmNome ? "20px" : "-100px", // começa fora da tela
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "red",
    color: "#ffffff",
    padding: "20px",
    width: "600px",
    borderRadius: "6px",
    margin: "20px",
    transition: "bottom 0.3s ease-in-out", // efeito suave
  }}
>
  Digite um nome para continuar
</div>
            </div>: ""}
            {step === 3 ? <div style={{flexDirection:"row",justifyContent:"space-evenly",padding:"3rem",paddingBottom:"100px",height:"2500px",alignItems:"start"}} className="secao-identificar-produto">
                
                <div style={{display:"flex"}}>
                
                <div style={{}} className="card-informacoes-produto-pagina-anunciar">
                    <h2>Preencha as informações do seu produto</h2>
                    <div className="container-informacoes-produto-imagem-pagina-venda">
                    <div className="container-informacoes-produto-pagina-venda">
                    
                    <div>
                    <p style={{color:disableCor ? "grey" : ""}}>Cor</p>
                    <input disabled={disableCor} value = {cor} onChange={(e) => {handleChangeCor(e)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    
                    <div>
                    {mostrarSugestoesCor && sugestoesCor.length > 0 && (
        <ul style={{
          listStyle: "none",
          margin: 0,
          padding: "5px",
          
          top: "65px",
          left: 0,
          right: 0,
          backgroundColor: "white",
          border: "1px solid #ccc",
          maxHeight: "150px",
          overflowY: "auto",
          zIndex: 10
        }}>
          {sugestoesCor.map((item, index) => (
            <li
              key={index}
              onClick={() => {selecionarSugestaoCor(item.valor);setIdCor(item.id);setCor(item.valor);adicionarCor(item.valor)}}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee"
              }}
            >
              {item.valor}
            </li>
          ))}
        </ul>
      )}
      </div>
      {coresSelecionadas.map((item) => { return (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p>{item}</p><img onClick={() => {removerCor(item)}} src="/images/cross.png" style={{width:"16px",height:"16px"}}/>
        </div>
        )
      })}
      <button disabled={disableCor} onClick={() => {adicionarCor();setSugestoesCor(false)}} style={{color:"white",marginTop:"20px",borderRadius:"6px",backgroundColor:disableCor ? "grey" : "#111111",border:"none",width:"100%",height:"50px",fontWeight:"bold"}}>Adicionar cor</button>
    {coresSelecionadas.length >= 3 ? <p style={{color:"red"}}>Limite de cores atingido!</p> : ""}
    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input checked={disableCor} value = {disableCor} onChange={() => {setDisableCor(!disableCor);setCor("");setMostrarSugestoesCor(false)}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableMaterial ? "grey" : ""}} >Material</p>
                    <input disabled={disableMaterial} value = {material} onChange={(e) => {handleChangeMaterial(e)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <div>
                    {mostrarSugestoesMateriais && sugestoesMateriais.length > 0 && (
        <ul style={{
          listStyle: "none",
          margin: 0,
          padding: "5px",
          
          top: "65px",
          left: 0,
          right: 0,
          backgroundColor: "white",
          border: "1px solid #ccc",
          maxHeight: "150px",
          overflowY: "auto",
          zIndex: 10
        }}>
          {sugestoesMateriais.map((item, index) => (
            <li
              key={index}
              onClick={() => {selecionarSugestaoMateriais(item.valor);setIdMaterial(item.id);adicionarMaterial(item.valor)}}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee"
              }}
            >
              {item.valor}
            </li>
          ))}
        </ul>
      )}
      </div>
      {materiaisSelecionadas.map((item) => { return (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p>{item}</p><img onClick={() => {removerMaterial(item)}} src="/images/cross.png" style={{width:"16px",height:"16px"}}/>
        </div>
        )
      })}
      <button disable={disableMaterial} onClick={() => {adicionarMaterial();setSugestoesMateriais(false)}} style={{color:"white",marginTop:"20px",borderRadius:"6px",backgroundColor:disableMaterial ? "grey" :"#111111",border:"none",width:"100%",height:"50px",fontWeight:"bold"}}>Adicionar material</button>
      {materiaisSelecionadas.length >= 3 ? <p style={{color:"red"}}>Limite de materiais atingido!</p> : ""}             
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input checked={disableMaterial} value = {disableMaterial} onChange={() => {setDisableMaterial(!disableMaterial);setMaterial("");setMostrarSugestoesMateriais(false)}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    
                    <label  style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    
                    
                    <div>
                    <p style={{color:disableComprimento || disableDimensao ? "grey" : ""}} >Comprimento</p>
                    <div style={{position:"relative"}}>
                    <input disabled={disableComprimento || disableDimensao} value = {comprimento} onChange={(e) => {setComprimento(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                        <div>
                            
                    </div>
                    
                    </div>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input checked={disableComprimento || disableDimensao} value = {disableComprimento} onChange={() => {setDisableComprimento(!disableComprimento);setComprimento("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableLargura || disableDimensao ? "grey" : ""}} >Largura</p>
                    <div style={{position:"relative"}}>
                    <input disabled={disableLargura || disableDimensao} value = {largura} onChange={(e) => {setLargura(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                        <div>
                            
                    </div>
                    
                    </div>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input checked={disableLargura || disableDimensao} value = {disableLargura} onChange={() => {setDisableLargura(!disableLargura);setLargura("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableAltura || disableDimensao ? "grey" : ""}} >Altura</p>
                    <div style={{position:"relative"}}>
                    <input disabled={disableAltura || disableDimensao} value = {altura} onChange={(e) => {setAltura(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    
                    
                    </div>
                    
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input checked={disableAltura || disableDimensao} value = {disableAltura} onChange={() => {setDisableAltura(!disableAltura);setAltura("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableDimensao ? "grey" : ""}} >Unidade de medida</p>
                    <div style={{position:"relative"}}>
                    <select disabled={disableDimensao} value={unidadeDimensoes} onChange={(e) => {setUnidadeDimensoes(e.target.value)}} style={{outline:"none",border:"none" ,right:"0px",bottom:"2px",height:"40px"}}>
                        <option value="cm">CM</option>
                        <option value="m">M</option>
                        </select>
                        <div>
                            
                    </div>
                    
                    </div>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input checked={disableDimensao} value = {disableDimensao} onChange={() => {setDisableDimensao(!disableDimensao);setLargura("");setComprimento("");setAltura("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    
                    </div>
                    
                    
                    <div>
                    <p style={{color:disableEstampa ? "grey" : ""}} >Estampa</p>
                    <input disabled={disableEstampa} value = {estampa} onChange={(e) => {handleChangeEstampas(e)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <div>
                    {mostrarSugestoesEstampas && sugestoesEstampas.length > 0 && (
        <ul style={{
          listStyle: "none",
          margin: 0,
          padding: "5px",
          
          top: "65px",
          left: 0,
          right: 0,
          backgroundColor: "white",
          border: "1px solid #ccc",
          maxHeight: "150px",
          overflowY: "auto",
          zIndex: 10
        }}>
          {sugestoesEstampas.map((item, index) => (
            <li
              key={index}
              onClick={() => {selecionarSugestaoEstampa(item.valor);setIdEstampa(item.id);adicionarEstampa(item.valor)}}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee"
              }}
            >
              {item.valor}
            </li>
          ))}
        </ul>
      )}
      </div>
      {estampasSelecionadas.map((item) => { return (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p>{item}</p><img onClick={() => {removerEstampa(item)}} src="/images/cross.png" style={{width:"16px",height:"16px"}}/>
        </div>
        )
      })}
      <button disabled={disableEstampa} onClick={() => {adicionarEstampa();setSugestoesEstampas(false)}} style={{color:"white",marginTop:"20px",borderRadius:"6px",backgroundColor:disableEstampa ? "grey" : "#111111",border:"none",width:"100%",height:"50px",fontWeight:"bold"}}>Adicionar estampa</button>
      {estampasSelecionadas.length >= 3 ? <p style={{color:"red"}}>Limite de estampas atingido!</p>: ""}
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input checked={disableEstampa} value = {disableEstampa} onChange={() => {setDisableEstampa(!disableEstampa);setEstampa("");setMostrarSugestoesEstampas(false)}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableGenero ? "grey" : ""}} >Genero</p>
                    <input disabled={disableGenero} value = {genero} onChange={(e) => {handleChangeGenero(e)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <div>
                    {mostrarSugestoesGenero && sugestoesGenero.length > 0 && (
        <ul style={{
          listStyle: "none",
          margin: 0,
          padding: "5px",
          
          top: "65px",
          left: 0,
          right: 0,
          backgroundColor: "white",
          border: "1px solid #ccc",
          maxHeight: "150px",
          overflowY: "auto",
          zIndex: 10
        }}>
          {sugestoesGenero.map((item, index) => (
            <li
              key={index}
              onClick={() => {selecionarSugestaoGenero(item.valor);setIdGenero(item.id);adicionarGenero(item.valor)}}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee"
              }}
            >
              {item.valor}
            </li>
          ))}
        </ul>
      )}
      </div>
      {generosSelecionados.map((item) => { return (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p>{item}</p><img onClick={() => {removerGenero(item)}} src="/images/cross.png" style={{width:"16px",height:"16px"}}/>
        </div>
        )
      })}
      <button disabled={disableGenero} onClick={() => {adicionarGenero();setSugestoesGenero(false)}} style={{color:"white",marginTop:"20px",borderRadius:"6px",backgroundColor:disableGenero ? "grey" : "#111111",border:"none",width:"100%",height:"50px",fontWeight:"bold"}}>Adicionar genero</button>
      {generosSelecionados.length >= 3 ? <p style={{color:"red"}}>Limite de generos atingido!</p> : ""}
                <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input checked={disableGenero} value = {disableGenero} onChange={() => {setDisableGenero(!disableGenero);setGenero("");setMostrarSugestoesGenero(false)}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disablePeso ? "grey" : ""}} >Peso</p>
                    <div style={{position:"relative"}}>
                    <input disabled={disablePeso} value = {peso} onChange={(e) => {setPeso(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <select disabled = {disablePeso} value={unidadePeso} onChange={(e) => {setUnidadePeso(e.target.value)}} style={{outline:"none",border:"none" ,position:"absolute",right:"0px",bottom:"2px",height:"100%"}}>
                        <option value="kg">Kg</option>
                        <option value="g">g</option>
                    </select>
                    </div>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input checked={disablePeso} value = {disablePeso} onChange={() => {setDisablePeso(!disablePeso);setPeso("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableVoltagem ? "grey" : ""}} >Voltagem</p>
                    <input disabled={disableVoltagem} value = {voltagem} onChange={(e) => {handleChangeVoltagem(e)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/> 
                    <div>
                    {mostrarSugestoesVoltagem && sugestoesVoltagem.length > 0 && (
        <ul style={{
          listStyle: "none",
          margin: 0,
          padding: "5px",
          
          top: "65px",
          left: 0,
          right: 0,
          backgroundColor: "white",
          border: "1px solid #ccc",
          maxHeight: "150px",
          overflowY: "auto",
          zIndex: 10
        }}>
          {sugestoesVoltagem.map((item, index) => (
            <li
              key={index}
              onClick={() => {selecionarSugestoesVoltagem(item.valor);setIdVoltagem(item.id);adicionarVoltagem(item.valor)}}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee"
              }}
            >
              {item.valor}
            </li>
          ))}
        </ul>
      )}
      </div>
      {voltagensSelecionadas.map((item) => { return (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p>{item}</p><img onClick={() => {removerVoltagem(item)}} src="/images/cross.png" style={{width:"16px",height:"16px"}}/>
        </div>
        )
      })}
      <button disabled={disableVoltagem} onClick={() => {adicionarVoltagem();setSugestoesVoltagem(false)}} style={{color:"white",marginTop:"20px",borderRadius:"6px",backgroundColor:disableVoltagem ? "grey" : "#111111",border:"none",width:"100%",height:"50px",fontWeight:"bold"}}>Adicionar voltagem</button>
      {voltagensSelecionadas.length >= 3 ? <p style={{color:"red"}}>Limite de voltagens atingido!</p>: ""}
      
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input checked={disableVoltagem} value = {disableVoltagem} onChange={() => {setDisableVoltagem(!disableVoltagem);setVoltagem("");setMostrarSugestoesVoltagem(false)}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableTamanho ? "grey" : ""}} >Tamanho</p>
                    <input disabled={disableTamanho} value = {tamanho} onChange={(e) => {handleChangeTamanho(e)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/> 
                    <div>
                    {mostrarSugestoesTamanho && sugestoesTamanho.length > 0 && (
        <ul style={{
          listStyle: "none",
          margin: 0,
          padding: "5px",
          
          top: "65px",
          left: 0,
          right: 0,
          backgroundColor: "white",
          border: "1px solid #ccc",
          maxHeight: "150px",
          overflowY: "auto",
          zIndex: 10
        }}>
          {sugestoesTamanho.map((item, index) => (
            <li
              key={index}
              onClick={() => {selecionarSugestaoTamanho(item.valor);setIdTamanho(item.id);adicionarTamanho(item.valor)}}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee"
              }}
            >
              {item.valor}
            </li>
          ))}
        </ul>
      )}
      </div>
      {tamanhosSelecionados.map((item) => { return (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p>{item}</p><img onClick={() => {removerTamanho(item)}} src="/images/cross.png" style={{width:"16px",height:"16px"}}/>
        </div>
        )
      })}
      <button disabled={disableTamanho} onClick={() => {adicionarTamanho();setSugestoesTamanho(false)}} style={{color:"white",marginTop:"20px",borderRadius:"6px",backgroundColor:disableTamanho ? "grey" : "#111111",border:"none",width:"100%",height:"50px",fontWeight:"bold"}}>Adicionar tamanho</button>
      {tamanhosSelecionados.length >= 3 ? <p style={{color:"red"}}>Limite de tamanhos atingido!</p>: ""}
                    <div style={{gap:"10px",display:"flex",alignItems:"center"}}>
                    <input checked={disableTamanho} value = {disableTamanho} onChange={() => {setDisableTamanho(!disableTamanho);setTamanho("");setMostrarSugestoesTamanho(false)}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    
                    </div>
                    
                    </div>
                    </div>
                </div>
                <div style={{display:"flex",flexDirection:"column"}} className="container-card-informacoes-condicao-produto">
                <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
                <div style={{}} className="card-informacoes-condicao-produto-pagina-anunciar">
                <h2>Qual é a condição do seu produto?</h2>
                    <p onClick={() => {trocarImagem("/images/giftbox.png");setCondicaoProduto(1)}}className="paragrafo-condicao-produto"style={{backgroundColor:condicaoProduto === 1 ? "#f1f1f1" : "", padding:"20px"}}>Novo</p>
                    <p onClick={() => {trocarImagem("/images/receiving.png");setCondicaoProduto(2)}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === 2 ? "#f1f1f1" : "",padding:"20px"}}>Usado</p>
                    <p onClick={() => {trocarImagem("/images/product.png");setCondicaoProduto(3)}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === 3 ? "#f1f1f1" : "",padding:"20px"}}>Recondicionado</p>
                    <p onClick={() => {trocarImagem("/images/exclusive.png");setCondicaoProduto(4)}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === 4 ? "#f1f1f1" : "",padding:"20px"}}>Exclusivo</p>
                    <p onClick={() => {trocarImagem("/images/transport.png");setCondicaoProduto(5)}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === 5 ? "#f1f1f1" : "",padding:"20px"}}>Importado</p>
                    <p onClick={() => {trocarImagem("/images/social-media.png");setCondicaoProduto(6)}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === 6 ? "#f1f1f1" : "",padding:"20px"}}>Digital</p>
                    <p onClick={() => {trocarImagem("/images/personalized.png");setCondicaoProduto(7)}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === 7 ? "#f1f1f1" : "",padding:"20px"}}>Personalizado</p>
                    <p onClick={() => {trocarImagem("/images/licensing.png");setCondicaoProduto(8)}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === 8 ? "#f1f1f1" : "", padding:"20px"}}>Licenciado</p>
                      
                </div>
                <img src={imagemCondicaoProduto} style={{width:"100px",height:"100px",objectFit: 'cover',
                    transition: 'opacity 0.3s ease',
                    opacity: fade ? 1 : 0}}/>
                </div>
                <div style={{display:"flex",justifyContent:"end",paddingTop:"3rem",paddingBottom:"3rem"}}>
                <button onClick={() => {if(coresSelecionadas.length !== 0 || disableCor && materiaisSelecionadas.length !== 0 || disableMaterial && comprimento !== "" || disableComprimento && largura !== "" || disableLargura && altura !== "" || disableAltura && estampasSelecionadas.length !== 0 || disableEstampa && generosSelecionados.length !== 0 || disableGenero && peso != "" || disablePeso && voltagensSelecionadas.length !== 0 || disableVoltagem && tamanhosSelecionados.length !== 0 || disableTamanho)
                    {handleNext()

                    }
                    else{
                        handleErroPreenchaOsCampos();
                    }
                    }} style={{color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"200px",height:"50px",fontWeight:"bold"}}>Próximo</button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"100px"}}>
                <img src="/images/imagem-gpt-promocao.png" style={{height:"300px",width:"100%"}}/>
                <img src="/images/imagem-gpt-tenis.png" style={{height:"1000px",width:"100%"}}/>
                </div>
                </div>
                <div
  style={{
    position: "fixed",
    bottom: erroPreenchaOsCampos ? "20px" : "-100px", // começa fora da tela
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "red",
    color: "#ffffff",
    padding: "20px",
    width: "600px",
    borderRadius: "6px",
    margin: "20px",
    transition: "bottom 0.3s ease-in-out", // efeito suave
  }}
>
  * Preencha os campos para continuar
</div>  
            </div>: ""}
            {step === 4 ? <div style={{padding:"3rem"}} className="secao-identificar-produto">
                <h2>Adicione o link para as fotos</h2>
                <div style={{paddingTop:"20px",display:"flex",gap:"20px",alignItems:"center"}}>
                <p>Selecione a quantidade de fotos</p>
                <select value={quantidadeDeFotos} onChange={(e) => {setQuantidadeDeFotos(parseInt(e.target.value))}} style={{
    width: '120px',
    height: '40px',
    padding: '5px 10px',
    borderRadius: '8px',
    border: '1px solid #c1c1c1',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: '14px',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg width=\'10\' height=\'7\' viewBox=\'0 0 10 7\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1l4 4 4-4\' stroke=\'%23333\' stroke-width=\'2\' fill=\'none\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    backgroundSize: '10px'
}}>
    <option value="1">1 foto</option>
    <option value="2">2 fotos</option>
    <option value="3">3 fotos</option>
    <option value="4">4 fotos</option>
    <option value="5">5 fotos</option>
</select>
                </div>
                <div className="container-adicionar-link-botao">
                <div className="container-adicionar-link-imagem">
                <div className="container-imagem-fotos-produto">
<img src="/images/camera.png" style={{width:"200px",height:"200px"}}/>
<img src="/images/picture.png" style={{width:"200px",height:"200px"}}/>
</div>
                <div style={{
    border: '2px dashed #ccc',
    borderRadius: '10px',
    width: '300px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
}}>
    
    {[...Array(quantidadeDeFotos)].map((_, index) => (
    <div key={index} style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            Cole o link da imagem #{index + 1}
        </p>
        <input
            type="text"
            placeholder="https://exemplo.com/imagem.jpg"
            value={valorLink[index] || '' }
            onChange={(e) => {const newLinks = [...valorLink];
                newLinks[index] = e.target.value;
                setValorLink(newLinks);
            }}
            style={{
                width: '100%',
                height: '40px',
                borderRadius: '6px',
                border: '1px solid #c1c1c1',
                padding: '0 10px'
            }}
        />
    </div>
))}



    
</div>
<div style={{display:"flex",flexDirection:"column",gap:"60px",alignItems:"end"}}>
<div className="container-fotos-aparecendo">
{[...Array(quantidadeDeFotos)].map((_,index) => {
    if(valorLink[index] !== undefined && valorLink[index] !== ""){
        console.log(valorLink[index]);
        if(index === 0){
            return (
                 <div style={{height:"100px",position:"relative"}}>
                 <img src={valorLink[index]} style={{borderRadius:"6px",width:"100px",height:"100px"}} />
                 <p style={{width:"100%",fontSize:"12px",padding:"5px",borderRadius:"6px",position:"absolute",bottom:"0px",color:"green",backgroundColor:"#DFF5E1"}}>Foto Principal</p>
                 </div>
             ) 
         }
         else{
             return (
                 <div style={{position:"relative"}}>
                 <img src={valorLink[index]} style={{borderRadius:"6px",width:"100px",height:"100px"}} />
                 </div>
             ) 
         }
    }
    
        
})}
</div>
<button onClick={() => {if(valorLink[0] !== ""){
    handleNext()
    }
    else{
        handleMostrarErroFoto();
    }}} style={{color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"200px",height:"50px",fontWeight:"bold"}}>Próximo</button>
</div>
</div>
<div style={{display:"flex",justifyContent:"end"}}>

</div>
</div>
<div
  style={{
    position: "fixed",
    bottom: erroFoto ? "20px" : "-100px", // começa fora da tela
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "red",
    color: "#ffffff",
    padding: "20px",
    width: "600px",
    borderRadius: "6px",
    margin: "20px",
    transition: "bottom 0.3s ease-in-out", // efeito suave
  }}
>
  * Preencha com pelo menos uma foto
</div> 
            </div>
            : ""}
            {step === 5 ? <div style={{padding:"3rem"}} className="secao-identificar-produto">
                        <div style={{paddingBottom:"20px"}}>
                        <h2>O que os clientes falam sobre esse produto?</h2>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"end"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"50px"}}>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"end"}}>
                        <textarea maxLength={340} value={opiniaoClientes} onChange={(e) => {setOpiniaoClientes(e.target.value)}} placeholder="Escreva o que os clientes dizem" style={{borderRadius:"6px",paddingLeft:"20px",paddingRight:"20px",paddingTop:"20px",height:"150px",resize:"none",width:"600px"}}/>
                        <p style={{fontSize:"14px"}}>{opiniaoClientes.length}/340</p>
                        </div>
                        <img src="/images/talk.png" style={{width:"150px",height:"150px"}}/>
                        </div>
                        
                        <button onClick={() => {if(opiniaoClientes.length !== 0){
                            handleNext()
                        }
                        else{
                            handleErroOpiniaoClientes();
                        }
                    }} style={{marginTop:"20px",marginBottom:"20px",color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"200px",height:"50px",fontWeight:"bold"}}>Próximo</button>
                        </div>
                        <div
  style={{
    position: "fixed",
    bottom: erroOpiniaoClientes ? "20px" : "-100px", // começa fora da tela
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "red",
    color: "#ffffff",
    padding: "20px",
    width: "600px",
    borderRadius: "6px",
    margin: "20px",
    transition: "bottom 0.3s ease-in-out", // efeito suave
  }}
>
  * Preencha com a opinião dos clientes
</div> 
                    </div>: ""}
                    {step === 6 ? <div style={{padding:"3rem"}}className="secao-identificar-produto">
                        <div style={{paddingBottom:"20px"}}>
                        <h2>Adicione uma descrição do produto</h2>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"end"}}>
                        <div style={{display:"flex",alignItems:"center",gap:"50px"}}>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"end"}}>
                        <textarea maxLength={340} value={descricao} onChange={(e) => {setDescricao(e.target.value)}} placeholder="Adicione uma descrição do produto" style={{borderRadius:"6px",paddingLeft:"20px",paddingRight:"20px",paddingTop:"20px",height:"150px",resize:"none",width:"600px"}}/>
                        <p style={{fontSize:"14px"}}>{descricao.length}/340</p>
                        </div>
                        <img src="/images/description.png" style={{width:"150px",height:"150px"}}/>
                        </div>
                        <button onClick={() => {if(descricao.length !== 0){
                          handleNext()  
                        }
                        else{
                            handleErroDescricaoProduto();
                        } }} style={{marginTop:"20px",marginBottom:"20px",color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"200px",height:"50px",fontWeight:"bold"}}>Próximo</button>
                        </div>
                        <div
  style={{
    position: "fixed",
    bottom: erroDescricaoProduto ? "20px" : "-100px", // começa fora da tela
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "red",
    color: "#ffffff",
    padding: "20px",
    width: "600px",
    borderRadius: "6px",
    margin: "20px",
    transition: "bottom 0.3s ease-in-out", // efeito suave
  }}
>
  * Preencha com a descrição do produto
</div> 
                    </div>: ""}
            {step === 7 ? <div className="secao-identificar-produto">
            <p>Etapa 2 de 2</p>
                <div style={{display:"flex",alignItems:"center",gap:"100px"}}>
                <h2>Para concluir,<br/>
                vamos definir as condições de venda</h2>
                <img src="/images/online-shop.png" style={{width:"200px",height:"200px"}}/>
                </div>
                <div style={{width:"700px"}} className="card-condicoes-de-venda">
                    <div style={{display:"flex",flexDirection:"column",gap:"50px",justifyContent:"center"}}>
                    
                    <div>
                    <p>Qual é o preço do seu produto?</p>
                    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <p style={{position:"absolute"}}>R$</p><input type="number" value={precoProduto} onChange={(e) => {const val = e.target.value; if(val.length < 8) setPrecoProduto(val)}} style={{paddingLeft:"25px",width:"200px",height:"30px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    </div>
                    <p style={{fontSize:"12px"}}>*Lembre-se isso não inclui o valor do frete</p>
                    </div>
                    
                    <div style={{display:"flex",gap:"100px"}}>
                    <div style={{marginBottom:"20px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"50px"}}>
                    <div >
                    <p>Você aceita pix?</p>
                    <div style={{display:"flex",gap:"20px"}}>
                    <input checked = {aceitaPix === "sim"} value ={aceitaPix} onChange={() => {setAceitaPix("sim")}} type="radio"/><p>Sim</p>
                    </div>
                    <div style={{display:"flex",gap:"20px"}}>
                    <input checked ={aceitaPix === "nao"} value={aceitaPix} onChange={() => {setAceitaPix("nao")}} type="radio"/><p>Não</p>
                    </div>
                    </div>
                    <img src="/images/icone-pix.png" style={{width:"70px",height:"70px"}}/>
                    </div>
                    
                    {aceitaPix === "sim" ? <div style={{display:"flex",flexDirection:"column",gap:"40px",alignItems:"center"}}>
                        <div style={{marginTop:"50px",display:"flex",flexDirection:"column",gap:"50px"}}>
                        <p>Qual o preço do produto no Pix?</p>
                    <div style={{display:"flex",gap:"50px",alignItems:"center"}}>
                      
                    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <p style={{position:"absolute"}}>R$</p><input type="number" value={precoProdutoPix} onChange={(e) => {const val = e.target.value; if(val.length < 8) setPrecoProdutoPix(val)}} style={{paddingLeft:"25px",width:"200px",height:"30px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    </div>
                    <img src="/images/money-metodos-pagamento.png" style={{width:"100px",height:"100px"}}/>
                    </div>
                    </div>  
                    </div> : ""}
                    
                    
                    </div>
                    <div>
                    
                    
                    </div>
                    </div>
                    <p>Quantas unidades você tem disponível para venda?</p>
                    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <p style={{position:"absolute",left:"220px"}}>unidades</p><input type="number" value = {estoque} onChange={(e) => {const val = e.target.value; if(val.length < 8) setEstoque(parseInt(val));}}style={{paddingLeft:"25px",width:"200px",height:"30px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"end"}}>
                    <button onClick={() => {if(precoProduto.length !== 0 && estoque.length !== 0 && estoque >= 1){
                handleNext()
                    }
                    else{
                        handleMostrarErroPrecoEstoque();
                    } }} style={{color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"100%",height:"50px",fontWeight:"bold"}}>Próximo</button>
                    </div>
                    </div>
                </div>
                <div
  style={{
    position: "fixed",
    bottom: erroPrecoProdutoEstoque ? "20px" : "-150px", // começa fora da tela
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "red",
    color: "#ffffff",
    padding: "20px",
    width: "600px",
    borderRadius: "6px",
    margin: "20px",
    transition: "bottom 0.3s ease-in-out", // efeito suave
  }}
>
  * Preencha pelo menos o preço do produto e a quantidade em estoque
</div> 
            </div> : ""}
            
            {step === 8 ? <div>
                <div style={{flexDirection:"row",justifyContent:"space-evenly"}} className="secao-identificar-produto">
                <div className="container-cards-frete">
                
                <div className="card-valor-do-frete">
                
                    <h2>Confira o frete</h2>
                    
                    <div style={{marginBottom:"20px",display:"flex",flexDirection:"column",alignItems:"center",gap:"20px"}}>
                    <img src="/images/shop-frete.png" style={{width:"100px",height:"100px"}}/>
                    <p>Oferecer frete grátis?</p>
                    <div style={{display:"flex",gap:"10px",width:"300px"}}>
                    <input type="radio" checked={freteSelecionado === "frete-gratis"} value ={freteSelecionado} onChange={() => {setFreteSelecionado("frete-gratis");setPrecoFrete("")}}/><p>Quero oferecer frete grátis</p>
                    </div>
                    
                    <div style={{display:"flex",gap:"10px",width:"300px"}}>
                    <input type="radio" checked ={freteSelecionado === "frete-pago"} value={freteSelecionado} onChange={() => {setFreteSelecionado("frete-pago")}} /><p>Não oferecer frete grátis</p>
                    </div>
                    {freteSelecionado === "frete-pago" ? <p style={{marginTop:"-15px",fontSize:"12px",width:"300px"}}>*O comprador pagará pelo envio</p> : ""}
                    </div>
                    <div className="card-de-onde-sera-enviado">
                    <p>De onde será enviado o produto?</p>
                    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <p style={{position:"absolute",left:"10px",bottom:"5px"}}>CEP:</p><input minLength={8} maxLength={8} value = {cep} onBlur={() => {if(cep.length < 8){setErroCep("CEP deve ter 8 dígitos");setCidade("");setEstado(""); } else if(/^\d{8}$/.test(cep)){
                            calcularCidadeEstado(cep)}
                    }} onChange={(e) =>{setCep(e.target.value);setCidade("");setEstado("")}} style={{fontSize:"16px",borderTop:"none",borderRight:"none",borderLeft:"none",paddingLeft:"50px",width:"300px",paddingTop:"10px",paddingBottom:"10px",height:"35px",outline:"none"}}/>
                            
                    </div>
                    {erroCep && <p style={{color:"red"}}>{erroCep}</p>}
                    
                </div>
                {cidade && estado ? <div style={{width:"400px",display:"flex",gap:"10px",alignItems:"center"}}>
                    <img src="/images/gps.png" style={{width:"30px",height:"30px"}} /><p>Seu produto será enviado de <br/> {cidade}, {estado}.</p>
                    </div> : ""}
                </div>
                
                    </div>
                    <div className="card-resumo-anuncio">
                        <h2>Resumo do anúncio</h2>
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                        <p>Preço do produto</p>
                        <p>R$ {Number(precoProduto).toFixed(2)}</p>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                        <p>Frete</p>
                        <p style={{color:freteSelecionado === "frete-gratis" ? "green" : ""}}>{freteSelecionado === "frete-gratis" ? "Grátis" : "Calculado no checkout"}</p>
                        </div>
                        {precoProdutoPix ? <div style={{display:"flex",justifyContent:"space-between"}}>
                        <p>Preço no Pix</p>
                        <p style={{color:"green"}}>R${Number(precoProdutoPix).toFixed(2)}</p>
                        </div>: ""}
                        
                        <div style={{display:"flex",justifyContent:"space-between"}} >
                        <p>Você recebe</p>
                        <div>
                        {precoProdutoPix && aceitaPix === "sim" ? <p style={{color:"#3b9e62",marginLeft:"13px"}}>Entre R$ {Number(precoProdutoPix).toFixed(2) || Number(precoProduto).toFixed(2)} - R${Number(precoProduto).toFixed(2)} </p> : <p style={{color:"#3b9e62"}}>R${Number(precoProduto).toFixed(2)}</p>}
                        {freteSelecionado === "frete-gratis" ? <p style={{color:"red"}}>- R$ Valor do frete</p> : ""}
                        </div>
                        </div>
                        <div className="informacoes-anuncio-produto">
                            <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
                            {valorLink[0]!== "" && valorLink[0] !== undefined ? <img src={valorLink[0]} style={{width:"200px",height:"200px"}}/> : ""}
                            <div style={{width:"340px",display:"flex",justifyContent:"space-between",flexDirection:"column"}}>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p style={{fontWeight:"bold"}}>{nomeProduto ? `Nome:`: ""}</p>
                            <div style={{display:"flex",flexWrap:"wrap",gap:"5px",justifyContent:"end"}}>
                            <p style={{fontSize:"13px"}}>{nomeProduto}</p>
                            </div>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p style={{fontWeight:"bold"}}>{coresSelecionadas.length !== 0 ? `Cores:` : ""}</p>
                            <div style={{display:"flex",flexWrap:"wrap",gap:"5px",justifyContent:"end"}}>
                            {coresSelecionadas.map((item) => {return <p style={{fontSize:"13px"}}>{item}</p>})}
                            </div>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p style={{fontWeight:"bold"}}>{materiaisSelecionadas.length !== 0 ? `Materiais:` : ""}</p>
                            <div style={{display:"flex",flexWrap:"wrap",gap:"5px",justifyContent:"end"}}>
                            {materiaisSelecionadas.map((item) => {return <p style={{fontSize:"13px"}} >{item}</p>})}
                            </div>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p style={{fontWeight:"bold"}}>{largura || altura || comprimento ? `Dimensão:` : ""} </p>
                            <div style={{display:"flex",flexWrap:"wrap",gap:"5px",justifyContent:"end"}}>
                            <p style={{fontSize:"13px"}}>{largura ? `${largura} x`: ""} {altura ? `${altura} x` : ""} {comprimento ? `${comprimento}` : ""} {largura || altura || comprimento ? unidadeDimensoes : ""} </p>
                            </div>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p style={{fontWeight:"bold"}}>{estampasSelecionadas.length !== 0 ? `Estampas:` : ""}</p>
                            <div style={{display:"flex",flexWrap:"wrap",gap:"5px",justifyContent:"end"}}>
                            {estampasSelecionadas.map((item) => {return <p style={{fontSize:"13px"}}>{item}</p>})}
                            </div>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}} >
                            <p style={{fontWeight:"bold"}}>{generosSelecionados.length !== 0 ? `Generos:` : ""}</p>
                            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                            <p>{generosSelecionados.map((item) => {return <p style={{fontSize:"13px"}}>{item}</p>})}</p>
                            </div>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p style={{fontWeight:"bold"}}>{peso ? `Peso:` : ""}</p>
                            <p style={{fontSize:"13px"}}>{peso}{peso ? unidadePeso : ""}</p>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>  
                            <p style={{fontWeight:"bold"}}>{voltagensSelecionadas.length !== 0 ? `Voltagens:` : ""}</p>
                            <div style={{display:"flex",flexWrap:"wrap",gap:"5px",justifyContent:"end"}}>
                            <p>{voltagensSelecionadas.map((item => {return <p style={{fontSize:"13px"}}>{item}V</p>}))}</p>
                            </div>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p style={{fontWeight:"bold"}}>{tamanhosSelecionados.length !== 0 ? `Tamanhos:` : ""}</p>
                            <div style={{display:"flex",flexWrap:"wrap",gap:"5px",justifyContent:"end"}}>
                            <p>{tamanhosSelecionados.map((item) => {return <p style={{fontSize:"13px"}}>{item}</p>})}</p>
                            </div>
                            </div>
                            </div>
                            </div>
                            
                            <p>{estoque ? `Estoque:${estoque} unidades` : ""}</p>
                            <div onClick={() => {handleMostrarMaisInformacoes()}} style={{cursor:"pointer",display:"flex",gap:"20px",alignItems:"center"}}>
                            <p  style={{color:"rgb(52, 131, 250)"}}>Mostrar mais informações</p><img src="/images/setinha-dropdown-azul.png" style={{width:"16px",height:"16px"}}/>
                            </div>
                            <div style={{transition: 'opacity 0.3s ease', opacity: fade ? 1 : 0}}>
                            {mostrarMaisInformacoes ? <div>
                                <p>{opiniaoClientes ? `Opinião clientes:${opiniaoClientes.length > 20 ? opiniaoClientes.slice(0,17) + `...` : opiniaoClientes}` : ""}</p>
                            <p>{descricao ? `Descrição:${descricao.length > 20 ? descricao.slice(0,17) + `...` : descricao }`: ""}</p>
                            </div> : ""}
                        </div>
                        
                        </div>

                        <div style={{paddingTop:"20px",paddingBottom:"10px"}}>
                        <button onClick={() => {
                            if(cidade && estado){
                                handleNext();
                                handleAnunciarProduto()
                            }
                            else{
                                handleMostrarErroCep();
                            }
                            }} style={{cursor:"pointer",color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"100%",height:"50px",fontWeight:"bold"}}>Anunciar</button>
                        </div>
                    </div>
                       
            </div>
            <div
  style={{
    position: "fixed",
    bottom: erroCepIncompleto ? "20px" : "-150px", // começa fora da tela
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "red",
    color: "#ffffff",
    padding: "20px",
    width: "600px",
    borderRadius: "6px",
    margin: "20px",
    transition: "bottom 0.3s ease-in-out", // efeito suave
  }}
>
  * Preencha o cep de onde será enviado
</div> 
 </div>: ""}
             {step === 9 ? 
             <div className="secao-identificar-produto">
                 <div style={{backgroundColor:"#00a650",padding:"3rem",width:"100%",display:"flex",justifyContent:"center",alignItems:"center",gap:"100px"}}>
                 <h2 style={{color:"white"}}>Pronto!<br/>
                 Você concluiu o anúncio do produto</h2>
                 <img src="/images/verified-pagamento-aprovado.png" style={{width:"64px",height:"64px"}}/>
                 </div>
                 <div style={{width:"600px"}}className="card-condicoes-de-venda">
                     <div style={{display:"flex",flexDirection:"column",gap:"50px"}}>
                     <p style={{fontWeight:"bold"}}>Seu anúncio já está disponível para os resultados de busca</p>
                    <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
                        <img src={valorLink[0]} style={{width:"64px",height:"64px"}}/>
                        <p>{nomeProduto}</p>
                    </div>
                    <div style={{display:"flex",gap:"20px"}}>
                    <button onClick={() => {navigate(`/produto/${produtoId}`)}} style={{cursor:"pointer",color:"white",borderRadius:"6px",backgroundColor:"#3483fa",border:"none",width:"200px",height:"50px"}}>Ver anúncio</button>
                    <button onClick={() => {navigate(`/minha-conta/vendas`)}} style={{cursor:"pointer",borderRadius:"6px",color:"#3483fa",border:"none",width:"200px",height:"50px"}}>Ir para vendas</button>
                    </div>
                     
                     </div>
                 </div>
             </div> : ""}
                    
                    
            
            
            <Footer/>
        </div>
    )
}

export default PaginaAnunciarProduto;