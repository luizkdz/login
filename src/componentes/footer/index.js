import './styles.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>Sobre Nós</h3>
                    <p>Projeto criado para portfólio</p>
                </div>

                <div className="footer-section">
                    <h3>Links Rápidos</h3>
                    <ul>
                        <li><a href="#">Início</a></li>
                        <li><a href="#">Produtos</a></li>
                        <li><a href="#">Contato</a></li>
                        <li><a href="#">Sobre Nós</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Redes Sociais</h3>
                    <div className="social-icons">
                        <a href="#"><img src="./images/facebook.png" alt="Facebook" />Facebook</a>
                        <a href="#"><img src="./images/instagram.png" alt="Instagram" />Instagram</a>
                        <a href="#"><img src="./images/twitter.png" alt="Twitter" />Twitter</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
            <a href="https://www.flaticon.com/free-icons/right-chevron" title="right chevron icons">Right chevron icons created by th studio - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/notification-bell" title="notification bell icons">Notification bell icons created by Pixel perfect - Flaticon</a>    
            <a href="https://www.flaticon.com/free-icons/smart-cart" title="smart cart icons">Smart cart icons created by Freepik - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/down-arrow" title="down arrow icons">Down arrow icons created by th studio - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/facebook" title="facebook icons">Facebook icons created by Pixel perfect - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/instagram-logo" title="instagram logo icons">Instagram logo icons created by Pixel perfect - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/twitter-logo" title="twitter logo icons">Twitter logo icons created by Md Tanvirul Haque - Flaticon</a>    
                <p>&copy; 2025 Login ltda</p>
            </div>
        </footer>
    );
}

export default Footer;
