import './styles.css';
import { useEffect, useState } from "react";
import axios from "axios";
import './styles.css';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCep } from '../../context/CepContext';
import ModalCep from '../modalCep/ModalCep';
import { calcularFretePorCep } from '../../utils/calcularFretePorCep';

const chunkArray = (arr, size) => {
  return arr.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);
};

 


function Header({props, produto}) {


    const [nome, setNome] = useState("");
    const navigate = useNavigate();
    const {nomeProduto} = useParams();
    const [menuAberto, setMenuAberto] = useState(false);
    const [localidade, setLocalidade] = useState("Insira seu CEP");
    const [mostrarModal, setMostrarModal] = useState(false);
    const {cep} = useCep();
    const [valorFrete, setValorFrete] = useState("");
    const [prazo, setPrazo] = useState("");
    const [pesquisa, setPesquisa] = useState("");
    const [sugestoes, setSugestoes] = useState([]);
    const [inputFocado, setInputFocado] = useState(false);
    const location = useLocation();
    const [categorias,setCategorias] = useState([]);

    const carregarCategorias =async () => {
      try{
        const resposta = await axios.get("http://localhost:5000/carregarCategorias");
        setCategorias(resposta.data);
      }
      catch(err){
        console.error("Não foi possível carregar as categorias do menu");
      }
    }

    const enviarPesquisa = async () => {
      if(pesquisa.length > 3 && pesquisa!== ""){
        setSugestoes([]);
        navigate(`/busca-produto/${pesquisa}`,{state:{tipo:"busca"}});
      }
      
    }
    const mudarPesquisa = (e) => {
      setPesquisa(e.target.value);
    }
    
    const selecionarSugestao = (nome) => {
      setPesquisa(nome);
      setSugestoes([]);
      navigate(`/busca-produto/${nome}`,{state:{tipo:"busca"}});
    }

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    const abrirModal = () => {
      setMostrarModal(true);
    }
    const fecharModal = () => {
      setMostrarModal(false);
    }

    const fetchSugestoes =async () => {
      try{
      if(pesquisa.length >= 3 && inputFocado){
        const resposta = await axios.get(`http://localhost:5000/sugestoes-produto/${pesquisa}`)
        setSugestoes(resposta.data);
      }
      else{
        setSugestoes([]);
      }
      }
      catch(err){
        console.error("Não foi possível exibir as sugestões");
      }
      
    }

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
        carregarCategorias();
      },[]);

      useEffect(() => {
        
        fetchSugestoes();
        
      },[pesquisa]);

      useEffect(() => {
        setSugestoes([]);
      },[location.pathname]);
      useEffect(() => {
        const fetchData = async () => {
          await pickName();
        }
        const obterLocalidade = async () => {
          try {
            const resposta = await axios.get("http://localhost:5000/obter-localidade",{withCredentials:true});
            setLocalidade(resposta.data.localidade);
            
          }
          catch(err){
            console.log("Erro ao obter localidade", err);
          }
        };
        
        if(nomeProduto){
          setPesquisa(nomeProduto);
        }
        
        obterLocalidade();
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
  
    return (
        <header>
          <div className="nav-todo">
            <div className="container-links-topo">
              <a href="#">Nossos produtos</a>
              <a href="#">Nossas regras</a>
              <a href="#">Tenha um estabelecimento</a>
              <a href="#">Segurança e privacidade</a>
              <a href="#">Atendimento</a>
              <span>Compre pelo telefone: XXXXX-XXXX</span>
              <a href="#">Fale conosco</a>
              
              </div>
            <div className="nav-div">
                <img className="imagem-logo" src="/images/logo.svg" alt="Logo" />

                <div className="container-pesquisa">
                {props && (
    <>
      <div className="input-wrapper" style={{ position: 'relative' }}> 
        <input 
          className="input-pesquisa"
          onFocus={() => setInputFocado(true)}
          onChange={(e) => {mudarPesquisa(e); fetchSugestoes()}} 
          value={pesquisa} 
          placeholder="Buscar produtos e marcas" 
        />
        <img 
          className="icone-lupa" 
          src="/images/lupa.png" 
          alt="Buscar" 
          onClick={enviarPesquisa} 
        />

        {sugestoes.length > 0 && (
          <ul className="sugestoes-ul">
            {sugestoes.map((produto) => (
              <li 
                key={produto.id} 
                onClick={() => {setInputFocado(false);selecionarSugestao(produto.nome); setSugestoes([])}}
              >
                {produto.nome}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )}
                    <div className = "container-localidade">
                    <div className="ofertas-para" onClick={abrirModal} style={{ color: "white" , cursor: "pointer"}}>
                      <img src = "/images/localizacao-branco.png" className="imagem-localizacao-branco"/>
                    <div className="ofertas-cep">
                        <p>Ofertas para:<br/>{cep ? cep : localidade ? localidade : "Insira seu CEP"}</p>
                        
                      </div>
                      </div>
                          {mostrarModal && <ModalCep fecharModalCep={fecharModal} produtoId={produto?.id} calcularFretePorCep={calcularFretePorCep}  setLocalidade={setLocalidade}  setValorFrete={setValorFrete}  setPrazo={setPrazo}  />}
                            </div>
                    {props && (
                        <div className="container-usuario">
                          <div className="usuario-setinha">
                            <img className="imagem-notificacao" src = "/images/notification.png"/>
                            <img className="imagem-carrinho" src = "/images/carrinho-de-compras.png"/>
                            <p onClick={toggleMenu} className="nome-usuario"> {nome}</p>
                            <img className="imagem-dropdown" src="/images/setinha-dropdown.png"/>
                            </div>
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
            {props && (
              <div className="secao-links">
              <div className="container-menu-link">
                <div className="container-link-produtos">
                  <a className="link-secao-links">
                    Todos os produtos
                    <img className="imagem-dropdown-produtos" src="/images/setinha-dropdown.png" alt="Seta dropdown" />
                  </a>
                  <div className="menu-link-produtos">
                    <ul className="ul-produtos">
                      {categorias.slice(0,11).map((categoria, index) => {
                        const groupedItems = chunkArray(categoria.subcategorias, 5);
                        
                        return   (
                          
                        <div className="container-menu-submenu">
                       <li className="li-categorias" onClick={() => {navigate(`/busca-produto/${categoria.nome}`,{state:{tipo:"categoria"}});navigate(0)}}>{categoria.nome}</li>
                       <div className="submenu">
                        <div className="submenu-fileiras">
                       {groupedItems.map((group,index) => (
                <ul className="submenu-itens" key={index}>
                  {group.map((item, subIndex) => (
                 <li key={subIndex} onClick={() => {navigate(`/busca-produto/${item}`,{state:{tipo:"categoria"}}); navigate(0)}}>{item}</li>
                  ))}
        </ul>
      ))}
                       </div>
                       </div>
                       </div>
                      )})}
                    </ul>
                  </div>
                </div>
              </div>
        <div className="ofertas-container">
        <a href="#" className="link-secao-links">Ofertas
        <div className="menu-ofertas">
        <ul>
          <li>Oferta 1</li>
          <li>Oferta 2</li>
          <li>Oferta 3</li>
          </ul>
</div>
</a>

              </div>
              <div className="ofertas-container">
              <a className="link-secao-links">Imóveis
        <div className="menu-ofertas">
        <ul>
          <li>Oferta 1</li>
          <li>Oferta 2</li>
          <li>Oferta 3</li>
          </ul>
</div>
</a>
              </div>
              
              
              <div className="ofertas-container">
              <a className="link-secao-links">Eletrodomésticos
        <div className="menu-eletrodomesticos">
        <ul>
          <li>Oferta 1</li>
          <li>Oferta 2</li>
          <li>Oferta 3</li>
          </ul>
</div>
</a>
              </div>
              <div className="ofertas-container">
              <a className="link-secao-links">Informática
        <div className="menu-ofertas">
        <ul>
          <li>Oferta 1</li>
          <li>Oferta 2</li>
          <li>Oferta 3</li>
          </ul>
</div>
</a>
              </div>
              
              
              <div className="ofertas-container">
              <a className="link-secao-links">Televisão
        <div className="menu-ofertas">
        <ul>
          <li>Oferta 1</li>
          <li>Oferta 2</li>
          <li>Oferta 3</li>
          </ul>
</div>
</a>
              </div>
              
              <div className="ofertas-container">
              <a className="link-secao-links">Celulares
        <div className="menu-ofertas">
        <ul>
          <li>Oferta 1</li>
          <li>Oferta 2</li>
          <li>Oferta 3</li>
          </ul>
</div>
</a>
              </div>
              
            </div>
            )}
            
            </div>
        </header>
    );
}


export default Header;