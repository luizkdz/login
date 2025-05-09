import React, { useEffect, useRef, useState } from 'react';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';
import axios from 'axios';


function PaginaAnunciarProduto(){
    const [nomeProduto,setNomeProduto] = useState("");

    const [cor,setCor] = useState("");
    const [material,setMaterial] = useState("");
    const [dimensao,setDimensao] = useState("");
    const [estampa,setEstampa] = useState("");
    const [genero,setGenero] = useState("");
    const [peso,setPeso] = useState("");
    const [voltagem,setVoltagem] = useState("");
    const [tamanho,setTamanho] = useState("");

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
    const [condicaoProduto, setCondicaoProduto] = useState("");
    const [freteSelecionado, setFreteSelecionado] = useState("frete-gratis");

    const [step,setStep] = React.useState(1);
    const isPoppingState = useRef(false);

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
                <div onClick={() => {handleNext()}} className="card-anunciar-produto">
                    <img src="/images/sneakers-pagina-anunciar.png" className="imagem-card-anunciar-produto"/>
                    <p>Produtos</p>
                </div>
                <div className="card-anunciar-produto">
                    <img src="/images/car-pagina-anunciar.png" className="imagem-card-anunciar-produto"/>
                    <p>Veículos</p>
                </div>
                <div className="card-anunciar-produto">
                    <img src="/images/office-building-pagina-anunciar.png" className="imagem-card-anunciar-produto"/>
                    <p>Imóveis</p>
                </div>
                <div className="card-anunciar-produto">
                    <img src="/images/help-desk-pagina-anunciar.png" className="imagem-card-anunciar-produto"/>
                    <p>Serviços</p>
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
                    <button onClick={() => {handleNext()}} style={{height:"50px",width:"100px",backgroundColor:"#111111",border:"none",borderRadius:"6px",color:"white",fontWeight:"bold"}}>Próximo</button>
                    
                    </div>
                    <p style={{fontSize:"12px"}}>Adicione as principais caractéristicas do produto</p>
                    </div>
                </div>
                </div>
            </div>: ""}
            {step === 3 ? <div style={{flexDirection:"row",justifyContent:"space-evenly",padding:"3rem",paddingBottom:"100px"}} className="secao-identificar-produto">
                
                <div style={{display:"flex"}}>
                
                <div style={{height:"600px"}}className="card-informacoes-produto-pagina-anunciar">
                    <h2>Preencha as informações do seu produto</h2>
                    <div className="container-informacoes-produto-imagem-pagina-venda">
                    <div className="container-informacoes-produto-pagina-venda">
                    
                    <div>
                    <p style={{color:disableCor ? "grey" : ""}}>Cor</p>
                    <input disabled={disableCor} value = {cor} onChange={(e) => {setCor(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableCor} onChange={() => {setDisableCor(!disableCor);setCor("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableMaterial ? "grey" : ""}} >Material</p>
                    <input disabled={disableMaterial} value = {material} onChange={(e) => {setMaterial(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableMaterial} onChange={() => {setDisableMaterial(!disableMaterial);setMaterial("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label  style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableDimensao ? "grey" : ""}} >Comprimento</p>
                   
                    <div style={{position:"relative"}}>
                    <input disabled={disableDimensao} value = {dimensao} onChange={(e) => {setDimensao(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <select style={{position:"absolute",right:"0px",bottom:"10px"}}>
                        <option>Unidade</option>
                        <option>centímetros</option>
                        <option>metros</option>
                    </select>
                    </div>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableDimensao} onChange={() => {setDisableDimensao(!disableDimensao);setDimensao("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableDimensao ? "grey" : ""}} >Altura</p>
                    
                    <div style={{position:"relative"}}>
                    <input disabled={disableDimensao} value = {dimensao} onChange={(e) => {setDimensao(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <select style={{position:"absolute",right:"0px",bottom:"10px"}}>
                        <option>Unidade</option>
                        <option>centímetros</option>
                        <option>metros</option>
                    </select>
                    </div>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableDimensao} onChange={() => {setDisableDimensao(!disableDimensao);setDimensao("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableDimensao ? "grey" : ""}} >Largura</p>
                   
                    <div style={{position:"relative"}}>
                    <input disabled={disableDimensao} value = {dimensao} onChange={(e) => {setDimensao(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <select style={{position:"absolute",right:"0px",bottom:"10px"}}>
                        <option>Unidade</option>
                        <option>centímetros</option>
                        <option>metros</option>
                    </select>
                    </div>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableDimensao} onChange={() => {setDisableDimensao(!disableDimensao);setDimensao("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableEstampa ? "grey" : ""}} >Estampa</p>
                    <input disabled={disableEstampa} value = {estampa} onChange={(e) => {setEstampa(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableEstampa} onChange={() => {setDisableEstampa(!disableEstampa);setEstampa("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableGenero ? "grey" : ""}} >Genero</p>
                    <input disabled={disableGenero} value = {genero} onChange={(e) => {setGenero(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableGenero} onChange={() => {setDisableGenero(!disableGenero);setGenero("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disablePeso ? "grey" : ""}} >Peso</p>
                    <div style={{position:"relative"}}>
                    <input disabled={disablePeso} value = {peso} onChange={(e) => {setPeso(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    <select style={{position:"absolute",right:"0",bottom:"10px"}}>
                        <option>Unidade</option>
                        <option>kg</option>
                        <option>gramas</option>
                    </select>
                    </div>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disablePeso} onChange={() => {setDisablePeso(!disablePeso);setPeso("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableVoltagem ? "grey" : ""}} >Voltagem</p>
                    <input disabled={disableVoltagem} value = {voltagem} onChange={(e) => {setVoltagem(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/> 
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableVoltagem} onChange={() => {setDisableVoltagem(!disableVoltagem);setVoltagem("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableTamanho ? "grey" : ""}} >Tamanho</p>
                    <input disabled={disableTamanho} value = {tamanho} onChange={(e) => {setTamanho(e.target.value)}} style={{width:"200px",height:"40px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/> 
                    <div style={{gap:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableTamanho} onChange={() => {setDisableTamanho(!disableTamanho);setTamanho("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    
                    </div>
                    
                    </div>
                    </div>
                </div>
                <div style={{display:"flex",flexDirection:"column", height:"600px"}} className="container-card-informacoes-condicao-produto">
                <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
                <div style={{}}className="card-informacoes-condicao-produto-pagina-anunciar">
                <h2>Qual é a condição do seu produto?</h2>
                    <p onClick={() => {trocarImagem("/images/giftbox.png");setCondicaoProduto("novo")}}className="paragrafo-condicao-produto"style={{backgroundColor:condicaoProduto === "novo" ? "#f1f1f1" : "", padding:"20px"}}>Novo</p>
                    <p onClick={() => {trocarImagem("/images/receiving.png");setCondicaoProduto("usado")}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === "usado" ? "#f1f1f1" : "",padding:"20px"}}>Usado</p>
                    <p onClick={() => {trocarImagem("/images/product.png");setCondicaoProduto("recondicionado")}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === "recondicionado" ? "#f1f1f1" : "",padding:"20px"}}>Recondicionado</p>
                    <p onClick={() => {trocarImagem("/images/exclusive.png");setCondicaoProduto("exclusivo")}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === "exclusivo" ? "#f1f1f1" : "",padding:"20px"}}>Exclusivo</p>
                    <p onClick={() => {trocarImagem("/images/transport.png");setCondicaoProduto("importado")}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === "importado" ? "#f1f1f1" : "",padding:"20px"}}>Importado</p>
                    <p onClick={() => {trocarImagem("/images/social-media.png");setCondicaoProduto("digital")}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === "digital" ? "#f1f1f1" : "",padding:"20px"}}>Digital</p>
                    <p onClick={() => {trocarImagem("/images/personalized.png");setCondicaoProduto("personalizado")}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === "personalizado" ? "#f1f1f1" : "",padding:"20px"}}>Personalizado</p>
                    <p onClick={() => {trocarImagem("/images/licensing.png");setCondicaoProduto("licenciado")}} className="paragrafo-condicao-produto" style={{backgroundColor:condicaoProduto === "licenciado" ? "#f1f1f1" : "", padding:"20px"}}>Licenciado</p>
                      
                </div>
                <img src={imagemCondicaoProduto} style={{width:"100px",height:"100px",objectFit: 'cover',
                    transition: 'opacity 0.3s ease',
                    opacity: fade ? 1 : 0}}/>
                </div>
                <div style={{display:"flex",justifyContent:"end",paddingTop:"3rem",paddingBottom:"3rem"}}>
                <button onClick={() => {handleNext()}} style={{color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"200px",height:"50px",fontWeight:"bold"}}>Próximo</button>
                </div>
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
<button onClick={() => {handleNext()}} style={{color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"200px",height:"50px",fontWeight:"bold"}}>Próximo</button>
</div>
</div>
<div style={{display:"flex",justifyContent:"end"}}>

</div>
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
                        
                        <button onClick={() => {handleNext()}} style={{marginTop:"20px",marginBottom:"20px",color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"200px",height:"50px",fontWeight:"bold"}}>Próximo</button>
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
                        <button onClick={() => {handleNext()}} style={{marginTop:"20px",marginBottom:"20px",color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"200px",height:"50px",fontWeight:"bold"}}>Próximo</button>
                        </div>
                        
                    </div>: ""}
            {step === 7 ? <div className="secao-identificar-produto">
            <p>Etapa 2 de 2</p>
                <div style={{display:"flex",alignItems:"center",gap:"100px"}}>
                <h2>Para concluir,<br/>
                vamos definir as condições de venda</h2>
                <img src="/images/online-shop.png" style={{width:"200px",height:"200px"}}/>
                </div>
                <div className="card-condicoes-de-venda">
                    <div style={{display:"flex",flexDirection:"column",gap:"50px"}}>
                    <p>Qual é o preço do seu produto?</p>
                    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <p style={{position:"absolute"}}>R$</p><input type="number" value={precoProduto} onChange={(e) => {const val = e.target.value; if(val.length < 8) setPrecoProduto(val)}} style={{paddingLeft:"25px",width:"200px",height:"30px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    </div>
                    <p style={{fontSize:"12px"}}>*Lembre-se isso não inclui o valor do frete</p>
                    <p>Quantas unidades você tem disponível para venda?</p>
                    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <p style={{position:"absolute",right:"170px"}}>unidades</p><input type="number" value = {estoque} onChange={(e) => {const val = e.target.value; if(val.length < 8) setEstoque(val);}}style={{paddingLeft:"25px",width:"200px",height:"30px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"end"}}>
                    <button onClick={() => {handleNext()}} style={{color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"100%",height:"50px",fontWeight:"bold"}}>Próximo</button>
                    </div>
                    </div>
                </div>
            </div> : ""}
            
            {step === 8 ? <div>
                <div style={{flexDirection:"row",justifyContent:"space-evenly"}} className="secao-identificar-produto">
                <div className="container-cards-frete">
                
                <div className="card-valor-do-frete">
                
                    <h2>Confira o valor do frete</h2>
                    
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"20px"}}>
                    <img src="/images/shop-frete.png" style={{width:"100px",height:"100px"}}/>
                    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <p style={{color:freteSelecionado === "frete-gratis" ? "grey" : "", position:"absolute"}}>R$</p><input type="number" disabled={freteSelecionado === "frete-gratis"} value= {precoFrete} onChange={(e) => {const val = e.target.value; if(val.length < 8) setPrecoFrete(val)}} style={{paddingLeft:"25px",width:"200px",height:"30px",borderTop:"none",borderRight:"none",borderLeft:"none",outline:"none"}}/>
                    </div>
                    <p>Oferecer frete grátis?</p>
                    <div style={{display:"flex",gap:"10px",width:"300px"}}>
                    <input type="radio" checked={freteSelecionado === "frete-gratis"} value ={freteSelecionado} onChange={() => {setFreteSelecionado("frete-gratis");setPrecoFrete("")}}/><p>Quero oferecer frete grátis</p>
                    </div>
                    
                    <div style={{display:"flex",gap:"10px",width:"300px"}}>
                    <input type="radio" checked ={freteSelecionado === "frete-pago"} value={freteSelecionado} onChange={() => {setFreteSelecionado("frete-pago")}} /><p>Não oferecer frete grátis</p>
                    </div>
                    <p style={{fontSize:"12px",width:"300px"}}>O comprador pagará pelo envio</p>
                    </div>
                    <div className="card-de-onde-sera-enviado">
                    <p>De onde será enviado o produto?</p>
                    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <p style={{position:"absolute",left:"10px",bottom:"5px"}}>CEP:</p><input minLength={8} maxLength={8} value = {cep} onBlur={() => {if(cep.length < 8){setErroCep("CEP deve ter 8 dígitos") } else if(/^\d{8}$/.test(cep)){
                            calcularCidadeEstado(cep)}
                    }} onChange={(e) =>{setCep(e.target.value)}} style={{fontSize:"16px",borderTop:"none",borderRight:"none",borderLeft:"none",paddingLeft:"50px",width:"300px",paddingTop:"10px",paddingBottom:"10px",height:"35px",outline:"none"}}/>
                            
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
                        <div style={{display:"flex",justifyContent:"space-between"}} >
                        <p>Preço Frete</p>
                        <p>{precoFrete != 0 ? `R$ ${Number(precoFrete).toFixed(2)}` : "Frete grátis"}</p>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between"}} >
                        <p>Você recebe</p>
                        <p style={{color:"#3b9e62"}}>R$ {calcularPrecoTotal()?.toFixed(2)} </p>
                        </div>
                        <div className="informacoes-anuncio-produto">
                            <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
                            {valorLink[0]!== "" && valorLink[0] !== undefined ? <img src={valorLink[0]} style={{width:"200px",height:"200px"}}/> : ""}
                            <div style={{width:"100%",display:"flex",justifyContent:"space-between",flexDirection:"column"}}>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p>Nome:</p>
                            <p >{nomeProduto}</p>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p>Cor:</p>
                            <p >{cor}</p>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p>Material:</p>

                            <p>{material}</p>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p>Dimensão:</p>
                            <p >{dimensao}</p>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p>Estampa:</p>
                            <p >{estampa}</p>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}} >
                            <p>Genero:</p>
                            <p >{genero}</p>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p>Peso:</p>
                            <p >{peso}</p>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>  
                            <p>Voltagem:</p>
                            <p >{voltagem}</p>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between"}}>
                            <p>Tamanho</p>
                            <p>{tamanho}</p>
                            </div>
                            </div>
                            </div>
                            
                            <p>{estoque ? `Estoque:${estoque} unidades` : ""}</p>
                            <div style={{display:"flex",gap:"20px",alignItems:"center"}}>
                            <p onClick={() => {handleMostrarMaisInformacoes()}} style={{color:"rgb(52, 131, 250)"}}>Mostrar mais informações</p><img src="/images/setinha-dropdown-azul.png" style={{width:"16px",height:"16px"}}/>
                            </div>
                            <div style={{transition: 'opacity 0.3s ease', opacity: fade ? 1 : 0}}>
                            {mostrarMaisInformacoes ? <div>
                                <p>{opiniaoClientes ? `Opinião clientes:${opiniaoClientes.length > 20 ? opiniaoClientes.slice(0,17) + `...` : opiniaoClientes}` : ""}</p>
                            <p>{descricao ? `Descrição:${descricao.length > 20 ? descricao.slice(0,17) + `...` : descricao }`: ""}</p>
                            </div> : ""}
                        </div>
                        
                        </div>

                        <div style={{paddingTop:"20px",paddingBottom:"10px"}}>
                        <button onClick={() => {handleNext()}} style={{color:"white",borderRadius:"6px",backgroundColor:"#111111",border:"none",width:"100%",height:"50px",fontWeight:"bold"}}>Anunciar</button>
                        </div>
                    </div>
                       
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
                    <button onClick={() => {handleNext()}} style={{color:"white",borderRadius:"6px",backgroundColor:"#3483fa",border:"none",width:"200px",height:"50px"}}>Ver anúncio</button>
                    <button onClick={() => {handleNext()}} style={{borderRadius:"6px",color:"#3483fa",border:"none",width:"200px",height:"50px"}}>Ir para vendas</button>
                    </div>
                     
                     </div>
                 </div>
             </div> : ""}
                    
                    
            
            
            <Footer/>
        </div>
    )
}

export default PaginaAnunciarProduto;