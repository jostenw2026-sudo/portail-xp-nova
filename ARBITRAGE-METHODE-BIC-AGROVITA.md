# Arbitrage — deux structures de parcours dans le groupe

**Objet** : xp-nova.com publie une méthode en **6 phases**, agrovita.xp-nova.com un parcours
en **7 jalons E0–E6**. Faut-il les aligner ?
**Demandé par** la direction le 19 août 2026, à la suite de l'alignement du modèle doctrinal
sur PTE-R.
**Statut** : note d'arbitrage — aucune modification n'a été faite sur la méthode du portail.

---

## 1 · Ce qui a déjà été tranché, et ce qui ne l'est pas

L'alignement demandé hier portait sur le **modèle doctrinal**. Il est fait : le « Référentiel
PACTE » du portail est devenu « Référentiel PTE-R », les deux sites publient désormais la même
doctrine économique.

Reste une seconde divergence, qui n'est pas de même nature : les deux sites décrivent un
**cheminement de mission** différent. C'est l'objet de cette note.

| | xp-nova.com (BIC) | agrovita.xp-nova.com |
|---|---|---|
| Structure | 6 phases | 7 jalons E0–E6 |
| Étapes | Comprendre · Concevoir · Structurer · Réaliser · Pérenniser · Mesurer l'impact | Préqualifier · Décider · Concevoir · Financer · Réaliser · Exploiter · Vendre |
| Sanction d'étape | Un livrable vérifiable | Un jalon **et** une condition de résilience |
| Fin du parcours | **Mesurer l'impact** | **Vendre** |

---

## 2 · Ce que dit le CDC — et ce que « C10 » verrouille réellement

Le fichier `src/content/methode.ts` porte en en-tête : *« Ordre verrouillé (C10) »*. J'ai
vérifié à quoi cela renvoie dans `CAHIER_DES_CHARGES_FINAL_EXECUTION_XP-NOVA_V1.2.md` :

> **C10 · Étapes de la méthode** — D2 (5 étapes en home) vs D0/D5 (6 étapes). Problème :
> « Mesurer l'impact » disparaît selon les pages. Arbitrage : **6 étapes partout** —
> Comprendre, Concevoir, Structurer, Réaliser, Pérenniser, Mesurer.

**C10 n'est pas un engagement contractuel envers un client.** C'est un arbitrage interne de
rédaction, pris pour corriger une incohérence entre documents sources — certaines pages
affichaient 5 étapes, d'autres 6, et « Mesurer l'impact » s'évaporait au passage.

Conséquence pour nous : **une décision de direction peut superséder C10**, à condition d'être
explicite. Mais ce que C10 protégeait doit être préservé — « Mesurer l'impact » ne doit pas
disparaître par effet de bord, ce serait exactement la faute qu'il corrigeait.

---

## 3 · La divergence n'est pas une incohérence : les deux sites ne vendent pas la même chose

C'est le point qui commande la décision.

Le CDC isole explicitement le périmètre **BIC** (partie 2) : xp-nova.com est le bureau
d'ingénierie mère, **tous secteurs**. Ses sept métiers publiés sont Études & Conseil,
Ingénierie (incl. BIM), AMO, Maîtrise d'Œuvre, Structuration & Ingénierie financière,
Suivi-Évaluation, Formation.

Ses quatre personas, également fixés par le CDC :

| | Persona BIC | Ce qu'il vient chercher |
|---|---|---|
| P1 | Bailleur / PTF — BM, BAD, UE, AFD, GIZ, KfW, PNUD, FIDA | Maturité, références, conformité |
| P2 | Bureau d'ingénierie international cherchant un partenaire local | Un cotraitant fiable |
| P3 | Maître d'ouvrage public — État, agence, établissement | Sécuriser un équipement, une infrastructure |
| P4 | Maître d'ouvrage privé / investisseur | Études, faisabilité, structuration |

Le CDC note même que deux des personas des documents d'origine « sont des personas
AGROVITA/ODT, **pas BIC** ».

Deux conséquences se lisent immédiatement :

**« Vendre » n'a pas de sens pour BIC.** L'étape E6 d'AgroVita, c'est la commercialisation d'une
production agricole — corridor logistique, conformité RDUE, contractualisation des débouchés.
Un maître d'ouvrage public qui fait construire un lycée ou un réseau d'eau ne « vend » rien.
Imposer E0–E6 au portail obligerait à publier une étape vide pour trois personas sur quatre.

**« Mesurer l'impact » n'a pas d'équivalent dans E0–E6.** C'est précisément ce que P1 — les
bailleurs — exige : indicateurs, résultats démontrés, enseignements. Chez AgroVita, la mesure
existe mais vit *à l'intérieur* d'E5 (tableau de bord), elle n'est pas un jalon. Aligner le
portail sur E0–E6 supprimerait de sa vitrine ce que sa première cible vient y chercher.

**Autrement dit : la doctrine est commune, l'offre ne l'est pas.** PTE-R répond à « où va la
valeur, et qu'est-ce qui l'interrompt » — c'est vrai de tout projet du groupe. Le parcours
répond à « comment se déroule une mission » — et une mission d'AMO sur une infrastructure
publique ne se déroule pas comme l'ingénierie d'une unité de transformation.

### Correspondance réelle des deux structures

| BIC — 6 phases | AgroVita — E0–E6 | Recouvrement |
|---|---|---|
| Comprendre | E0 Préqualifier + E1 Décider | Partiel — AgroVita scinde |
| Concevoir | E2 Concevoir | Bon |
| Structurer | E3 Financer | Bon |
| Réaliser | E4 Réaliser | Bon |
| Pérenniser | E5 Exploiter | Bon |
| Mesurer l'impact | *(dans E5)* | **Sans équivalent en jalon** |
| *(aucune)* | E6 Vendre | **Sans équivalent BIC** |

Quatre phases sur six se correspondent proprement. Les deux extrémités divergent — et elles
divergent pour de bonnes raisons.

---

## 4 · Options

### Option A — Deux structures, articulation explicite ⭐ **recommandée**

On assume deux cheminements, et on **publie le lien entre eux** au lieu de le laisser deviner.

- Le portail garde ses 6 phases et son « Mesurer l'impact ».
- AgroVita garde ses 7 jalons et sa condition de résilience.
- Sur `/methode` du portail, un encart : la doctrine PTE-R est commune au groupe ; pour les
  projets agricoles, d'élevage et agro-industriels, elle se décline en un parcours jalonné
  E0–E6 sur agrovita.xp-nova.com.
- Réciproquement sur AgroVita : le parcours E0–E6 est la déclinaison sectorielle de la méthode
  d'ingénierie du groupe.

**Effort** faible — deux encarts et leurs versions anglaises.
**Risque** faible. **Gain** : la question ne se reposera plus, parce que la réponse sera écrite
sur les deux sites.

### Option B — Aligner le portail sur E0–E6

**Effort** élevé. Le compte « 6 phases » est écrit en dur à **dix endroits** : accueil FR et EN,
`/methode` FR et EN, `metiers/[slug]`, `Careers` FR et EN, `blocks.tsx`, la fiche
« Référentiel méthodologique », le titre de page.

**Risque élevé, pour un gain douteux** : on publierait « Vendre » à des maîtres d'ouvrage
publics et on retirerait « Mesurer l'impact » aux bailleurs. Cela reviendrait aussi à
re-commettre la faute que C10 corrigeait.

### Option C — Aligner AgroVita sur les 6 phases

**À écarter.** Cela défait le travail de la semaine : conditions de résilience, jalons à deux
niveaux, section E0, huit parcours types — tout est indexé sur E0–E6. Et les 71 prestations du
cahier sont codées `XPN-Ex-yy`.

---

## 5 · Recommandation

**Option A.** Le groupe a désormais **une doctrine, deux parcours** — et c'est cohérent, à
condition de le dire.

L'incohérence que vous aviez repérée était réelle, mais elle portait sur le **modèle**
— PACTE contre PTE-R, deux acronymes proches aux expansions différentes, ça, c'était
intenable. Elle est corrigée. La différence de parcours, elle, reflète une différence de métier
que le CDC a délibérément instituée en isolant le périmètre BIC.

Le vrai risque résiduel n'est pas d'avoir deux structures : c'est qu'un lecteur passant d'un
site à l'autre les découvre sans explication. C'est exactement ce que l'option A supprime, pour
deux encarts.

---

## 6 · Si vous retenez l'option A, voici ce que j'écris

**Sur xp-nova.com `/methode`**, sous la grille des 6 phases :

> Cette méthode s'applique à tous nos domaines d'intervention. Elle repose sur la doctrine
> PTE-R — produire pour la demande, transformer pour la valeur, exporter pour l'impact,
> résister pour la durée. Pour les projets agricoles, d'élevage et agro-industriels, elle se
> décline en un parcours jalonné de sept étapes, de la préqualification de l'idée au contrat
> signé, sur agrovita.xp-nova.com.

**Sur agrovita.xp-nova.com `/methode`**, sous le parcours E0–E6 :

> Ce parcours est la déclinaison agricole de la méthode d'ingénierie d'XP-NOVA. Le bureau
> conduit les mêmes exigences sur ses autres domaines — équipements publics, infrastructures,
> suivi-évaluation — selon une méthode en six phases présentée sur xp-nova.com.

Versions anglaises comprises. Dites-moi si vous validez les textes, ou ce que vous voulez y
changer.

---

## 7 · Un écart mineur relevé au passage

La fiche « Référentiel méthodologique » du portail annonce *« La méthode XP-NOVA en 6 phases »*
et son statut est `public` — donc demandable. Comme pour le référentiel PACTE, **je n'ai pas
vérifié que ce document existe** : aucun fichier ne le porte dans le dépôt, la remise est
manuelle. À contrôler avant qu'une demande n'arrive.
