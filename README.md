# Podere Le Ripi — Portale HR Interno

## Setup Supabase

1. Crea un progetto su supabase.com
2. Vai su SQL Editor → New Query
3. Esegui il contenuto di `database_schema.sql`
4. Vai su Authentication → Settings → abilita "Email" provider

## Variabili d'ambiente

Crea un file `.env` con:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Su Vercel: Settings → Environment Variables → aggiungi le stesse due variabili.

## Deploy su Vercel

1. Push su GitHub
2. Importa il repo su Vercel
3. Aggiungi le variabili d'ambiente
4. Deploy automatico

## Creare il primo utente admin

1. Supabase → Authentication → Users → Invite user
2. Inserisci la tua email
3. Ricevi l'email e imposta la password
4. Accedi al sito

## Aggiungere dipendenti con accesso

1. Supabase → Authentication → Users → Invite user (per ogni dipendente)
2. Nel portale, vai su Dipendenti → scheda del dipendente → "Abilita accesso"

## Revocare accesso a un dipendente

1. Nel portale: Dipendenti → scheda → "Revoca accesso" (disabilita il flag)
2. Su Supabase: Authentication → Users → trova l'utente → "Ban user" (blocco immediato)
