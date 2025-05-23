import { useEffect, useState } from 'react';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import MenuLateral from '../componentes/menu-lateral';
import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PaginaTodasAsVendas(){
    const navigate = useNavigate();
        const [menuHover,setMenuHover] = useState(false);
        const [vendas,setVendas] = useState([]);

const fetchVendas = async () => {
    try{
        const resposta = await axios.get("http://localhost:5000/carregar-vendas",{withCredentials:true});
        setVendas(resposta.data);
    }
    catch(err){
        console.log(err);
    }
}

useEffect(() => {
    fetchVendas();
},[vendas]);
    return (
        <div className="pagina-toda-vendas">
            <Header props="p"/>
            <div>
            <div style={{display:"flex"}} className="secao-vendas">
            <MenuLateral menuHover={menuHover} setMenuHover={setMenuHover}/>
            <div style={{display:"flex",justifyContent:"center",width:"100%"}}className={menuHover ? `container-meus-pedidos-inativo`: "container-meus-pedidos"}>
                <div className={menuHover ? `container-inativo-pagina-vendas` : ""}></div>
            <div style={{width:"100%",display:"flex",flexDirection:"column",padding:"20px",paddingLeft:"50px",alignItems:"center"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                <h2>Vendas</h2>
                
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                <div style={{width:"100%",padding:"20px",border:"2px solid #c1c1c1",backgroundColor:"#c1c1c1",borderRadius:"6px",display:"flex",alignItems:"center"}}>
                <img src="/images/megaphone.png" style={{width:"50px",height:"50px"}}/>
                <p style={{fontWeight:"bold"}}>Agora você pode acompanhar suas vendas</p>
                </div>
                <div style={{width:"100%",borderRadius:"6px",border:"2px solid #f0f0f0",display:"flex",justifyContent:"space-between"}}>
                
                <div style={{display:"flex",gap:"0px",width:"100%"}}>
                <div style={{width:"300px",padding:"20px",borderRight:"2px solid #c1c1c1"}}className="card-para-enviar">
                    <p style={{color:"rgb(0, 134, 255)"}}>Para preparar</p>
                    <p>0 vendas</p>
                </div>
                <div style={{width:"300px",padding:"20px",borderRight:"2px solid #c1c1c1"}} className="card-para-enviar">
                    <p style={{color:"rgb(0, 134, 255)"}}>Pronto para enviar</p>
                    <p>0 vendas</p>
                </div>
                <div style={{width:"300px",padding:"20px",borderRight:"2px solid #c1c1c1"}} className="card-para-enviar">
                    <p style={{color:"rgb(0, 134, 255)"}}>Em trânsito</p>
                    <p>0 vendas</p>
                </div>
                <div style={{width:"300px",padding:"20px"}} className="card-para-enviar">
                    <p style={{color:"rgb(0, 134, 255)"}}>Concluídas</p>
                    <p>0 vendas</p>
                </div>
                </div>
                
                
                </div>
                </div>
                <div style={{display:"flex",width:"100%",justifyContent:"center"}}>
                    <div style={{display:"flex",gap:"40px"}}>
                    <div style={{position:"relative",marginTop:"10px"}}>
                    <img src="/images/search.png" style={{position:"absolute",top:"7px",left:"10px",width:"20px",height:"20px"}}/>
                    <input placeholder="Buscar" style={{width:"300px",padding:"5px",paddingLeft:"40px",borderRadius:"16px",border:"2px solid #111111",backgroundColor:"rgba(0, 0, 0, .04)"}}/>
                    </div>
                    <div className="select-wrapper" >
                    <img src="/images/filter.png" style={{width:"30px",height:"30px"}}/>
                    <select className="select-custom" style={{border:"none"}}>
                        <option value="Todas">Todas</option>
                        <option value="Este mês">Este mês</option>
                        <option value="Mês passado">Mês passado</option>
                        <option value="Esse ano">Esse ano</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                    </select>
                    </div>
                    <div style={{display:"flex",alignItems:"center"}}>
                    <p>compras</p>
                    </div>
                    </div>
                </div>
                <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:"20px"}}>
                    {vendas.length > 0 ? vendas.slice().reverse().map((item,index) => {return (
                    <div>
                    <div style={{width:"100%"}} className="card-vendas-produtos">
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                    {item.venda.status_venda === "pago" ? <p style={{color:"green"}}>Pagamento Aprovado</p> : <p style={{color:"#FACC15"}}>Pagamento pendente</p>}
                    <p>Id venda: {item.venda.id}</p>
                    </div>
                    <p>Pedido Id: {item.venda.pedido_id}</p>
                    <div style={{display:"flex",gap:"20px"}}>
                    <p>Método pagamento</p>
                    {item.venda.metodo_pagamento === "Cartao" ? <img src="/images/contactless-metodos-pagamento.png" style={{width:"30px",height:"30px"}}/>: ""}
                    {item.venda.metodo_pagamento === "Boleto" ? <img src="/images/numbers-metodos-pagamento.png" style={{width:"30px",height:"30px"}}/>: ""}
                    <p>{item.venda.metodo_pagamento}</p> 
                    </div>
                    <div style={{display:"flex",gap:"20px"}}>
                    <p>Data da venda:</p>
                    <p>{new Date (item.venda.data_venda).toLocaleDateString()}</p>
                    </div>
                    <div style={{display:"flex",gap:"20px"}}>
                    <p>Parcelas:</p>
                    <p>{item.venda.parcelas}</p>
                    </div>
                    <div style={{display:"flex",gap:"20px"}}>
                    <p>Preço frete</p>
                    <p>R${item.venda.preco_frete.toFixed(2)}</p>
                    </div>
                    {item.itens.map((item) => {
                        
                        return(
                            <div style={{paddingTop:"20px",display:"flex",gap:"50px",alignItems:"center"}}>
                    
                    <img src={item.url} style={{width:"100px",height:"100px"}}/>
                    <div style={{width:"200px"}}>
                    <p style={{color:"rgb(0, 134, 255)"}}>{item.nome}</p>
                    </div>
                    <div style={{width:"300px",padding:"20px",borderBottom:"2px solid grey",display:"flex",flexWrap:"wrap",gap:"10px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <p>Preço</p>
                    <p>R${(item.quantidade * item.preco_unitario).toFixed(2)}</p>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <p>{item.quantidade ? `Quantidade:` : ""}</p>
                    <p>{item.quantidade}</p>
                    </div>
                    {item.cor_nome ? <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <p>{item.cor_nome ? `Cor:` : ""}</p>
                    <p>{item.cor_nome}</p>
                    </div>: ""}
                    {item.voltagem ? <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <p>{item.voltagem ? `Voltagem:` : ""}</p>
                    <p>{item.voltagem}</p>
                    </div>: ""}
                    
                    {item.dimensoes ? <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <p>{item.dimensoes ? `Dimensão:` : ""}</p>
                    <p>{item.dimensoes}</p>
                    </div> : ""}
                    {item.pesos ? <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <p>{item.pesos ? `Peso:` : ""}</p>
                    <p>{item.pesos}</p>
                    </div>: ""}
                    {item.generos ? <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <p>{item.generos ? `Genero:` : ""}</p>
                    <p>{item.generos}</p>
                    </div>: ""}
                    {item.estampas ? <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <p>{item.estampas ? `Estampa:` : ""}</p>
                    <p>{item.estampas}</p>
                    </div>: ""}
                    {item.tamanhos ? <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <p>{item.tamanhos ? `Tamanho:` : ""}</p>
                    <p>{item.tamanhos}</p>
                    </div>: ""}
                    {item.materiais ? <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <p>{item.materiais ? `Material:` : ""}</p>
                    <p>{item.materiais}</p>
                    </div>: ""}
                    </div>
                </div>
                        )
                    })}
                    
                    
                <div style={{display:"flex",paddingTop:"20px"}}>
                
                </div>
                <div style={{cursor:"pointer",display:"flex",backgroundColor:"#111111",border:"1px solid grey",borderRadius:"6px",padding:"20px",alignItems:"center",gap:"20px"}}>
                <img src="/images/user-blue.png" style={{width:"30px",height:"30px"}}/>
                <div>
                <p style={{color:"#f1f1f1"}}>ID comprador: {item.venda.id_comprador}</p>
                <p style={{color:"#f1f1f1"}}>Ver mensagens</p>
                </div>
                </div>
                </div>
                
                </div>
                
                )}): <div style={{display:"flex",flexDirection:"column",padding:"20px",alignItems:"center"}}>
                        <h2>Aqui aparecerá suas vendas quando você vender um produto</h2>
                        <img src="/images/trend.png" style={{marginTop:"20px",width:"200px",height:"200px"}}/>
                        <button onClick={() => {navigate("/minha-conta/vendas/anunciar")}} style={{marginTop:"20px",backgroundColor:"#111111",border:"none",borderRadius:"6px",color:"#ffffff",width:"100%",height:"40px"}}>Anuncie um novo produto</button>
                    </div>}
                </div>
            </div>
            
            </div>
            </div>
            </div>
            
            <Footer/>
            
        </div>
    )
}

export default PaginaTodasAsVendas;