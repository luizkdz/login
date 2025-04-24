import { useEffect } from 'react';
import './styles.css';

function InputProdutoAlterar({nome,mostrarOpcoes,setMostrarOpcoes,setMostrarOpcoesSegundoInput,selecionarNomeValor, nomeValor, itemSelecionado, setNomeValor,setCorSelecionada,setMaterialSelecionado,setVoltagemSelecionada,setGeneroSelecionado,setTamanhoSelecionado,setEstampaSelecionada,setPesoSelecionado,setDimensoesSelecionada}) {

const handleClick = (item) => {
    selecionarNomeValor(item.valor);
    setNomeValor(item.valor);    
    console.log(item.id);
    if (nome === "cor") setCorSelecionada(item.id);
    if (nome === "materiais") setMaterialSelecionado(item.id);
    if (nome === "voltagem") setVoltagemSelecionada(item.id);
    if (nome === "generos") setGeneroSelecionado(item.id);
    if (nome === "tamanho") setTamanhoSelecionado(item.id);
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
                            <p onClick={() => handleClick(item)}>{item.valor}</p>
                            </div> 
                        )} )}
                            </div>
                        )}
                                            </div>)
}

export default InputProdutoAlterar;