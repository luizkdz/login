import { useEffect, useState } from "react";

import './styles.css';
import axios from "axios";
import { calcularEstrelas } from "../../utils/calcularEstrelas";

function FiltroDropDown({triggerFetch,setTriggerFetch,setFiltroAtualizado,setPaginaAtual,params,setSearchParams,range,searchParams,atualizarFiltroArray, titulo, itens, isCheckBox, filtroSelecionado, setFiltroSelecionado, chaveFiltro,localidade,ordenarPor,setProdutos,filtrosURL,filtrosURLObj}) {
    const [dropdownVisivel, setdropdownVisivel] = useState(false);
    const toggleDropdown = () => {
    setdropdownVisivel(!dropdownVisivel);
}

const handleCheckboxChange = async (item) => {
  let novosFiltros = {};

    if(filtroSelecionado[chaveFiltro].includes(item)){
      novosFiltros = {
        ...filtroSelecionado,
        [chaveFiltro]: filtroSelecionado[chaveFiltro].filter((filtro) => {
        return filtro !== item;
      })}
    }
    else{

      novosFiltros = ({...filtroSelecionado,
        [chaveFiltro] : [...filtroSelecionado[chaveFiltro], item]});
      if(chaveFiltro === 'categoria' || chaveFiltro === 'avaliacao'){
      novosFiltros = ({...filtroSelecionado,
        [chaveFiltro] : [item]
      })
      }
    }

    setFiltroSelecionado(novosFiltros);
    
    const filtrosURL = new URLSearchParams();

    if (novosFiltros[chaveFiltro] && novosFiltros[chaveFiltro].length > 0) {
      filtrosURL.set(chaveFiltro, novosFiltros[chaveFiltro][0]); // Sempre usa o primeiro item da categoria
    }

    Object.entries(novosFiltros).forEach(([filtro, valores]) => {
      if (Array.isArray(valores)) {
        if (valores.length > 0) {
          filtrosURL.set(filtro, valores.join(',')); // Usa .join() se valores for um array
        } else {
          filtrosURL.delete(filtro); // Remove o filtro se não houver valores
        }
      } else if (typeof valores === 'string' && valores.length > 0) {
        filtrosURL.set(filtro, valores); // Se for uma string, usa diretamente
      } else {
        filtrosURL.delete(filtro); // Remove filtro se não tiver valores válidos
      }
    });

    filtrosURL.delete('page');
    if (range[0] && range[1]) {
      filtrosURL.set('precoMin', range[0].toString());
      filtrosURL.set('precoMax', range[1].toString());
    
    }

  
    setSearchParams(filtrosURL);
    setPaginaAtual(1);
    try{
      
      
  
      Object.entries(novosFiltros).forEach(([filtro, valores]) => {
        // Verifica se 'valores' é um array antes de usar .join()
        if (Array.isArray(valores) && valores.length > 0) {
          filtrosURL.set(filtro, valores.join(',')); // Usa .join() se valores for um array
        } else if (typeof valores === 'string' && valores.length > 0) {
          filtrosURL.set(filtro, valores); // Se for uma string, usa diretamente
        } else {
          filtrosURL.delete(filtro); // Remove filtro se não tiver valores válidos
        }
      });

const filtrosURLObj = Object.fromEntries(filtrosURL.entries());

  console.log(`Os filtros são :`,filtrosURLObj);
  console.log(`Avaliacao é:`,Array.isArray(filtrosURLObj.avaliacao));
  const resposta = await axios.get("http://localhost:5000/opcoes-filtros", {
    params: {
      ...filtrosURLObj,
      localidade,
      ordenarPor,
    },
  })
  console.log("ordenar por :", ordenarPor);
  console.log(`novos filtros`,novosFiltros);
  console.log(`filtrosObj`,filtrosURLObj);
  setProdutos(resposta.data);
    }
    catch(err){
      console.error("Erro ao buscar produtos filtrados", err);
    }
  ;
}


return (
    <div className="card-categoria-pagina-busca-produto">
      <div onClick={toggleDropdown} className="nome-atributo">
        <p>{titulo}</p><img src={dropdownVisivel === false ? "/images/setinha-dropdown.png" : "/images/setinha-cima-dropdown.png"} className="imagem-setinha-filtro"/>
      </div>
      {dropdownVisivel && (
        <div className="item-drop-down">
          {itens.map((item, index) => (
            <div className="container-input-nome" onClick={() => handleCheckboxChange(item)} key={index}>
              {isCheckBox && <input type="checkbox" checked={searchParams.get(chaveFiltro)?.split(',').includes(item) || false} className="input-checkbox" />}
              

              <div className="container-estrelas">
          
                {titulo === "Avaliação" ? calcularEstrelas(item) : ""}
                
              
              </div>
              <p className="nome">{titulo === "Avaliação" && item!= 5 ? `${item} e acima` : item} </p>
            </div>
            
          ))}
          <a href="#">Ver todos</a>
        </div>
      )}
    </div>
  );

}

export default FiltroDropDown;