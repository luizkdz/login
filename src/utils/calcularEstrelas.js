export const calcularEstrelas = (avaliacao) => {
    const totalEstrelas = 5;
    const inteira = Math.floor(avaliacao);
    const temMeia = avaliacao % 1 !== 0;
    const estrelas = [];

    for (let i = 0; i < inteira; i++) {
        estrelas.push(<img key={i} src="/images/estrelacheia.png" className="estrela-avaliacao" alt="⭐" />);
    }
    if (temMeia) {
        estrelas.push(<img key="meia" src="/images/meiaestrela.png" className="estrela-avaliacao" alt="⭐½" />);
    }
    while (estrelas.length < totalEstrelas) {
        estrelas.push(<img key={estrelas.length} src="/images/estrelavazia.png" className="estrela-avaliacao" alt="☆" />);
    }
    return estrelas;
};