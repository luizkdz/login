import axios from 'axios';

const valoresFrete = {
    "Belo Horizonte": { valor: 15.00, prazo: 5 },
    "São Paulo": { valor: 20.00, prazo: 3 },
    "Rio de Janeiro": { valor: 18.50, prazo: 4 },
    "Curitiba": { valor: 22.00, prazo: 6 },
    "Porto Alegre": { valor: 25.00, prazo: 7 },
    "Salvador": { valor: 19.50, prazo: 5 },
    "Recife": { valor: 21.00, prazo: 6 },
    "Fortaleza": { valor: 23.50, prazo: 7 },
    "Brasília": { valor: 17.00, prazo: 4 },
    "Manaus": { valor: 30.00, prazo: 10 }
};

export const calcularFretePorCep = async (cep, setLocalidade, setValorFrete, setPrazo) => {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
        const novaLocalidade = response.data.localidade;

        const valorFretePrazo = valoresFrete[novaLocalidade] || {valor:25.00, prazo:7};

        
        setLocalidade(novaLocalidade);
        setValorFrete(valorFretePrazo.valor);
        setPrazo(valorFretePrazo.prazo)
    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
    }
};

