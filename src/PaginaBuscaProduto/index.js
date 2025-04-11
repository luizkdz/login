import { useEffect, useState } from 'react';
import FiltroDropDown from '../componentes/filtro-dropdown';
import Footer from '../componentes/footer';
import Header from '../componentes/header';
import './styles.css';
import CardPaginaBuscaProduto from '../componentes/card-pagina-busca-produto';
import axios from 'axios';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { calcularPrecoParcelado } from '../utils/calcularPrecoParcelado';
import { useCep } from '../context/CepContext';
import { calcularFretePorCep } from '../utils/calcularFretePorCep';
import { useParams } from 'react-router-dom';
import FiltroPrecoRange from '../componentes/filtroRangePreco';

function PaginaBuscaProduto() {

  const [filtroSelecionado, setFiltroSelecionado] = useState({
    preco: { min: 15, max: 4000 },  // mantém o objeto para intervalo de preço
    marcas: [],                    // array
    categoria: [],                 // array (mude de string para array se for possível escolher múltiplas categorias)
    promocoes: [],                 // array
    entrega: [],                   // array
    avaliacao: [],                 // array (se for múltiplas avaliações, mude para array de notas)
    vendidoPor: [],                // array
    tipoCompra: [],                // array (mude de string para array se for múltiplos tipos de compra)
    tipoProduto: []                // array
  });

  
  
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const filtrosURL = new URLSearchParams(searchParams);
  let filtrosURLObj = Object.fromEntries(filtrosURL.entries());
  
  const atualizarFiltro = (nomeFiltro,valor) => {
    const atual = searchParams.get(nomeFiltro);
    
    if(atual === valor){
      params.delete(nomeFiltro);
    }
    else{
      params.set(nomeFiltro,valor);
    }
    setSearchParams(params);
    return {atualizarFiltro}
  }
  const atualizarFiltroArray = (nomeFiltro, valor) => {
    const atuais = searchParams.get(nomeFiltro)?.split(',') || [];
  
    const novosValores = atuais.includes(valor)
      ? atuais.filter((item) => item !== valor)
      : [...atuais, valor];
  
    if (novosValores.length === 0) {
      params.delete(nomeFiltro);
    } else {
      params.set(nomeFiltro, novosValores.join(','));
    }
  
    setSearchParams(params);
  };



  const mapTituloParaFiltro = {
    "Marcas": "marcas",
    "Promoções": "promocoes",
    "Entrega": "entrega",
    "Categoria": "categoria",
    "Avaliação": "avaliacao",
    "Vendido por": "vendidoPor",
    "Tipo de Compra": "tipoCompra",
    "Tipo de Produto": "tipoProduto",
    "Preço": "preco",
  }

  const [ordenarPor,setOrdenarPor] = useState("nome");
  const enviarFiltro =async () => {

    const filtrosURL = new URLSearchParams();
    
  let novosFiltros = {...filtroSelecionado}

  if (range[0] && range[1]) {
  filtrosURL.set('precoMin', range[0].toString());
  filtrosURL.set('precoMax', range[1].toString());
  console.log(`Os filtros são :`,filtrosURL);
}


Object.keys(novosFiltros).forEach((key) => {
  const filtro = novosFiltros[key];
  if (filtro && filtro.length > 0) {
    filtrosURL.set(key, filtro.join(','));
  }
});

  filtrosURLObj = Object.fromEntries(filtrosURL.entries());
  
      try{
        const resposta = await axios.get("http://localhost:5000/opcoes-filtros", {params: {...filtrosURLObj,localidade}});
        setProdutos(resposta.data);
      }
      catch(err){
        console.error("Não foi possível enviar o filtro");
      }
  }

    const {nomeProduto} = useParams();
    const [produtos,setProdutos] = useState([]);
    const {cep} = useCep();
    const [localidade,setLocalidade] = useState("");
    const [setValor] = useState("");
    const [setPrazo] = useState("");
    const [filtros, setFiltros] = useState([]);
    const location = useLocation();
    const tipo = location.state?.tipo;
    const [range, setRange] = useState([0,0]);

    const fetchFiltros = async () => {
      try{
        const resposta = await axios.get("http://localhost:5000/filtros");
        const data = resposta.data;
        const filtrosFormatados = [
          
          { titulo: 'Categoria', itens: data.categorias, isCheckBox: false },
          { titulo: 'Marcas', itens: data.marcas, isCheckBox: true },
          { titulo: 'Promoções', itens: data.promocoes, isCheckBox: true },
          { titulo: 'Preço', itens: data.preco, isCheckBox: false},
          { titulo: 'Entrega', itens: data.entregas, isCheckBox: true },
          { titulo: 'Vendido por', itens: data.vendidoPor, isCheckBox: true },
          { titulo: 'Tipo de Compra', itens: data.tipoCompra, isCheckBox: true },
          { titulo: 'Tipo de Produto', itens: data.tipoProduto, isCheckBox: true },
          { titulo: 'Avaliação', itens: data.avaliacao, isCheckBox: true },
        ];
        setFiltros(filtrosFormatados);
      }
      catch(err){
        console.error("Não foi possivel carregar as categorias", err);
      }
    }

    const fetchProducts = async () => {

      

      if (range[0] && range[1]) {
        filtrosURL.set('precoMin', range[0].toString());
        filtrosURL.set('precoMax', range[1].toString());
      }
      console.log('Filtros aplicados:', filtrosURL);
      try {
        console.log(nomeProduto);
        if (nomeProduto) {
          const respostaProduto = await axios.get(`http://localhost:5000/busca-produto/${encodeURIComponent(nomeProduto)}`
        ,{params:filtrosURL});
          setProdutos(respostaProduto.data);
        } else {
          const resposta = await axios.get(`http://localhost:5000/produtos?localidade=${encodeURIComponent(localidade)}`,{params:filtrosURL});
          setProdutos(resposta.data);
        }
      } catch (err) {
        console.error("Erro ao buscar produtos", err);
      }
    }

    const handleOrdenarPor = async (categoria) => {
      let novosFiltros = {...filtroSelecionado}

      if (range[0] && range[1]) {
        filtrosURL.set('precoMin', range[0].toString());
        filtrosURL.set('precoMax', range[1].toString());
      }
      Object.keys(novosFiltros).forEach((key) => {
        const filtro = novosFiltros[key];
        if (filtro && filtro.length > 0) {
          filtrosURL.set(key, filtro.join(','));
        }
      });
      
        filtrosURLObj = Object.fromEntries(filtrosURL.entries());
    
      try{
        const resposta = await axios.get("http://localhost:5000/opcoes-filtros", {params:{...filtrosURLObj,localidade,ordenarPor:categoria}})
        setProdutos(resposta.data);
        atualizarFiltro("ordenarPor",categoria);
      }
      catch(err){
        console.error(`Erro ao ordernar por ${categoria}`);
      }
    }

  useEffect(() => {
    fetchFiltros();
  },[])
  useEffect(() => {
    const page= searchParams.get('page');
    const precoMin = searchParams.get('precoMin');
    const precoMax = searchParams.get('precoMax');
    if(page){
      setPaginaAtual(Number(page));
    }
    if(precoMin && precoMax){
        setRange([Number(precoMin), Number(precoMax)])
      }
    },
    [searchParams]);
      
    
    useEffect( () => {
      if (cep && produtos.length > 0) {
          produtos.forEach((produto) => {
              calcularFretePorCep(produto.produto_id, cep, setLocalidade, setValor, setPrazo);
          });
      }
  }, [cep, produtos]);

  useEffect(() => {
    if (filtros.length > 0) {
      const filtroPreco = filtros.find(({ titulo }) => titulo === "Preço");
      if (filtroPreco && filtroPreco.itens) {
        setRange([filtroPreco.itens.min, filtroPreco.itens.max]);  // Atualiza o range apenas se "Preço" for encontrado
      }
    }
  }, [filtros]);
  useEffect(() => {
    fetchProducts();
},[nomeProduto,localidade])


    const [indice,setIndice] = useState(0);
    const produtosPorPagina = 8;
    const[paginaAtual, setPaginaAtual] = useState(1);
    const escolhaFiltro = filtros.find(({ titulo }) => titulo === "Preço");
    
;

    const totalPaginas = Math.ceil(produtos.length/produtosPorPagina);
    const indiceInicial = (paginaAtual - 1) * produtosPorPagina;
    const indiceFinal = indiceInicial + produtosPorPagina;
    const produtosPaginados = produtos.slice(indiceInicial,indiceFinal);

    const limitePaginasVisiveis = 5;

    const calcularPaginasVisiveis = () => {
        const metade = Math.floor(limitePaginasVisiveis / 2);
        let inicio, fim;
    
        // Se a página atual está no início, mostramos as primeiras páginas
        if (paginaAtual <= metade) {
          inicio = 1;
          fim = Math.min(totalPaginas, limitePaginasVisiveis);
        }
        // Se a página atual está no final, mostramos as últimas páginas
        else if (paginaAtual >= totalPaginas - metade) {
          fim = totalPaginas;
          inicio = Math.max(1, totalPaginas - limitePaginasVisiveis + 1);
        }
        // Caso contrário, mantemos a página atual centralizada
        else {
          inicio = Math.max(1, paginaAtual - metade);
          fim = Math.min(totalPaginas, paginaAtual + metade);
        }
    
        return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
      };
    



        const itensVisiveis = 2;
    
        const avancar = () => {
            if(indice + itensVisiveis < produtos.length){
                setIndice(indice+2);    
            }
            else{
                setIndice(0);
            }
        };
    
        const voltar = () => {
            if(indice > 0){
                setIndice(indice - 2);
            }
            else{
                setIndice(produtos.length - itensVisiveis)
            }
        }
    

        const navigate = useNavigate();
        const redirectProduct = (id) => {
        navigate(`/produto/${id}`)
    }
    
    return (
        <div className="pagina-toda-busca-produto">
            <Header props/>
            <div className="secao-ferramentas">
            <div className="secao-busca-produto">
                {tipo === "categoria" ? <h1 className="nome-categoria">{nomeProduto}</h1> : ""}
                {filtros.map(({titulo, itens, isCheckBox }) => {
                  const chaveFiltro = mapTituloParaFiltro[titulo];
                return (
                  titulo === "Preço" ? <FiltroPrecoRange searchParams={searchParams} range={range} setRange={setRange} min ={itens.min} max={itens.max} onClick={() => {atualizarFiltro("precoMin", filtroSelecionado.preco.min);atualizarFiltro("precoMax", filtroSelecionado.preco.max);enviarFiltro()}} onChange={(valor) => {setFiltroSelecionado((prev) => ({
                    ...prev,
                    preco:{min:valor[0],max:valor[1]}
                }))}} key={titulo} /> :
                    <FiltroDropDown params={params} setSearchParams={setSearchParams}filtrosURL = {filtrosURL} filtrosURLObj={filtrosURLObj} range={range} key={titulo} searchParams={searchParams} atualizarFiltroArray={atualizarFiltroArray} filtroSelecionado={filtroSelecionado} localidade={localidade} ordenarPor={ordenarPor} setFiltroSelecionado={setFiltroSelecionado} chaveFiltro={chaveFiltro} titulo={titulo} itens={itens} isCheckBox={isCheckBox} setProdutos={setProdutos} />
                )})}
            </div>
            {produtosPaginados.length > 0 ? <div className="secao-categoria-produtos">
                <div className="titulo-categoria-produtos">
            {tipo === "busca" ? <h1 className="resultado-pesquisa">Resultados para {nomeProduto.slice(0,20)}</h1> : ""}
            <h1 className= "resultado-pesquisa">Os mais vendidos da categoria</h1>
            <div className="container-botao-carousel">
            <div className="container-card-produtos">
            <button className="botao-voltar" onClick={voltar}><img src="/images/setinha-esquerda.png" className="imagem-setinha-esquerda"/></button>
                <div className="imagem-texto-card" key={indice} >
                   {produtos.slice(indice, indice + 2).map((oferta,index) => {
                    return (
                    <div className="card-produto-busca-produto fade-in" key={index} onClick={() => {redirectProduct(oferta.id)}}>
                        <img src={oferta.url} className="imagem-secao-card-produtos"/>
                            <div className="container-texto-card-produto">
                                <p className="oferta-nome">{oferta.nome.length > 255 ? oferta.nome.slice(0, 252) + "..." : oferta.nome}</p>
                                <p>R$ {oferta.preco}</p>
                                <p>em {oferta.parcelas_máximas}x de R$ {calcularPrecoParcelado(oferta.preco_parcelado, oferta.parcelas_máximas)}</p>
                                <p><strong>R${oferta.preco_pix}</strong> no Pix</p>
                        </div>
                        </div>
                    )
                   })} 
                    

                </div>
                <button className="botao-avancar" onClick={avancar}><img src="/images/setinha-direita.png" className="imagem-setinha-direita"/></button>
                </div>
            </div>
            </div>
                <div className="secao-exibicao-produtos">
                    <div className="container-titulo-exibicao-produtos">
                        <p>{produtos[0].total_produtos} produtos encontrados</p>
                        <p>Ordenar por
                        
                        <select id="options" className="select" value={ordenarPor} onChange={(e) => {setOrdenarPor(e.target.value); handleOrdenarPor(e.target.value)}}>
                            <option value="nome">Relevância</option>
                            <option value="maisVendidos">Mais vendidos</option>
                            <option value="maisAvaliados">Mais bem avaliados</option>
                            <option value="lancamento">Lançamento</option>
                            <option value="menorPreco">Menor preço</option>
                            <option value="maiorPreco">Maior preco</option>
                        </select>
                        </p>
                    </div>
                    <div className="secao-mostrar-produtos">
                    {produtosPaginados.length > 0 ? (
                  produtosPaginados.map((oferta, index) => (
                  <CardPaginaBuscaProduto key={index} oferta={oferta} onClick={() => redirectProduct(oferta.id)} />        
  ))
) : (
  <p>Não foram encontrados produtos.</p>
)}
                    </div>
                    <div className="secao-paginacao">
                        <div className="container-paginacao">
                            <div className="paginacao">
                            {paginaAtual > 1  && (
        <>
          <button
        onClick={() => {
            if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1)
            atualizarFiltro("page",paginaAtual-1);
                }
                 }} 
    >
         {"<"}

    </button></>
      )}
          
          {paginaAtual >= 5 && (<button onClick={() => setPaginaAtual(1)} style={{ fontWeight: paginaAtual === 1 ? "bold" : "normal" }} disabled={paginaAtual === 1}>
            1
          </button>)}
          {calcularPaginasVisiveis()[0] > 2 && <span>...</span>}
        

      
      {calcularPaginasVisiveis().map((num) => (
        <button
          key={num}
          onClick={() => {setPaginaAtual(num);atualizarFiltro("page",num);}}
          style={{ fontWeight: num === paginaAtual ? "bold" : "normal" }}
        >
          {num}
        </button>
      ))}

      
      {paginaAtual < totalPaginas - 2 && (
        <>
          {calcularPaginasVisiveis().slice(-1)[0] < totalPaginas - 1 && <span>...</span>}
          <button onClick={() => {setPaginaAtual(totalPaginas);atualizarFiltro("page",totalPaginas);}} style={{ fontWeight: paginaAtual === totalPaginas ? "bold" : "normal" }}>
            {totalPaginas}
          </button>
        </>
      )}

      
      {paginaAtual < 10 && (<button

        onClick={() => {setPaginaAtual((prev) => Math.min(totalPaginas, prev + 1));atualizarFiltro("page",paginaAtual+1)}}
        disabled={paginaAtual === totalPaginas}
      >
        {">"}
      </button>)}
 </div>
                        </div>
                    </div>
                    </div>

            </div> : <div className="nao-foram-encontrados-produtos">
              <h1>Sua busca por {nomeProduto} não encontrou resultado algum :(</h1>
              <ul>
                <li>Tente buscar outra vez usando termos menos específicos</li>
                <li>Verifique se a palavra foi digitada corretamente</li>
                <li>Utilize palavras mais genéricas ou menos palavras</li>
              </ul>
            </div>}
            </div> 
            <Footer />
        </div>
    );
}

export default PaginaBuscaProduto;