import './styles.css';
import { useEffect, useState } from "react";
import axios from "axios";
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { useCep } from '../../context/CepContext';
import ModalCep from '../modalCep/ModalCep';
import { calcularFretePorCep } from '../../utils/calcularFretePorCep';

const categorias = [
  {
    nome: "Eletrônicos",
    subcategorias: [
      "Celulares", "Notebooks", "Tablets", "Smartwatches",
      "Câmeras", "Fones de ouvido", "Carregadores", "Drones"
    ]
  },
  {
    nome: "Eletrodomésticos",
    subcategorias: [
      "Geladeiras", "Fogões", "Máquinas de lavar", "Micro-ondas",
      "Aspiradores de pó", "Liquidificadores", "Cafeteiras", "Ventiladores"
    ]
  },
  {
    nome: "Móveis",
    subcategorias: [
      "Sofás", "Camas", "Guarda-roupas", "Escrivaninhas",
      "Cadeiras", "Mesas", "Estantes", "Poltronas"
    ]
  },
  {
    nome: "Roupas e Acessórios",
    subcategorias: [
      "Camisetas", "Calças", "Tênis", "Vestidos",
      "Casacos", "Meias", "Bonés", "Óculos de sol"
    ]
  },
  {
    nome: "Automotivo",
    subcategorias: [
      "Pneus", "Baterias", "Óleos e lubrificantes", "Som automotivo",
      "Acessórios para carro", "Capas e protetores", "Ferramentas", "Peças de reposição"
    ]
  },
  {
    nome: "Esportes e Lazer",
    subcategorias: [
      "Bicicletas", "Tênis esportivos", "Roupas esportivas", "Mochilas",
      "Suplementos", "Skates", "Bolas esportivas", "Halteres"
    ]
  },
  {
    nome: "Brinquedos",
    subcategorias: [
      "Bonecas", "Carrinhos", "Jogos de tabuleiro", "Quebra-cabeças",
      "Lego", "Pelúcias", "Brinquedos educativos", "Eletrônicos infantis"
    ]
  },
  {
    nome: "Beleza e Saúde",
    subcategorias: [
      "Maquiagem", "Perfumes", "Cremes e hidratantes", "Shampoos e condicionadores",
      "Escovas e pentes", "Aparelhos de barbear", "Esmaltes", "Protetor solar"
    ]
  },
  {
    nome: "Informática",
    subcategorias: [
      "Monitores", "Teclados", "Mouses", "Impressoras",
      "Placas de vídeo", "Memórias RAM", "HDs e SSDs", "Fontes de alimentação"
    ]
  },
  {
    nome: "Celulares e Smartphones",
    subcategorias: [
      "Smartphones", "Capas", "Películas", "Fones de ouvido",
      "Carregadores", "Baterias", "Suportes veiculares", "Cabo USB"
    ]
  },
  {
    nome: "Relógios e Acessórios",
    subcategorias: [
      "Relógios de pulso", "Relógios inteligentes", "Pulseiras", "Correntes",
      "Óculos", "Anéis", "Brincos", "Broches"
    ]
  },
  {
    nome: "Papelaria e Escritório",
    subcategorias: [
      "Cadernos", "Canetas", "Lápis", "Borrachas",
      "Estojos", "Pastas organizadoras", "Papel sulfite", "Post-it"
    ]
  },
  {
    nome: "Games e Consoles",
    subcategorias: [
      "Videogames", "Consoles", "Controles", "Headsets",
      "Jogos", "Gift Cards", "Cadeiras gamer", "Mousepads gamer"
    ]
  },
  {
    nome: "Câmeras e Filmadoras",
    subcategorias: [
      "Câmeras DSLR", "Filmadoras", "Lentes", "Cartões de memória",
      "Tripés", "Iluminação para foto", "Drones", "Bolsas para câmeras"
    ]
  },
  {
    nome: "Livros e Papelaria",
    subcategorias: [
      "Romances", "Ficção científica", "Livros técnicos", "Didáticos",
      "Autoajuda", "HQs e Mangás", "Infantil", "Agendas"
    ]
  },
  {
    nome: "Casa e Jardim",
    subcategorias: [
      "Ferramentas", "Eletroportáteis", "Utensílios domésticos", "Decoração",
      "Móveis", "Tapetes", "Luminárias", "Jardinagem"
    ]
  },
  {
    nome: "Supermercado",
    subcategorias: [
      "Bebidas", "Alimentos", "Higiene pessoal", "Limpeza",
      "Congelados", "Mercearia", "Doces e salgadinhos", "Produtos para pets"
    ]
  },
  {
    nome: "Bebês e Crianças",
    subcategorias: [
      "Fraldas", "Mamadeiras", "Brinquedos", "Roupas infantis",
      "Carrinhos de bebê", "Berços", "Mochilas infantis", "Cadeiras de alimentação"
    ]
  },
  {
    nome: "Ferramentas e Construção",
    subcategorias: [
      "Furadeiras", "Parafusadeiras", "Serras", "Chaves de fenda",
      "Martelos", "Trenas", "Niveladores", "Equipamentos de segurança"
    ]
  },
  {
    nome: "Pet Shop",
    subcategorias: [
      "Ração", "Petiscos", "Brinquedos para pets", "Camas",
      "Coleiras", "Areia higiênica", "Aquários", "Produtos de higiene pet"
    ]
  }
];

const chunkArray = (arr, size) => {
  return arr.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);
};

 


function Header({props, produto}) {


    const [nome, setNome] = useState("");
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    const [localidade, setLocalidade] = useState("Insira seu CEP");
    const [mostrarModal, setMostrarModal] = useState(false);
    const {cep} = useCep();
    const [valorFrete, setValorFrete] = useState("");
    const [prazo, setPrazo] = useState("");
    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    const abrirModal = () => {
      setMostrarModal(true);
    }
    const fecharModal = () => {
      setMostrarModal(false);
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
                        <div className="input-wrapper">
                            <input className="input-pesquisa" placeholder="Buscar produtos e marcas" />
                            <img className="icone-lupa" src="/images/lupa.png" alt="Buscar" />
                            
                            <div className="nome-usuario">
                            </div>
                        </div>
                             
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
                       <li className="li-categorias">{categoria.nome}</li>
                       <div className="submenu">
                        <div className="submenu-fileiras">
                       {groupedItems.map((group, index) => (
                <ul className="submenu-itens" key={index}>
                  {group.map((item, subIndex) => (
                 <li key={subIndex}>{item}</li>
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