import { useEffect, useRef, useState } from 'react';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import MenuLateral from '../componentes/menu-lateral';
import Chart from 'chart.js/auto';
import './styles.css';
import axios from 'axios';

function PaginaVendas(){
        const [menuHover,setMenuHover] = useState(false);
        const [vendas,setVendas] = useState([]);

 const chartRef = useRef(null); // Referência para o gráfico
 const pieRef=useRef(null);
 const lineRef=useRef(null);
 const barInvertedRef=useRef(null);




const fetchVendas = async () => {
    try{
        const resposta = await axios.get("http://localhost:5000/carregar-vendas",{withCredentials:true});
        setVendas(resposta.data);
    }
    catch(err){
        console.log(err);
    }
}

const totalVendas = vendas.length;
const totalReceita = vendas.reduce((acc,venda)=> acc + venda.itens.reduce((item) => {return Number(item.preco_unitario * item.quantidade)}),0,0);
const clientesUnicos = new Set(vendas.map((item) => item.venda.id_comprador));
const totalClientes = clientesUnicos.size;
const mediaClientes = ((vendas.length)/totalClientes/(vendas.length));
const clientesRepetidos = vendas.length - (vendas.length/totalClientes);
const ticketMedio = (
  vendas.reduce((acc, venda) => acc + venda.venda.total, 0) / vendas.length
).toFixed(2);

    useEffect(() => {
        const ctx = document.getElementById('meuGrafico').getContext('2d');

        // Destroi o gráfico anterior se já existir
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Cria novo gráfico e guarda na ref
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Maio', 'Junho', 'Julho', 'Agosto'],
                datasets: [{
                    label: 'Vendas',
                    data: [totalVendas],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [totalVendas]);
     useEffect(() => {
        const ctx = document.getElementById('grafico-pizza').getContext('2d');

        // Destroi o gráfico anterior se já existir
        if (pieRef.current) {
            pieRef.current.destroy();
        }

        // Cria novo gráfico e guarda na ref
        pieRef.current = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
                datasets: [{
                    label: 'Total de Clientes',
                    data: [mediaClientes,clientesRepetidos],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [totalClientes]);
    useEffect(() => {
        const ctx = document.getElementById('grafico-linha').getContext('2d');

        // Destroi o gráfico anterior se já existir
        if (lineRef.current) {
            lineRef.current.destroy();
        }

        // Cria novo gráfico e guarda na ref
        lineRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
                datasets: [{
                    label: 'Ticket Médio',
                    data: [ticketMedio],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [ticketMedio]);
    useEffect(() => {
        const ctx = document.getElementById('grafico-barras-invertida').getContext('2d');

        // Destroi o gráfico anterior se já existir
        if (barInvertedRef.current) {
            barInvertedRef.current.destroy();
        }

        // Cria novo gráfico e guarda na ref
        barInvertedRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
                datasets: [{
                    label: 'Total Receita',
                    data: [totalReceita],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: false,
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [totalReceita]);

    useEffect(() => {
        fetchVendas();
    },[vendas]);



    return (
        <div className="pagina-toda-vendas">
            <Header props="p"/>
            <div>
            <div style={{display:"flex"}} className="secao-vendas">
            <MenuLateral menuHover={menuHover} setMenuHover={setMenuHover}/>
            <div className={menuHover ? `container-meus-pedidos-inativo`: "container-meus-pedidos"}>
                <div className={menuHover ? `container-inativo-pagina-vendas` : ""}></div>
            <div style={{width:"100%",display:"flex",flexDirection:"column",padding:"20px",paddingLeft:"50px"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                <h2>Vendas</h2>
                
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{display:"flex",gap:"20px"}}>
                <div className="card-dashboard-vendas">
                    <h3>Total de vendas</h3>
                    <p>{vendas.length}</p>
                </div>
                <div className="card-dashboard-vendas">
                    <h3>Ticket Médio</h3>
                    <p>R${ticketMedio}</p>
                </div>
                <div className="card-dashboard-vendas">
                    <h3>Clientes</h3>
                    <p>{totalClientes}</p>
                </div>
                <div className="card-dashboard-vendas">
                    <h3>Receita</h3>
                    <p>R${totalReceita.toFixed(2)}</p>
                </div>
                
                </div>
                <div className="card-perguntas">
                    <h3 style={{borderBottom:"1px solid grey"}}>Perguntas</h3>
                    <div style={{borderBottom:"1px solid grey",height:"50px"}}>
                    <p>Não há perguntas a responder</p>
                    </div>
                    <p style={{color:"rgb(0, 134, 255)"}}>Ir para perguntas</p>
                </div>
                <div className="card-perguntas">
                    <h3 style={{borderBottom:"1px solid grey"}}>Vendas para enviar</h3>
                    <div style={{borderBottom:"1px solid grey",height:"50px"}}>
                    <p>Você não tem vendas para enviar</p>
                    </div>
                    <p style={{color:"rgb(0, 134, 255)"}}>Ver vendas</p>
                </div>
                
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{width:"200px",padding:"10px",alignItems:"start"}}className="card-dashboard-vendas">
                    <div style={{display:"flex",alignItems:"center",gap:"10px",paddingBottom:"10px",paddingTop:"10px"}}><h3>Saldo:</h3><p style={{fontSize:"18px"}}>R${totalReceita.toFixed(2)}</p></div>
                    
                    <p style={{borderTop:"1px solid grey",color:"rgb(0, 134, 255)"}}>Ver na plataforma</p>
                </div>
                <div style={{display:"flex",gap:"260px",padding:"20px"}}>
                    <button style={{backgroundColor:"rgb(0, 134, 255)",border:"none",borderRadius:"6px",color:"#ffffff",width:"200px",height:"40px",fontWeight:"bold"}}>Novo anúncio</button>
                    <button style={{backgroundColor:"rgb(0, 134, 255)",border:"none",borderRadius:"6px",color:"#ffffff",width:"200px",height:"40px",fontWeight:"bold"}}>Meus anúncios</button>
                </div>
                </div>
                <div style={{display:"flex"}}>
                <div style={{marginTop:"20px",display:"flex",gap:"50px",width:"700px",flexWrap:"wrap"}}>
                <canvas style={{width:"300px",height:"200px"}} id="meuGrafico"></canvas>
                <canvas id="grafico-pizza" style={{width:"300px",height:"200px"}}></canvas>
                <canvas id="grafico-linha" style={{width:"300px",height:"200px"}}></canvas>
                <canvas id="grafico-barras-invertida" style={{width:"300px",height:"200px"}}></canvas>
                </div>
                <div style={{display:menuHover ? "none" : ""}}>
                <h3>Últimas vendas</h3>
                <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                {vendas.slice(-2).reverse().map((item,index) => {return (
                    <div className="card-vendas-produtos">
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                    <p style={{color:"green"}}>{item.venda.status_venda === "pago" ? "Pagamento Aprovado" : "Pagamento pendente"}</p>
                    <p>{item.venda.pedido_id}</p>
                    </div>
                    <p style={{color:"rgb(0, 134, 255)"}}>{item.itens[0].nome}</p>
                    <div style={{paddingTop:"20px",display:"flex",gap:"50px",alignItems:"center"}}>
                    <img src={item.itens[0].url} style={{width:"50px",height:"50px"}}/>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <p>Quantidade:</p>
                    <p>{item.itens[0].quantidade}</p>
                    </div>
                <button style={{backgroundColor:"#111111",border:"none",borderRadius:"6px",color:"#ffffff",width:"100%",height:"40px"}}>Ver detalhes</button>
                </div>
                <div style={{display:"flex",paddingTop:"20px"}}>
                {item.itens.length > 1 ? 
                <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                <p style={{color:"rgb(0, 134, 255)"}}>Ver outros itens desse pedido</p><img src="/images/right-chevron-blue.png" style={{width:"16px",height:"16px"}}/></div>: ""}
                
                </div>
                </div>
                )})}
                
                <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                <p style={{color:"rgb(0, 134, 255)"}}>Ver todas as vendas</p>
                <img src="/images/right-chevron-blue.png" style={{width:"16px",height:"16px"}}/>
                </div>
                
                </div>
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

export default PaginaVendas;