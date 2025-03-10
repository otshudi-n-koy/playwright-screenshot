# Test de Régression Visuelle avec Playwright

Ce projet implémente des tests de régression visuelle en utilisant Playwright. Il permet de capturer des captures d'écran d'éléments web et de les comparer avec des images de référence pour détecter les changements visuels.

## Structure du Projet

```
playwright-screenshot/
├── tests/                    # Tests Playwright
│   ├── static.spec.ts       # Test de la page statique
│   ├── github.spec.ts       # Test de GitHub
│   └── mdn.spec.ts          # Test de MDN
├── static/                  # Pages web statiques pour les tests
│   └── index.html          # Page de test simple
├── references/             # Images de référence
├── screenshot-comparison.ts # Utilitaire de comparaison
└── package.json           # Dépendances
```

## Installation

```bash
npm install
npx playwright install
```

## Exécution des Tests

```bash
# Exécuter tous les tests
npx playwright test

# Exécuter un test spécifique
npx playwright test tests/static.spec.ts

# Exécuter en mode visuel
npx playwright test --headed
```

## Fonctionnalités

- Capture d'écran d'éléments spécifiques
- Comparaison avec des images de référence
- Génération d'images de différence
- Support des sélecteurs data-testid
- Configuration de la tolérance aux différences

## Notes

- Les images de référence sont créées automatiquement lors du premier test
- Les différences sont enregistrées dans le dossier references avec le suffixe -diff
- Utilisez des sélecteurs stables (data-testid) pour des tests fiables
