import { useEffect } from 'react';
import './styles.css';

function InputProdutoAlterar({nome,mostrarOpcoes,setMostrarOpcoes,setMostrarOpcoesSegundoInput,selecionarNomeValor, nomeValor, itemSelecionado, setNomeValor,setCorSelecionada,setMaterialSelecionado,setVoltagemSelecionada,setGeneroSelecionado,setTamanhoSelecionado,setEstampaSelecionada,setPesoSelecionado,setDimensoesSelecionada}) {

const handleClick = (item) => {
    selecionarNomeValor(item.valor);
    if(nome === "dimensoes"){
        setNomeValor(`${item.largura}${item.unidade} x ${item.altura}${item.unidade} x ${item.comprimento}${item.unidade}`);
    }
    else if(nome === "pesos"){
        setNomeValor(`${item.valor}${item.unidade}`)
    }
    else if(nome === "voltagens"){
        setNomeValor(`${item.valor}V`)
    }
    else{
    setNomeValor(item.valor);    
    }
    console.log(item.id);
    if (nome === "cor") setCorSelecionada(item.id);
    if (nome === "materiais") setMaterialSelecionado(item.id);
    if (nome === "voltagens") setVoltagemSelecionada(item.id);
    if (nome === "generos") setGeneroSelecionado(item.id);
    if (nome === "tamanhos") setTamanhoSelecionado(item.id);
    if (nome === "estampas") setEstampaSelecionada(item.id);
    if (nome === "pesos") setPesoSelecionado(item.id);
    if (nome === "dimensoes") setDimensoesSelecionada(item.id);

}



    return (
    <div className="container-input-alterar">
                <p>{nome.charAt(0).toUpperCase() + nome.slice(1)}:</p>
                        <div className="container-quantidade-foto-dropdown-alterar">
                        <p style ={{cursor:"pointer"}} onClick={() => {setMostrarOpcoes(mostrarOpcoes === nome ? null : nome);setMostrarOpcoesSegundoInput(false);}}> {nomeValor !== "mais" ? `${nomeValor}` : `Selecione o valor` }</p><img src={mostrarOpcoes ? "/images/setinha-cima-dropdown-preta.png" : "/images/setinha-dropdown-preta.png"} className="imagem-botao-dropdown-quantidade"/>
                        </div>
                            {mostrarOpcoes === nome && (
                            <div className="selecao-input-cor">
                            {itemSelecionado[nome]?.map((item) => { return (
                            <div>
                            <p onClick={() => handleClick(item)}>{nome === "dimensoes" ? `${item.largura}${item.unidade} x ${item.altura}${item.unidade} x ${item.comprimento}${item.unidade}`: nome === "voltagens" ? `${item.valor}V` : nome === "pesos" ? `${item.valor}${item.unidade}` : item.valor}</p>
                            </div> 
                        )} )}
                            </div>
                        )}
                                            </div>)
}

export default InputProdutoAlterar;