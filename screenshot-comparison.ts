import { Page } from '@playwright/test';
import fs from 'fs';

/**
 * Compare un screenshot actuel avec une image de référence
 * @param page - L'instance Page de Playwright
 * @param selector - Le sélecteur de l'élément à capturer (optionnel, page entière par défaut)
 * @param referencePath - Le chemin vers l'image de référence
 * @param options - Options de comparaison et de capture
 * @returns Promise<boolean> - true si les images correspondent selon les critères
 */
async function compareScreenshotWithReference(
  page: Page,
  referencePath: string,
  options: {
    selector?: string;              // Sélecteur CSS de l'élément à capturer (page entière si non spécifié)
    maxDiffPixelRatio?: number;     // Ratio maximum de pixels différents autorisé (0.01 = 1%)
    threshold?: number;             // Seuil de différence par pixel (0-1)
    generateDiffOnFailure?: boolean; // Générer une image de différence en cas d'échec
    diffOutputPath?: string;        // Chemin pour sauvegarder l'image de différence
    fullPage?: boolean;             // Capturer la page entière ou seulement la partie visible
    timeout?: number;               // Délai d'attente pour la capture
  } = {}
): Promise<boolean> {
  // Valeurs par défaut
  const {
    selector,
    maxDiffPixelRatio = 0.01,
    threshold = 0.2,
    generateDiffOnFailure = true,
    diffOutputPath = './screenshot-diff.png',
    fullPage = false,
    timeout = 5000
  } = options;

  try {
    // Prendre le screenshot
    let screenshot: Buffer;
    if (selector) {
      // Attendre que l'élément soit visible
      await page.waitForSelector(selector, { timeout });
      screenshot = await page.locator(selector).screenshot();
    } else {
      // Capturer toute la page
      screenshot = await page.screenshot({ fullPage });
    }

    // Enregistrer temporairement le screenshot pour débogage
    const tempScreenshotPath = './temp-screenshot.png';
    fs.writeFileSync(tempScreenshotPath, screenshot);

    // Vérifier si l'image de référence existe
    if (!fs.existsSync(referencePath)) {
      console.log('Création de la première référence...');
      fs.writeFileSync(referencePath, screenshot);
      return true;
    }

    // Comparer les images
    const referenceImage = fs.readFileSync(referencePath);
    if (screenshot.equals(referenceImage)) {
      fs.unlinkSync(tempScreenshotPath);
      return true;
    }

    console.log('Les images sont différentes');
    return false;
  } catch (error) {
    console.error(`Erreur lors de la comparaison: ${error.message}`);
    return false;
  }
}

// Fonction utilitaire pour créer des références
async function createReferenceScreenshot(
  page: Page,
  outputPath: string,
  selector?: string,
  fullPage: boolean = false
): Promise<void> {
  if (selector) {
    await page.waitForSelector(selector);
    const screenshot = await page.locator(selector).screenshot();
    fs.writeFileSync(outputPath, screenshot);
  } else {
    await page.screenshot({ path: outputPath, fullPage });
  }
  console.log(`Image de référence créée: ${outputPath}`);
}

export { compareScreenshotWithReference, createReferenceScreenshot };
