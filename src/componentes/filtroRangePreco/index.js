import './styles.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useState } from 'react';
import { useEffect } from 'react';
function FiltroPrecoRange({range, setRange, onClick,onChange, min,max,searchParams}) {
    

    const [precoVisivel, setPrecoVisivel] = useState(false);
    
    useEffect(() => {
        const precoMinUrl = searchParams.get('precoMin');
        const precoMaxUrl = searchParams.get('precoMax');
        
        if (precoMinUrl && precoMaxUrl) {
          setRange([parseInt(precoMinUrl), parseInt(precoMaxUrl)]);
        }
      }, [searchParams]);
    const togglePreco = () => {
    setPrecoVisivel(!precoVisivel);
}
    const handleChange = (value) => {
        setRange(value);
        onChange(value);
    }

    return (
        <div className="card-categoria-pagina-busca-produto" >
            <div className="titulo-range-preco-setinha" onClick={togglePreco} >
            <p>Preço</p><img src={precoVisivel === false ? "/images/setinha-dropdown.png" : "images/setinha-cima-dropdown.png"} className="imagem-setinha-filtro"/></div>
            {precoVisivel ? 
            <div className="container-preco">
            <div className="container-minimo-maximo">
            <div className="minimo-valor-minimo">
            <p>Mínimo</p>
            <p>R${min}</p>
            <div className="container-range-minimo">
            <input value ={`R$${range[0]}`} />
            </div>
            </div>
            <div className="maximo-valor-maximo">
            <p>Máximo</p>
            <p>R${max}</p>
            <div className="container-range-maximo">
            <input value ={`R$${range[1]}`} />
            </div>
            </div>
            </div>
            <Slider range min={min} max={max} step={10} value={range} onChange={handleChange}/>
            <button className="botao-filtro-range" onClick={onClick}><span className="texto-botao-range"><strong>APLICAR FILTRO</strong></span></button>
            </div> : ""}
        </div>
    )
}

export default FiltroPrecoRange;