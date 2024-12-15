rozdělení: 
každý má své řešení ve vlastním adresáři jelikož má každý kompletně vlastní aplikaci

x

x

x

xsustro00  -- omlouvám se za moje video, v jednu část zní divně, ale jsem to pořád já, dělal jsem ji totiž později ale mikrofón odmítal spolupracovat, tak mi to prosím omluvte
->backend
--->src
----->articles.json - tabulka článků
----->keywords.json - tabulka klíčových slov
----->server.js - server - backend logika - API endpointy
----->users.json - tabulka uživatelů
--->package-lock.json
--->package.json

->frontend
--->public
----->index.html -- již ze šablony projektu
--->src
----->app.css   -- vzhled hlavičky aplikace a seznamu karet článků
----->App.js    -- funkce většina funkcí, struktura hlavičky aplikace a seznamu karet článků (volá Card.js)
----->card.css  -- vzhled pro komponentu Card.js
----->Card.js   -- některé funkce karty článku a struktura článku
----->index.css -- vzhled stránky (nejvyššího elementu)
----->index.js  -- pozůstatek z doby, kdy jsem pracoval mezi více stránkama, teď už jen ke vkložení React aplikace k elementu div#root v existujícím HTML dokumentu
----->reportWebVitals.js - vytvořeno už v šabloně projektu
--->package-lock.json
--->package.json

