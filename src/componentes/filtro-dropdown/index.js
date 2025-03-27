import { useState } from "react";

import './styles.css';

function FiltroDropDown({titulo, itens, isCheckBox}) {
    const [dropdownVisivel, setdropdownVisivel] = useState(false);

const toggleDropdown = () => {
    setdropdownVisivel(!dropdownVisivel);
}

return (
    <div className="card-categoria-pagina-busca-produto">
      <div className="nome-atributo">
        <p onClick={toggleDropdown}>{titulo}</p>
      </div>
      {dropdownVisivel && (
        <div className="item-drop-down">
          {itens.map((item, index) => (
            <div className="container-input-nome" key={index}>
              {isCheckBox && <input type="checkbox" className="input-checkbox" />}
              <p className="nome">{item}</p>
            </div>
          ))}
          <a href="#">Ver todos</a>
        </div>
      )}
    </div>
  );

}

export default FiltroDropDown;