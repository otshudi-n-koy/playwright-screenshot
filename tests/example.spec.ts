import { test } from '@playwright/test';
import { compareScreenshotWithReference, createReferenceScreenshot } from '../screenshot-comparison';

test('Exemple de test de capture d\'écran', async ({ page }) => {
  // 1. Naviguer vers la page à tester
  await page.goto('https://example.com');
  
  // 2. Attendre que la page soit chargée
  await page.waitForLoadState('networkidle');

  // 3. Créer une capture de référence (à faire une seule fois)
  await createReferenceScreenshot(
    page,
    './references/example-page.png',
    undefined, // pas de sélecteur spécifique
    true // capture page entière
  );

  // 4. Comparer avec la référence
  const isMatch = await compareScreenshotWithReference(
    page,
    './references/example-page.png',
    {
      fullPage: true,
      maxDiffPixelRatio: 0.01, // 1% de différence maximum
      threshold: 0.2,
      generateDiffOnFailure: true
    }
  );

  // Le test échouera si les images ne correspondent pas
  if (!isMatch) {
    throw new Error('La page ne correspond pas à la référence');
  }
});
