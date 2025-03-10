import { test } from '@playwright/test';
import { compareScreenshotWithReference, createReferenceScreenshot } from '../screenshot-comparison';

test('Test de la page GitHub', async ({ page }) => {
  // 1. Configuration du viewport pour une taille constante
  await page.setViewportSize({ width: 1280, height: 720 });
  
  // 2. Aller sur GitHub avec un timeout plus long
  await page.goto('https://github.com', { timeout: 60000 });
  
  // 3. Attendre que le logo soit visible (élément stable)
  await page.waitForSelector('.octicon-mark-github', { timeout: 30000 });
  
  // 4. Attendre un peu que les animations se terminent
  await page.waitForTimeout(2000);
  
  // 5. Créer le dossier references s'il n'existe pas
  const fs = require('fs');
  if (!fs.existsSync('./references')) {
    fs.mkdirSync('./references');
  }

  // 6. Créer une capture de la page entière
  console.log('Création de la capture de référence...');
  await createReferenceScreenshot(
    page,
    './references/github-home.png',
    undefined,
    false // Capture uniquement la partie visible
  );

  // 7. Tester le logo GitHub
  console.log('Test du logo...');
  const logoTest = await compareScreenshotWithReference(
    page,
    './references/github-home.png',
    {
      selector: '.octicon-mark-github',
      maxDiffPixelRatio: 0.01,
      threshold: 0.1,
      generateDiffOnFailure: true,
      diffOutputPath: './references/github-logo-diff.png'
    }
  );

  // Vérifier les résultats
  if (!logoTest) {
    throw new Error('Le logo ne correspond pas à la référence');
  }

  console.log('Test terminé avec succès !');
});
