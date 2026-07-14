import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import userSrv from './api/user/user.service';
import { UserModel } from './api/user/user.model';
import { UserIdentityModel } from './lib/auth/local/user-identity.model';
import { CategoriaModel } from './api/categoria/categoria.model';
import { CorsoModel } from './api/corso/corso.model';
import { AssegnazioneModel } from './api/assegnazione/assegnazione.model';

// utilità per generare date relative a oggi
const giorni = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

async function seed() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/esame-finale');
    console.log('Connesso al DB...');

    // Seed idempotente: se esistono già utenti il DB è già popolato, quindi
    // NON tocco nulla (i dati inseriti dall'app restano). Il seed effettivo
    // avviene solo la prima volta, su database vuoto.
    // Per forzare un reset completo: `npm run seed -- --reset`
    const reset = process.argv.includes('--reset');
    const giaPopolato = await UserModel.exists({});
    if (giaPopolato && !reset) {
        console.log('Database già popolato: seed saltato (usa "npm run seed -- --reset" per rigenerare).');
        await mongoose.disconnect();
        process.exit(0);
    }

    if (reset) {
        console.log('Reset richiesto: pulizia collezioni...');
        await Promise.all([
            UserModel.deleteMany({}),
            UserIdentityModel.deleteMany({}),
            CategoriaModel.deleteMany({}),
            CorsoModel.deleteMany({}),
            AssegnazioneModel.deleteMany({}),
        ]);
    }

    console.log('Avvio seed...');

    // 2. categorie
    const [sicurezza, privacy, softSkills, tecnico] = await CategoriaModel.insertMany([
        { nomeCategoria: 'Sicurezza' },
        { nomeCategoria: 'Privacy' },
        { nomeCategoria: 'Soft Skills' },
        { nomeCategoria: 'Tecnico' },
    ]);

    // 3. utenti (la password di tutti è Password1!)
    const referente = await userSrv.add(
        { firstName: 'Giulia', lastName: 'Ferrari', ruolo: 'REFERENTE' },
        { username: 'referente@academy.it', password: 'Password1!' }
    );
    const mario = await userSrv.add(
        { firstName: 'Mario', lastName: 'Rossi', ruolo: 'DIPENDENTE' },
        { username: 'mario.rossi@academy.it', password: 'Password1!' }
    );
    const laura = await userSrv.add(
        { firstName: 'Laura', lastName: 'Bianchi', ruolo: 'DIPENDENTE' },
        { username: 'laura.bianchi@academy.it', password: 'Password1!' }
    );

    // 4. corsi (uno non attivo per testare le regole sulle assegnazioni)
    const [antincendio, gdpr, comunicazione, git, legacy] = await CorsoModel.insertMany([
        { titolo: 'Sicurezza antincendio', descrizione: 'Norme base antincendio sul luogo di lavoro', categoria: sicurezza._id, durataOre: 8, obbligatorio: true, attivo: true },
        { titolo: 'GDPR e protezione dei dati', descrizione: 'Introduzione al trattamento dei dati personali', categoria: privacy._id, durataOre: 4, obbligatorio: true, attivo: true },
        { titolo: 'Comunicazione efficace', descrizione: 'Tecniche di comunicazione in team', categoria: softSkills._id, durataOre: 6, obbligatorio: false, attivo: true },
        { titolo: 'Introduzione a Git', descrizione: 'Versionamento del codice con Git', categoria: tecnico._id, durataOre: 10, obbligatorio: false, attivo: true },
        { titolo: 'Corso legacy (non attivo)', descrizione: 'Corso storicizzato non più proponibile', categoria: tecnico._id, durataOre: 3, obbligatorio: false, attivo: false },
    ]);

    // 5. assegnazioni con stati diversi
    await AssegnazioneModel.insertMany([
        // Mario: una assegnata (in corso), una completata, una scaduta
        { corso: antincendio._id, dipendente: mario.id, dataAssegnazione: giorni(-10), dataScadenza: giorni(20), stato: 'Assegnato' },
        { corso: gdpr._id, dipendente: mario.id, dataAssegnazione: giorni(-40), dataScadenza: giorni(-10), stato: 'Completato', dataCompletamento: giorni(-15) },
        { corso: comunicazione._id, dipendente: mario.id, dataAssegnazione: giorni(-60), dataScadenza: giorni(-5), stato: 'Assegnato' }, // scaduta (stato derivato)
        // Laura: una assegnata, una completata, una annullata
        { corso: git._id, dipendente: laura.id, dataAssegnazione: giorni(-5), dataScadenza: giorni(30), stato: 'Assegnato' },
        { corso: antincendio._id, dipendente: laura.id, dataAssegnazione: giorni(-50), dataScadenza: giorni(-20), stato: 'Completato', dataCompletamento: giorni(-25) },
        { corso: gdpr._id, dipendente: laura.id, dataAssegnazione: giorni(-30), dataScadenza: giorni(10), stato: 'Annullato' },
    ]);

    console.log('\nSeed completato con successo.');
    console.log('----------------------------------------');
    console.log('Utenti di test (password: Password1!):');
    console.log(`  REFERENTE  -> referente@academy.it     (${referente.id})`);
    console.log(`  DIPENDENTE -> mario.rossi@academy.it    (${mario.id})`);
    console.log(`  DIPENDENTE -> laura.bianchi@academy.it  (${laura.id})`);
    console.log('----------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('Errore durante il seed:', err);
    process.exit(1);
});
