import { useState } from 'react';
import './styles.css';

function MenuLateral({setMenuHover}) {
    
    const [menuCompras, setMenuCompras] =useState(false);
    const [menuVendas, setMenuVendas] =useState(false);
    const [menuMarketing, setMenuMarketing] =useState(false);
    const [menuFaturamento, setMenuFaturamento] =useState(false);
    const [menuConfiguracoes, setMenuConfiguracoes] =useState(false);
    const [mostrarMenus, setMostrarMenus] = useState(false);

    return(
        <div onMouseEnter={() => {setMostrarMenus(true);setMenuHover(true)}} onMouseLeave = {() => {setMostrarMenus(false);setMenuHover(false)}}className="menu-lateral">
                <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/menu-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Minha conta</p></div>
                </div>
                <div onClick={() => {setMenuCompras(!menuCompras)}} style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/bag-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Compras</p></div><img src="/images/setinha-dropdown-preta.png" style={{width:"30px",height:"30px"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"start",marginLeft:"50px",width:"250px"}}>
                    {menuCompras && mostrarMenus ? <div style={{display:"flex",flexDirection:"column",gap:"5px",paddingTop:"0px",paddingBottom:"20px"}}><p style={{fontSize:"13px"}}>Compras</p>
                    <p style={{fontSize:"13px"}}>Perguntas</p>
                    <p style={{fontSize:"13px"}}>Opiniões</p>
                    <p style={{fontSize:"13px"}}>Favoritos</p>
                    <p style={{fontSize:"13px"}}>Lista de presentes</p>
                    <p style={{fontSize:"13px"}}>Veículos e Imóveis</p>
                    <p style={{fontSize:"13px"}}>Buscas salvas</p></div> : ""}
                    </div>
                    <div onClick={() => {setMenuVendas(!menuVendas)}}style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/tag-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Vendas</p></div><img src="/images/setinha-dropdown-preta.png" style={{width:"30px",height:"30px"}}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"start",marginLeft:"50px",width:"200px"}}>
                    {menuVendas && mostrarMenus ? <div style={{display:"flex",flexDirection:"column",gap:"5px",paddingTop:"0px",paddingBottom:"20px"}}><p style={{fontSize:"13px"}}>Resumo</p>
                    <p style={{fontSize:"13px"}}>Novidades</p>
                    <p style={{fontSize:"13px"}}>Anúncios</p>
                    <p style={{fontSize:"13px"}}>Perguntas</p>
                    <p style={{fontSize:"13px"}}>Vendas</p>
                    <p style={{fontSize:"13px"}}>Pós-venda</p>
                    <p style={{fontSize:"13px"}}>Métricas</p>
                    <p style={{fontSize:"13px"}}>Reputação</p>
                    <p style={{fontSize:"13px"}}>Preferências de venda</p>
                    <p style={{fontSize:"13px"}}>Central de vendedores</p>
                    <p style={{fontSize:"13px"}}>Veículos e Imóveis</p></div> : ""}
                    </div>
                    <div onClick={() => {setMenuMarketing(!menuMarketing)}} style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/coupon-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Marketing</p></div><img src="/images/setinha-dropdown-preta.png" style={{width:"30px",height:"30px"}}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"start",marginLeft:"50px",width:"200px"}}>
                    {menuMarketing && mostrarMenus ? <div style={{display:"flex",flexDirection:"column",gap:"5px",paddingTop:"0px",paddingBottom:"20px"}}><p style={{fontSize:"13px"}}>Central de Marketing</p>
                    <p style={{fontSize:"13px"}}>Publicidade</p>
                    <p style={{fontSize:"13px"}}>Promoções</p>
                    <p style={{fontSize:"13px"}}>Minha página</p></div> : ""}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/pension-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Empréstimos</p></div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/circle-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Assinaturas</p></div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/test-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Bio livre</p></div>
                    </div>
                    <div onClick={() => {setMenuFaturamento(!menuFaturamento)}} style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/writing-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Faturamento</p></div><img src="/images/setinha-dropdown-preta.png" style={{width:"30px",height:"30px"}}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"start",marginLeft:"50px",width:"200px"}}>
                    {menuFaturamento && mostrarMenus ? <div style={{display:"flex",flexDirection:"column",gap:"5px",paddingTop:"0px",paddingBottom:"20px"}}><p style={{fontSize:"13px"}}>Tarifas e pagamentos</p>
                    <p style={{fontSize:"13px"}}>Emissor de NF-e</p></div> : ""}
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/user-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Meu perfil</p></div>
                    </div>
                    
                    <div onClick={() => {setMenuConfiguracoes(!menuConfiguracoes)}} style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:"25px"}}><img src="/images/settings-menu-lateral.png" style={{width:"25px",height:"25px"}}/><p className="paragrafo-menu-lateral">Configurações</p></div><img src="/images/setinha-dropdown-preta.png" style={{width:"30px",height:"30px"}}/>
                    
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"start",marginLeft:"50px",width:"200px"}}>
                    {menuConfiguracoes && mostrarMenus ? <p style={{fontSize:"13px"}}>Minhas marcas</p> : ""}
                    </div>
                </div>
    )
}

export default MenuLateral;