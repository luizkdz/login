import { useState } from 'react';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';


function PaginaAnunciarProduto(){
    const [nome,setNome] = useState("");

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

    const [quantidadeDeFotos,setQuantidadeDeFotos] = useState("");

    return (
        <div className="pagina-toda-anunciar-produto">
            <Header props="p"/>
            <div className="secao-anunciar-produto">
                <h2>O que você está anunciando?</h2>
                <div className="container-anunciar-produto">
                <div className="card-anunciar-produto">
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
                
            </div>
            <div className="secao-identificar-produto">
                <p>Etapa 1 de 2</p>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:"100px"}}>
                <h2>Vamos começar identificando seu <br/>produto</h2>
                <img src="/images/sneakers-pagina-anunciar.png" style={{width:"200px",height:"200px"}}/>
                </div>
                <div className="card-secao-identificar-produto">
                    <p>Indique o nome do produto e principais caracteristicas</p>
                    <div style={{display:"flex",flexDirection:"column"}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div style={{position:"relative",width:"100%"}}>
                    <input placeholder="Exemplo:celular nokia nomepesquisa etc" style={{width:"80%",height:"50px",borderRadius:"6px",border:"1px solid #c1c1c1",paddingLeft:"40px"}}/>
                    <img src="/images/search.png" style={{position:"absolute",left:"10px",top:"16px",width:"20px",height:"20px"}}/>
                    </div>
                    <button style={{height:"50px",width:"100px",backgroundColor:"#3483fa",border:"none",borderRadius:"6px",color:"white"}}>Próximo</button>
                    
                    </div>
                    <p style={{fontSize:"12px"}}>Adicione as principais caractéristicas do produto</p>
                    </div>
                </div>
                </div>
            </div>
            <div className="secao-identificar-produto">
                
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                
                <div className="card-informacoes-produto-pagina-anunciar">
                    <h2>Preencha as informações do seu produto</h2>
                    <div className="container-informacoes-produto-imagem-pagina-venda">
                    <div className="container-informacoes-produto-pagina-venda">
                    
                    <div>
                    <p style={{color:disableCor ? "grey" : ""}}>Cor</p>
                    <input disabled={disableCor} value = {cor} onChange={(e) => {setCor(e.target.value)}} style={{width:"200px",height:"40px",borderRadius:"6px",border:"1px solid #c1c1c1"}}/>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableCor} onChange={() => {setDisableCor(!disableCor);setCor("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableMaterial ? "grey" : ""}} >Material</p>
                    <input disabled={disableMaterial} value = {material} onChange={(e) => {setMaterial(e.target.value)}} style={{width:"200px",height:"40px",borderRadius:"6px",border:"1px solid #c1c1c1"}}/>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableMaterial} onChange={() => {setDisableMaterial(!disableMaterial);setMaterial("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label  style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableDimensao ? "grey" : ""}} >Dimensão</p>
                    <input disabled={disableDimensao} value = {dimensao} onChange={(e) => {setDimensao(e.target.value)}} style={{width:"200px",height:"40px",borderRadius:"6px",border:"1px solid #c1c1c1"}}/>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableDimensao} onChange={() => {setDisableDimensao(!disableDimensao);setDimensao("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableEstampa ? "grey" : ""}} >Estampa</p>
                    <input disabled={disableEstampa} value = {estampa} onChange={(e) => {setEstampa(e.target.value)}} style={{width:"200px",height:"40px",borderRadius:"6px",border:"1px solid #c1c1c1"}}/>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableEstampa} onChange={() => {setDisableEstampa(!disableEstampa);setEstampa("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableGenero ? "grey" : ""}} >Genero</p>
                    <input disabled={disableGenero} value = {genero} onChange={(e) => {setGenero(e.target.value)}} style={{width:"200px",height:"40px",borderRadius:"6px",border:"1px solid #c1c1c1"}}/>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableGenero} onChange={() => {setDisableGenero(!disableGenero);setGenero("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disablePeso ? "grey" : ""}} >Peso</p>
                    <input disabled={disablePeso} value = {peso} onChange={(e) => {setPeso(e.target.value)}} style={{width:"200px",height:"40px",borderRadius:"6px",border:"1px solid #c1c1c1"}}/>
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disablePeso} onChange={() => {setDisablePeso(!disablePeso);setPeso("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableVoltagem ? "grey" : ""}} >Voltagem</p>
                    <input disabled={disableVoltagem} value = {voltagem} onChange={(e) => {setVoltagem(e.target.value)}} style={{width:"200px",height:"40px",borderRadius:"6px",border:"1px solid #c1c1c1"}}/> 
                    <div style={{gap:"10px",top:"35px",right:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableVoltagem} onChange={() => {setDisableVoltagem(!disableVoltagem);setVoltagem("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhuma</label>
                    </div>
                    </div>
                    <div>
                    <p style={{color:disableTamanho ? "grey" : ""}} >Tamanho</p>
                    <input disabled={disableTamanho} value = {tamanho} onChange={(e) => {setTamanho(e.target.value)}} style={{width:"200px",height:"40px",borderRadius:"6px",border:"1px solid #c1c1c1"}}/> 
                    <div style={{gap:"10px",display:"flex",alignItems:"center"}}>
                    <input value = {disableTamanho} onChange={() => {setDisableTamanho(!disableTamanho);setTamanho("")}} style={{width:"16px",height:"16px"}}type="checkbox" id="naoTem"/>
                    <label style={{fontSize:"14px"}}htmlFor='naoTem'>Nenhum</label>
                    </div>
                    </div>
                    <button style={{color:"white",borderRadius:"6px",backgroundColor:"#3483fa",border:"none",width:"200px",height:"50px"}}>Próximo</button>
                    </div>
                    <img src="/images/ad-pop-up.png" style={{width:"250px",height:"250px"}}/>
                    </div>
                </div>
                <div className="card-informacoes-condicao-produto-pagina-anunciar">
                    <h2>Qual é a condição do seu produto?</h2>
                    <p className="paragrafo-condicao-produto"style={{padding:"20px"}}>Novo</p>
                    <p className="paragrafo-condicao-produto" style={{padding:"20px"}}>Usado</p>
                    <p className="paragrafo-condicao-produto" style={{padding:"20px"}}>Recondicionado</p>
                    <p className="paragrafo-condicao-produto" style={{padding:"20px"}}>Exclusivo</p>
                    <p className="paragrafo-condicao-produto" style={{padding:"20px"}}>Importado</p>
                    <p className="paragrafo-condicao-produto" style={{padding:"20px"}}>Digital</p>
                    <p className="paragrafo-condicao-produto" style={{padding:"20px"}}>Personalizado</p>
                    <p className="paragrafo-condicao-produto" style={{padding:"20px"}}>Licenciado</p>
                      
                </div>
                </div>
            </div>
            <div className="secao-identificar-produto">
                <h2>Adicione o link para as fotos</h2>
                <div style={{display:"flex",gap:"20px",alignItems:"center"}}>
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
            style={{
                width: '100%',
                height: '40px',
                borderRadius: '6px',
                border: '1px solid #c1c1c1',
                padding: '0 10px'
            }}
            onChange={(e) => console.log(`Imagem ${index + 1}:`, e.target.value)}
        />
    </div>
))}


    
</div>

</div>
<div style={{display:"flex",justifyContent:"end"}}>
<button style={{color:"white",borderRadius:"6px",backgroundColor:"#3483fa",border:"none",width:"200px",height:"50px"}}>Próximo</button>
</div>
</div>
            </div>
            
            
            <Footer/>
        </div>
    )
}

export default PaginaAnunciarProduto;