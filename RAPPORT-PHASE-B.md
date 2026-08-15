# Rapport Phase B — Portail connecté aux données Odoo

> **Statut : à valider.** Le code est construit, compilé (`npm run build` ✓) et poussé
> sur la branche `claude/authentik-xp-nova-setup-pavk8r`. **Aucun déploiement en
> production n'a été effectué.** Le portail reste inchangé pour les visiteurs tant
> que les variables `ODOO_*` ne sont pas renseignées (dégradation gracieuse — voir §4).

---

## 1. Ce qui a été construit (lots B4 → B1)

Le portail affiche désormais, par rôle, des **données réelles Odoo en lecture seule**,
via un **compte de service dédié** (jamais les identifiants d'un utilisateur).

| Lot | Espace | Modules livrés |
|-----|--------|----------------|
| **B4** | Administration | Cartes de synthèse (projets, factures à encaisser, opportunités) · Demandes entrantes (CRM) · Projets récents |
| **B3** | Expert | Mes missions (tâches projet) · Mes honoraires & paiements (factures fournisseur) |
| **B3** | Fournisseur | Mes commandes (achats) · Mes factures & paiements |
| **B2** | Client | Mes projets · Mes factures |
| **B1** | Bibliothèque (tous rôles) | Documents Odoo filtrés par dossier d'audience + téléchargement contrôlé |

Chaque module se limite au **partenaire lié à l'utilisateur connecté** (via l'e-mail),
sauf les vues admin qui sont transversales.

## 2. Architecture technique

| Fichier | Rôle |
|---------|------|
| `src/lib/portal/odoo.ts` | Client JSON-RPC lecture seule : auth compte de service, timeout 8 s, cache uid 5 min, erreurs typées (`OdooNotConfiguredError`, `OdooUnavailableError`) |
| `src/lib/portal/odooData.ts` | Couche métier : `resolvePartnerId`, projets/factures/tâches/commandes, synthèse admin, documents |
| `src/lib/portal/format.ts` | Formatage FR (dates, montants, libellés d'états) |
| `src/components/portal/dataStates.tsx` | États d'UI : `Panel`, `Table`, `EmptyState`, `NotConfiguredState`, `UnavailableState`, helper `withData` |
| `src/components/portal/modules.tsx` | Modules serveur asynchrones par rôle |
| `src/components/portal/PortalUI.tsx` | Tableau de bord assemblant les modules selon le rôle |
| `src/app/portail/bibliotheque/page.tsx` | Page bibliothèque |
| `src/app/api/portal/documents/[id]/route.ts` | Téléchargement contrôlé (vérifie session **et** dossier autorisé au rôle) |
| `src/lib/portal/roles.ts` | Ajout de `roleFolders` (dossiers Documents visibles par rôle) |

**Sécurité :** lecture seule uniquement ; l'accès interne recommandé
(`http://172.16.1.1:8019`) évite d'exposer Odoo ; le téléchargement d'un document
vérifie la session **et** que le dossier appartient bien aux dossiers autorisés du rôle
(un client ne peut pas récupérer un document « Interne » en devinant son id).

## 3. Correspondance rôle → dossiers bibliothèque

| Rôle | Dossiers Odoo Documents visibles |
|------|----------------------------------|
| Administration | Public, Clients, Experts, Fournisseurs, Interne |
| Client | Public, Clients |
| Expert | Public, Experts |
| Fournisseur | Public, Fournisseurs |
| Invité | Public |

## 4. Dégradation gracieuse (le portail ne plante jamais)

- **Variables `ODOO_*` absentes** → chaque module affiche un encart discret
  « Connexion Odoo non configurée » ; **le reste du portail fonctionne normalement**.
- **Odoo injoignable / erreur** → encart « Données momentanément indisponibles ».
- **Utilisateur non relié à un partenaire Odoo** → encart explicatif (aucune donnée
  d'un autre partenaire n'est jamais montrée).

C'est pourquoi la mise en production de ce code **ne change rien** pour les visiteurs
tant que l'activation (§5) n'est pas faite : rien de sensible n'est exposé par défaut.

## 5. Guide d'activation (à faire côté serveur, après validation)

1. **Créer le compte de service Odoo** `svc-portail@xp-nova.com`
   - Utilisateur interne, **accès en lecture seule** aux modèles :
     `res.partner`, `project.project`, `project.task`, `account.move`,
     `sale.order`, `purchase.order`, `documents.document`, `documents.folder`.
   - Générer une **clé API** pour ce compte (Préférences → Compte de sécurité).
2. **Créer les dossiers Documents** : `Public`, `Clients`, `Experts`,
   `Fournisseurs`, `Interne` (noms exacts — cf. §6 calibrage).
3. **Relier chaque utilisateur du portail à sa fiche `res.partner`** par le **même
   e-mail** que celui reçu d'Authentik.
4. **Ajouter les variables d'environnement dans Coolify** (service du portail) :
   ```
   ODOO_URL=http://172.16.1.1:8019
   ODOO_DB=<nom de la base Odoo>
   ODOO_SERVICE_LOGIN=svc-portail@xp-nova.com
   ODOO_SERVICE_APIKEY=<clé API générée>
   ```
5. **Redéployer** le service portail dans Coolify.
6. Vérifier chaque espace avec un compte de test par rôle.

> La clé API et le nom de base **ne doivent jamais** apparaître dans un rapport,
> un log ou un commit — ils se saisissent uniquement dans Coolify.

## 6. Points de CALIBRAGE (à confirmer au 1er branchement réel)

Ces domaines reposent sur des conventions Odoo **standard** ; ils sont marqués
`// CALIBRAGE` dans le code et pourront demander un ajustement selon votre
paramétrage réel :

| # | Hypothèse | Où | Ajustement possible |
|---|-----------|----|--------------------|
| 1 | Projet client = `project.project.partner_id` | `getClientProjects` | selon champ client utilisé |
| 2 | Mission expert = tâche dont un `user_ids.partner_id` = partenaire | `getExpertTasks` | selon mode d'affectation |
| 3 | Honoraires expert = factures fournisseur (`in_invoice`/`in_refund`) | `getExpertPayments` | si géré autrement (notes de frais…) |
| 4 | Opportunités = `crm.lead` avec `type = opportunity` | `getAdminSummary`, `getRecentLeads` | selon usage leads/opps |
| 5 | Factures à encaisser = `payment_state ∈ {not_paid, partial}` | `getAdminSummary` | selon états de paiement |
| 6 | Noms de dossiers Documents = Public/Clients/Experts/Fournisseurs/Interne | `roleFolders`, `getDocuments` | doivent correspondre exactement aux dossiers créés |

## 7. Questions ouvertes

1. **Nom exact de la base Odoo** (`ODOO_DB`) — à confirmer côté serveur.
2. **Affectation des experts** aux missions : par utilisateur assigné à la tâche
   (hypothèse actuelle) ou par un autre mécanisme ?
3. **Honoraires experts** : factures fournisseur, ou un autre flux (notes de frais,
   feuilles de temps valorisées) ?
4. **Dossiers Documents** : validez-vous les 5 noms proposés, ou préférez-vous une
   autre nomenclature ?

## 8. Prochaines étapes proposées (Phase C, après validation B)

- Dépôt de fichiers par le client/expert (upload) et documents « sur demande ».
- Notifications (nouvelle facture, nouveau document).
- Pagination / recherche dans les longues listes.

---

*Aucune donnée réelle n'a été lue pendant la construction (les variables `ODOO_*`
ne sont pas configurées dans l'environnement de build). Le branchement se fera
uniquement après votre validation.*
