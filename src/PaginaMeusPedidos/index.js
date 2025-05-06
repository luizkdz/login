import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';


function PaginaMeusPedidos(){
    return (
        <div className="pagina-toda-meus-pedidos">
            <Header props="p"/>
            <div className="secao-meus-pedidos">
                <div className="container-meus-pedidos">
                <div style={{display:"flex",margin:"0 auto",flexDirection:"column",padding:"20px"}}>
                <p>Meus pedidos</p>
                    <div style={{display:"flex",gap:"40px"}}>
                    <input placeholder="busca"/>
                    <select>
                        <option>Filtro</option>
                    </select>
                    <p>Total compras</p>
                    </div>
                    <div className="card-meus-pedidos">
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                        <p>Id do pedido</p>
                        <div>
                        <p>Pedido feito em : </p>
                        <p>Data</p>
                        </div>
                        </div>
                        
                        <div style={{padding:"20px",borderRadius:"6px",backgroundColor:"#ffffff",display:"flex",flexDirection:"column",gap:"30px"}}>
                            <div style={{display:"flex",alignItems:"center",gap:"10px",boxSizing:"border-box", borderBottom:"2px solid rgb(211, 218, 221)",paddingBottom:"20px"}}>
                            <p style={{fontSize:"14px"}}>Vendido por:</p><p style={{color:"rgb(0, 134, 255)"}}>Luiz</p>
                            </div>
                            <h3>Status pedido</h3>
                            <div style={{backgroundColor:"#ffffff", display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <img src="" style={{width:"80px",height:"80px"}}/>
                            <div>
                                <p>Nome do produto</p>
                            </div>
                            <button style={{backgroundColor:"#111111",border:"none",borderRadius:"6px",color:"#ffffff",width:"300px",height:"40px"}}>Ver detalhes</button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default PaginaMeusPedidos;