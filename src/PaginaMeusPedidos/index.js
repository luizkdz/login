import { useEffect, useState } from 'react';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import MenuLateral from '../componentes/menu-lateral';
import './styles.css';
import axios from 'axios';


function PaginaMeusPedidos(){

const [meusPedidos,setMeusPedidos] = useState([]);
const [pesquisa,setPesquisa] = useState("");
const [filtroSelecionado,setFiltroSelecionado] = useState("Todas");
const [quantidadeDeItens, setQuantidadeItens] = useState("");




const pesquisarEmMeusPedidos = async (filtroSelecionado = null) => {
    try{
        const resposta = await axios.get(`http://localhost:5000/meus-pedidos-pesquisa/${pesquisa}`, {
            params: { filtroSelecionado },
            withCredentials: true
          });
        
        const dados = resposta.data.dados;
        
        const pedidosMap = {};

        dados.forEach(item => {
            if (!pedidosMap[item.pedido_id]) {
                pedidosMap[item.pedido_id] = {
                    id: item.pedido_id,
                    data_pedido: item.data_pedido,
                    total: item.total,
                    itens: []
                };
            }
            pedidosMap[item.pedido_id].itens.push({
                item_id: item.id,
                produto_id: item.produto_id,
                url:item.url,
                nome: item.nome,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario,
                sub_total: item.sub_total
            });
        });

        const pedidosAgrupados = Object.values(pedidosMap);

        

        setMeusPedidos(pedidosAgrupados);
        setQuantidadeItens(resposta.data.quantidadeDePedidos);
    }
    catch(err){
        console.error("Não foi possível pesquisar")
    }
}


    const fetchMeusPedidos = async () => {
        try{
            const resposta = await axios.get("http://localhost:5000/meus-pedidos",{withCredentials:true});
            setMeusPedidos(resposta.data.dados);

            setQuantidadeItens(resposta.data.quantidadeDePedidos);
        }
        catch(err){
            console.error("Não foi possivel carregar seus pedidos");
        }
    }
    const dataFormatada = (data) => {
        const date = new Date(data);
        return date.toLocaleString();
    }

    const [menuHover,setMenuHover] = useState(false);
    const [open,setOpen] = useState(false);


    useEffect(() => {
        fetchMeusPedidos();
    },[]);

    return (
        <div className="pagina-toda-meus-pedidos">
            <Header props="p"/>
            <div className="secao-meus-pedidos">
                <div className={menuHover ? `container-meus-pedidos-inativo`: "container-meus-pedidos"}>
                    <MenuLateral setMenuHover={setMenuHover}/>
                    <div className={menuHover ? `container-inativo` : ""}></div>
                <div style={{display:"flex",margin:"0 auto",flexDirection:"column",padding:"20px"}}>
                <h2>Meus pedidos</h2>
                    <div style={{display:"flex",gap:"40px"}}>
                    <div style={{position:"relative",marginTop:"10px"}}>
                    <img onClick={() => {pesquisarEmMeusPedidos()}} src="/images/search.png" style={{position:"absolute",top:"7px",left:"10px",width:"20px",height:"20px"}}/>
                    <input value ={pesquisa} onChange = {(e) => setPesquisa(e.target.value)} placeholder="Buscar" style={{width:"300px",padding:"5px",paddingLeft:"40px",borderRadius:"16px",border:"2px solid #111111",backgroundColor:"rgba(0, 0, 0, .04)"}}/>
                    </div>
                    <div className="select-wrapper" onClick={() => {setOpen(!open)}}>
                    <img src="/images/filter.png" style={{width:"30px",height:"30px"}}/>
                    <select value={filtroSelecionado} onChange={(e) => {setFiltroSelecionado(e.target.value);pesquisarEmMeusPedidos(e.target.value);}} className="select-custom" style={{border:"none"}}>
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
                    <p>{quantidadeDeItens} compras</p>
                    </div>
                    </div>
                    {meusPedidos?.map((item) => {return (
                        <div className="card-meus-pedidos">
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div>
                        <p>ID do pedido</p>
                        <p>{item.id}</p>
                        </div>
                        <div>
                        <p>Pedido feito em : </p>
                        <p>{dataFormatada(item.data_pedido)}</p>
                        </div>
                        </div>
                        
                        <div style={{padding:"20px",borderRadius:"6px",backgroundColor:"#ffffff",display:"flex",flexDirection:"column",gap:"30px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:"10px",boxSizing:"border-box", borderBottom:"2px solid rgb(211, 218, 221)",paddingBottom:"20px"}}>
                            <p style={{fontSize:"14px"}}>Vendido por:</p><p style={{color:"rgb(0, 134, 255)"}}>Luiz</p>
                            </div>
                            <h3>Status pedido</h3>
                            {item.itens?.map((item) => {return (
                                <div style={{backgroundColor:"#ffffff", display:"flex",alignItems:"center",gap:"30px"}}>
                                <img src={item.url} style={{width:"100px",height:"100px"}}/>
                                <div>
                                    <p>{item.nome}</p>
                                    <p>Quantidade:{item.quantidade}</p>
                                    <p>{item.cor_nome ? `Cor:${item.cor_nome}` : ""}</p>
                                    

                                    <p></p>
                                </div>
                               
                                </div>
                            )})}
                            <button style={{backgroundColor:"#111111",border:"none",borderRadius:"6px",color:"#ffffff",width:"100%",height:"40px"}}>Ver detalhes</button>
                        </div>
                    </div>
                    )})}
                </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default PaginaMeusPedidos;