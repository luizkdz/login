import './styles.css';

function InputProdutoAlterar({nome,mostrarOpcoes,setMostrarOpcoes,setMostrarOpcoesSegundoInput,selecionarNomeValor, nomeValor, itemSelecionado}) {
    return (
    <div className="container-input-alterar">
                <p>{nome}</p>
                        <div className="container-quantidade-foto-dropdown-alterar">
                        <p style ={{cursor:"pointer"}} onClick={() => {setMostrarOpcoes(!mostrarOpcoes);setMostrarOpcoesSegundoInput(false)}}> {nomeValor !== "mais" ? `${nomeValor}` : `Selecione o valor` }</p><img src={mostrarOpcoes ? "/images/setinha-cima-dropdown-preta.png" : "/images/setinha-dropdown-preta.png"} className="imagem-botao-dropdown-quantidade"/>
                        </div>
                            {mostrarOpcoes && (
                            <div className="selecao-input-cor">
                            {itemSelecionado.cores?.map((cor) => { return (
                            <div>
                            <p onClick={() => selecionarNomeValor(cor.valor)}>{cor.valor}</p>
                            </div> 
                        )} )}
                            </div>
                        )}
                                            </div>)
}

export default InputProdutoAlterar;