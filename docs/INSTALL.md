# Instalace docházkového systému

## Pořadí spuštění SQL

1. `database/01_schema.sql`
2. `database/02_functions.sql`
3. `database/03_policies.sql`
4. `database/04_seed.sql`

## Po instalaci

- nastavit Supabase Auth
- vytvořit admin účet
- propojit admin účet s tabulkou employees
- zkontrolovat app_settings
- nastavit offices

## Poznámka

Tento systém je určen pro instalaci na samostatnou databázi každé firmy.
Nepoužívá multi-tenant architekturu.
