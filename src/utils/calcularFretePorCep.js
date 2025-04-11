import axios from 'axios';


export const calcularFretePorCep = async (produtoId, cep, setLocalidade, setValorFrete, setPrazo) => {
    try {
        
        const resposta = await axios.get(`http://localhost:5000/calcular-frete/${cep}/${produtoId}`)
        const {cidade, valor, prazo} = resposta.data;

        setLocalidade(cidade);
        setValorFrete(Number(valor));
        setPrazo(Number(prazo))
        console.log("Atualizando frete:",cidade, valor, prazo );
    } catch (error) {
        console.error("Erro ao calcular Frete", error);
    }
};

