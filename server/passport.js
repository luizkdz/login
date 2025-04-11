import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { db } from "./servidor.js"; // Certifique-se de que o caminho está correto

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    callbackURL: "http://localhost:5000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [usuarios] = await db.query("SELECT * FROM usuarios WHERE email = ?", [profile.emails[0].value]);

        if (usuarios.length === 0) {
            const senhaAleatoriaGoogle = Math.random().toString(36).slice(-8);
            const senhaHash = await bcrypt.hash(senhaAleatoriaGoogle, 10);
            await db.query("INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)", [
                profile.displayName, profile.emails[0].value, senhaHash
            ]);
        }

        return done(null, profile);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport; 