import { test } from '@playwright/test';
import { compareScreenshotWithReference, createReferenceScreenshot } from '../screenshot-comparison';

test('Test de MDN Web Docs', async ({ page }) => {
  // 1. Configuration de la taille de la fenêtre
  await page.setViewportSize({ width: 1280, height: 720 });
  
  // 2. Aller sur MDN
  await page.goto('https://developer.mozilla.org/fr/', { timeout: 30000 });
  
  // 3. Attendre que le contenu principal soit chargé
  await page.waitForSelector('main', { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Attendre les animations
  
  // 4. Créer le dossier references si nécessaire
  const fs = require('fs');
  if (!fs.existsSync('./references')) {
    fs.mkdirSync('./references');
  }

  // 5. Test du logo MDN
  console.log('Test du logo MDN...');
  const logoTest = await compareScreenshotWithReference(
    page,
    './references/mdn-logo.png',
    {
      selector: 'a[aria-label="MDN homepage"] >> nth=0',
      maxDiffPixelRatio: 0.05, // Plus tolérant aux différences
      threshold: 0.2,
      generateDiffOnFailure: true,
      diffOutputPath: './references/mdn-logo-diff.png'
    }
  );

  // 6. Test de la barre de recherche
  console.log('Test de la barre de recherche...');
  const searchBarTest = await compareScreenshotWithReference(
    page,
    './references/mdn-search.png',
    {
      selector: '#hp-search-form',
      maxDiffPixelRatio: 0.05, // Plus tolérant aux différences
      threshold: 0.2,
      generateDiffOnFailure: true,
      diffOutputPath: './references/mdn-search-diff.png'
    }
  );

  // Vérifier les résultats
  if (!logoTest) {
    throw new Error('Le logo MDN ne correspond pas à la référence');
  }
  if (!searchBarTest) {
    throw new Error('La barre de recherche ne correspond pas à la référence');
  }

  console.log('Tous les tests ont réussi !');
});
