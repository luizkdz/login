import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import session from "express-session";
import passport from "../server/passport.js";

dotenv.config();

const app = express();
const port = 5000;


const emailTransporter = process.env.EMAIL_TRANSPORTER;
const senhaEmail = process.env.SENHA_EMAIL;


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailTransporter,
        pass: senhaEmail
    }
});


app.use(session({
    secret: "segredo_seguranca",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-type", "Authorization"]
}));

app.use(cookieParser());


export const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"root",
    database:"loginBd",
    port:"3306"
});

const gerarTokens = async (usuarioId) => {
    const accessToken = jwt.sign({usuarioId} , "segredo_seguranca", {expiresIn:"1m"});
    const refreshToken = jwt.sign({usuarioId}, "segredo_seguranca", {expiresIn:"7d"});

    await db.query("INSERT INTO refresh_tokens (usuario_id, token) VALUES (?, ?)" , [usuarioId, refreshToken]);

    return {accessToken, refreshToken};
}



const autenticarToken = async (req, res, next) => {
    
    const token = req.cookies.accessToken;
    
    if (!token) {
        return res.status(401).json({ message: "Token ausente ou inválido" });
    } 
    jwt.verify(token, "segredo_seguranca", (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token inválido" });
        req.usuarioId = decoded.usuarioId;
        next();
      });

}

app.get("/paginainicial",autenticarToken, async (req, res) => {
    const [usuarios] = await db.query("SELECT nome FROM usuarios where id = ?",[req.usuarioId]);
    if(usuarios.length === 0 ){
        return res.status(404).json({message: "Usuario não encontrado"});
    }
    
    res.status(200).json({nome:usuarios[0].nome});
})
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    const [usuarios] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const encontrado = usuarios[0];

    if (!encontrado || !(await bcrypt.compare(senha, encontrado.senha_hash))) {
        return res.status(401).json({message:"Usuário ou senha inválidos"});
    }

    const { accessToken, refreshToken } = await gerarTokens(encontrado.id);

    res.cookie("accessToken", accessToken,{
        httpOnly:true,
        maxAge: 1 * 60 * 1000,
        
    });
    res.cookie("refreshToken", refreshToken , {
        httpOnly:true,
        maxAge:15 * 60 * 1000 * 4 * 24 * 7,
    })
    
    res.json({ accessToken });
});

app.post("/renovarsessao" , async (req,res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
       return res.status(400).json({message:"Token invalido"});
    }

    try{

    const [token] = await db.query("SELECT * from refresh_tokens where token = ?", [refreshToken]);
    
    if(token.length === 0){
        return res.status(400).json({message:"token não existe"});
    }
    const tokenCerto = token[0].token;
    
    try {
        const decoded = jwt.verify(tokenCerto, "segredo_seguranca");
        const newAccessToken = jwt.sign(
            { usuarioId: decoded.usuarioId },
            "segredo_seguranca",
            { expiresIn: "1m" }
        );
        res.cookie("accessToken", newAccessToken,{
            httpOnly:true,
            maxAge: 1 * 60 * 1000,
        })
        res.status(200).json({token:newAccessToken});
    }
    catch(erro){
        return res.status(400).json({message:"Token invalido"})
    
    }
} catch(erro){
    return res.status(500).json({message:"Erro interno do servidor"});
}
})  

app.get("/", (req, res) => {
    res.send("Servidor rodando com sucesso!");
});

app.get("/auth/google", passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback", passport.authenticate("google",{failureRedirect:"/"}), 
    async (req,res) => {
        const email = req.user.emails[0].value;
        const [usuarios] = await db.query("SELECT * FROM usuarios where email = ?",[email]);
        const usuario = usuarios[0];
        if(!usuario){
            return res.status(400).json({message: "Usuario não encontrado"});
        }
        const {accessToken, refreshToken} = await gerarTokens(usuario.id);

        res.cookie("accessToken", accessToken,
            {httpOnly:true,
            maxAge:15 * 60 * 1000
            }
         )
         res.cookie("refreshToken", refreshToken,
            {httpOnly:true,
            maxAge:15 * 60 * 1000 * 4 * 24 * 7
            }
         )
         res.redirect("http://localhost:3000/paginainicial");
})

app.get("/auth/logout", (req, res) => {
    req.logout(() => {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.redirect("http://localhost:3000");
    });
});

app.post("/cadastrar", async (req,res) => {
    const {nome, email, senha} = req.body;

    const hashedPassword = await bcrypt.hash(senha,10);

    try{
        const emailJaExiste = await db.query("SELECT * from usuarios where email = ?", [email]);
        if(emailJaExiste[0].length > 0 ){
            return res.status(400).send("O email já é cadastrado");
        }
        await db.query("INSERT INTO usuarios (nome,email,senha_hash) VALUES (?,?,?)", [nome,email, hashedPassword]);
    
    res.status(200).send("O usuario foi criado com sucesso");
}
catch(error){
    res.status(500).send("Erro ao cadastrar usuario");
}
});

app.post("/logout", async (req, res) => {
    const accessToken = req.cookies.accessToken;
    res.clearCookie("accessToken", { httpOnly: true });
    db.query("DELETE FROM refresh_tokens where token = ? ", [accessToken]);
    res.status(200).json({ message: "Logout realizado com sucesso!" });
});

const enviarEmail = async (destinatario, assunto, mensagem) => {
    try{
        await transporter.sendMail({
        from: emailTransporter,
        to: destinatario,
        subject:assunto,
        text:mensagem
    })}
    catch(error){
        console.log(error);
}
}

const gerarNovaSenha = (tamanho) => {
    return crypto.randomBytes(tamanho).toString("base64").slice(0,tamanho);
}
app.post("/esqueci-minha-senha",async (req,res) => {
    const {email} = req.body;
    try{
        const [usuarioEmail] = await db.query("SELECT email from usuarios where email = ?",[email]);
        
        if(usuarioEmail.length === 0){
            return res.status(400).json({message: "O email não está cadastrado"});
        }
        const usuarioSelecionado = usuarioEmail[0];
        const novaSenha = gerarNovaSenha(12);
        const novaSenhaComHash = await bcrypt.hash(novaSenha,10);
        await db.query("UPDATE usuarios SET senha_hash = ? where email = ?",[novaSenhaComHash,usuarioSelecionado.email]);
        await enviarEmail(usuarioSelecionado.email, "Restauração de senha", `Olá usuário sua senha é ${novaSenha}`);
        res.status(200).send({message: usuarioSelecionado});
    }
    catch(error){
        res.status(400).json({message:"Esse email não é válido"});
    }
})



app.get("/cadastrar", (req,res) => {
    
});

app.get("/produtos", async (req,res) => {
    
    try{
        const localidade = req.query.localidade || '';
        const [produtos] = await db.query(`SELECT 
    p.id, p.nome, p.preco, p.descricao, p.preco_parcelado, 
    p.parcelas_máximas, p.preco_pix, p.desconto, 
    f.valor, 
    (SELECT i.url FROM imagens_produto i WHERE i.produto_id = p.id LIMIT 1) AS url, 
    ROUND(COALESCE(AVG(a.nota), 0), 1) AS media_avaliacoes, 
    COUNT(a.nota) AS total_avaliacoes 
FROM produtos p
LEFT JOIN avaliacoes a ON p.id = a.produto_id
LEFT JOIN frete f ON p.id = f.produto_id 
WHERE f.localidade = ? or f.localidade is null 
GROUP BY p.id, p.nome, p.preco, p.descricao, p.preco_parcelado,  
         p.parcelas_máximas, p.preco_pix, p.desconto, f.valor;`,[localidade]);
        if(produtos.length === 0 ){
        return res.status(400).json({message: "Não existem produtos cadastrados"});
    }
    const produtosComParcelamento = produtos.map((produto) => {
        const preco = produto.preco;
        const parcelas_maximas = produto.parcelas_maximas || 1;
        const opcoesParcelamento = [];

        for (let i = 1; i <= parcelas_maximas; i++) {
            opcoesParcelamento.push({
                parcelas: i,
                valorParcela: (preco / i).toFixed(2),
            });
        }

        return {
            ...produto,
            parcelas: opcoesParcelamento, 
        };
    });

    res.status(200).json(produtosComParcelamento);
} catch(err){
    res.status(500).json({message: "Erro ao buscar produtos"});
}})

app.get("/produto/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const [produto] = await db.query(`
            SELECT 
    p.id AS produto_id,
    p.nome AS produto_nome,
    p.descricao AS produto_descricao,
    p.preco AS produto_preco,
    p.preco_parcelado AS produto_preco_parcelado,
    p.parcelas_máximas AS produto_parcelas_máximas,
    p.preco_pix AS produto_preco_pix,
    p.desconto AS produto_desconto,
    p.estoque AS produto_estoque,
    c.nome AS categoria_nome
    
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ?;`, [id]);

    const [imagens] = await db.query("Select url from imagens_produto where produto_id = ?",[id]);

    const [avaliacoes] = await db.query("select nota,comentario,usuario_id from avaliacoes where produto_id = ?",[id]);

    const [frete] = await db.query("select localidade, valor, prazo from frete where produto_id = ?",[id]);

    const [variacoes] = await db.query("select nome, valor from variacoes_produto where produto_id = ?",[id]);

    const [vendedores] = await db.query("select u.nome, u.created_at,ve.total_vendidos,ve.nota_entrega,ve.nota_atendimento from usuarios u join produtos p ON p.user_id = u.id left join vendedores_estatisticas ve on ve.user_id = u.id where p.id = ?",[id]);

    const [usuariosComentarios] = await db.query("SELECT u.nome,u.foto_url, a.created_at, a.nota, a.comentario FROM usuarios u JOIN avaliacoes a ON u.id = a.usuario_id WHERE a.produto_id = ? ",[id]);
    
        if (produto.length === 0) {
            return res.status(400).json({message: "Produto não encontrado"});
        }

        
        const vendedoresFormatados = vendedores.map(vendedor => ({
            nome: vendedor.nome,
            cliente_desde: new Date(vendedor.created_at).getFullYear(),
            total_vendidos: vendedor.total_vendidos,
            nota_entrega:vendedor.nota_entrega,
            nota_atendimento:vendedor.nota_atendimento
        }))

        const totalAvaliacoes = avaliacoes.length;
        const mediaAvaliacoes = totalAvaliacoes > 0 ? (avaliacoes.reduce((sum, a) => sum + parseFloat(a.nota), 0) / totalAvaliacoes) : 0.0;
        const totalComentarios = avaliacoes.filter((a) => a.comentario && a.comentario.trim() !== '').length;

        function formatTimeAgo(date) {
            const now = new Date();
            const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
        
            const years = Math.floor(diffInSeconds / (60 * 60 * 24 * 365));
            const months = Math.floor(diffInSeconds / (60 * 60 * 24 * 30));
            const days = Math.floor(diffInSeconds / (60 * 60 * 24));
            const hours = Math.floor(diffInSeconds / (60 * 60));
            const minutes = Math.floor(diffInSeconds / 60);
        
            if (years > 0) {
                return `Há ${years} ano${years > 1 ? 's' : ''}`;
            } else if (months > 0) {
                return `Há ${months} mês${months > 1 ? 'es' : ''}`;
            } else if (days > 0) {
                return `Há ${days} dia${days > 1 ? 's' : ''}`;
            } else if (hours > 0) {
                return `Há ${hours} hora${hours > 1 ? 's' : ''}`;
            } else if (minutes > 0) {
                return `Há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
            } else {
                return 'Há menos de 1 minuto';
            }
        }
        const produtoFormatado = {
            ...produto[0],
            imagens: imagens.map(img => img.url),
            avaliacoes: avaliacoes,
            totalAvaliacoes,
            mediaAvaliacoes,
            totalComentarios,
            frete:frete.length ? frete : null,
            variacoes,
            vendedores: vendedoresFormatados,
            usuariosComentarios: usuariosComentarios.map((comentario) => ({
                ...comentario,
                dataFormatada: formatTimeAgo(comentario.created_at)
            }))
        };


        res.status(200).json({produto: produtoFormatado});
    } catch (error) {
        res.status(500).json({message: "Erro no servidor"});
    }
});

app.get("/obter-localidade",autenticarToken, async (req,res) => { 

    try{
        const [resultado] = await db.query("SELECT localidade from usuarios where id = ?",[req.usuarioId])

        if(resultado.length > 0 && resultado[0].localidade){
           const localidadeBanco = resultado[0].localidade;
            return res.json({localidade:localidadeBanco});
        }
        const localidadeCookies = req.cookies.localidade || "Insira seu cep"
        res.json({localidade:localidadeCookies })
    }
    catch(err){
        console.log("Erro ao obter localidade", err);
        res.json({localidade: "Insira seu cep"});
    }
})

app.post("/definir-localidade", async (req,res) => {
    try{
        const {localidade} = req.body;

        if(!localidade){
            return res.status(400).json({message: "Localidade não fornecida"});
        }
        res.cookie("localidade", localidade, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly:false})
        res.json({message : "Localidade atualizada no cookie", localidade});
    }
    catch(err){
        console.log("Erro ao definir localidade", err);
        res.status(500).json({message:"Erro ao definir localidade"});
    }
})

app.listen(port, () => {console.log("servidor rodando na porta " + `${port}`)});