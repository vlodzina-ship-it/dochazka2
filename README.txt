DOCHÁZKOVÝ SYSTÉM

Tento balíček obsahuje self-hosted docházkový systém pro firmu.

STRUKTURA BALÍČKU

app/
  Webová aplikace pro uživatele a administrátora.

sql/
  SQL skripty pro vytvoření databáze, funkcí, politik a úvodních dat.

docs/
  Návody pro instalaci a používání.

ZÁKLADNÍ INSTALACE

1. Připravte databázi a Supabase projekt.
2. Spusťte SQL skripty ve správném pořadí.
3. V souboru app/config.js nastavte SUPABASE_URL a SUPABASE_KEY.
4. Nahrajte obsah složky app/ na webhosting nebo interní server.
5. Otevřete aplikaci v prohlížeči a přihlaste se.

DOPORUČENÉ POŘADÍ SQL

1. 01_schema.sql
2. 02_functions.sql
3. 03_policies.sql
4. 04_seed.sql

POZNÁMKA

Tato verze je určena pro samostatnou instalaci jedné firmy.
Jedna firma = jedna samostatná databáze / jeden samostatný projekt.
