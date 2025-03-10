import { test } from '@playwright/test';
import { compareScreenshotWithReference, createReferenceScreenshot } from '../screenshot-comparison';
import * as path from 'path';

test('Test de la page statique', async ({ page }) => {
  // 1. Configuration de la taille de la fenêtre
  await page.setViewportSize({ width: 1280, height: 720 });
  
  // 2. Charger la page statique
  const htmlPath = path.join(__dirname, '..', 'static', 'index.html');
  await page.goto(`file://${htmlPath}`);
  
  // 3. Attendre que la page soit chargée
  await page.waitForSelector('[data-testid="content"]');
  
  // 4. Créer le dossier references si nécessaire
  const fs = require('fs');
  if (!fs.existsSync('./references')) {
    fs.mkdirSync('./references');
  }

  // 5. Test du logo
  console.log('Test du logo...');
  const logoTest = await compareScreenshotWithReference(
    page,
    './references/static-logo.png',
    {
      selector: '[data-testid="logo"]',
      maxDiffPixelRatio: 0.01,
      threshold: 0.1,
      generateDiffOnFailure: true,
      diffOutputPath: './references/static-logo-diff.png'
    }
  );

  // 6. Test du titre
  console.log('Test du titre...');
  const titleTest = await compareScreenshotWithReference(
    page,
    './references/static-title.png',
    {
      selector: '[data-testid="title"]',
      maxDiffPixelRatio: 0.01,
      threshold: 0.1,
      generateDiffOnFailure: true,
      diffOutputPath: './references/static-title-diff.png'
    }
  );

  // 7. Test du bouton
  console.log('Test du bouton...');
  const buttonTest = await compareScreenshotWithReference(
    page,
    './references/static-button.png',
    {
      selector: '[data-testid="action-button"]',
      maxDiffPixelRatio: 0.01,
      threshold: 0.1,
      generateDiffOnFailure: true,
      diffOutputPath: './references/static-button-diff.png'
    }
  );

  // 8. Test de la page complète
  console.log('Test de la page complète...');
  const pageTest = await compareScreenshotWithReference(
    page,
    './references/static-page.png',
    {
      selector: 'body',
      maxDiffPixelRatio: 0.01,
      threshold: 0.1,
      generateDiffOnFailure: true,
      diffOutputPath: './references/static-page-diff.png'
    }
  );

  // Vérifier les résultats
  if (!logoTest) {
    throw new Error('Le logo ne correspond pas à la référence');
  }
  if (!titleTest) {
    throw new Error('Le titre ne correspond pas à la référence');
  }
  if (!buttonTest) {
    throw new Error('Le bouton ne correspond pas à la référence');
  }
  if (!pageTest) {
    throw new Error('La page complète ne correspond pas à la référence');
  }

  console.log('Tous les tests ont réussi !');
});
