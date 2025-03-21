import './styles.css';
import { useEffect, useState } from "react";
import axios from "axios";
import './styles.css';
import { useNavigate } from 'react-router-dom';




function Header({props}) {
    const [nome, setNome] = useState("");
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    const refreshAccessToken = async () => {
        try{
          const resposta = await axios.post("http://localhost:5000/renovarsessao", {}, { withCredentials: true });
          const token = resposta.data.token;
          return token;
        }
        catch(err){
          return null;
        }
      }
    const pickName = async () => {
        try {
          const resposta = await axios.get("http://localhost:5000/paginainicial", { withCredentials: true });
          if (resposta.data) {
            setNome(resposta.data.nome);
          }
          console.log("Nome recebido:", resposta.data);
        } catch (error) {     
          if ((error.response && error.response.status === 401) || (error.response && error.response.status === 403)){
            const novoTokenAcesso = await refreshAccessToken();
    
            if (novoTokenAcesso) {
              try {
                const novaResposta = await axios.get("http://localhost:5000/paginainicial", {withCredentials:true});
              
                if (novaResposta.data) {
                  setNome(novaResposta.data.nome);
                }
              } catch (novoErro) {
                console.error("Erro ao buscar nome após renovação do token:", novoErro);
                alert("Não foi possível renovar o token.");
              }
            } else {  
              console.warn("Token não pôde ser renovado. Usuário precisa fazer login novamente.");
            }
          }
        }
      };
      useEffect(() => {
        const fetchData = async () => {
          await pickName();
        };
        
      
        fetchData();
      }, []);
    
      const handleLogout = async () => {
        try{
            const resposta = await axios.post("http://localhost:5000/logout", {}, {withCredentials: true});
            
            alert(resposta.data.message);
        }
    
        catch(error){
            alert("Erro ao fazer logout");
        }
        navigate('/');
      }
    
      const showMenu = () => {
        return (
            <div>
                <h1>Oi</h1>
            </div>
        )
      }

    return (
        <header>
            <div className="nav-div">
                <img className="imagem-logo" src="./images/logo.svg" alt="Logo" />

                <div className="container-pesquisa">
                    {props && (
                        <div className="input-wrapper">
                            <input className="input-pesquisa" placeholder="Buscar produtos e marcas" />
                            <img className="icone-lupa" src="./images/lupa.png" alt="Buscar" />
                            <div className="nome-usuario">
                            </div>
                        </div>
                             
                    )}
                    {props && (
                        <div className="container-usuario"><p onClick={toggleMenu}> {nome}</p>
                        {menuAberto && (
                            <div className="dropdown-menu">
                                <ul>
                                    <li>Perfil</li>
                                    <li>Meus Pedidos</li>
                                    <li>Configurações</li>
                                    <li onClick={handleLogout}>Sair</li>
                                </ul>
                            </div>
                        )}
                            </div>
                    )}    
                </div>
            </div>
        </header>
    );
}

export default Header;