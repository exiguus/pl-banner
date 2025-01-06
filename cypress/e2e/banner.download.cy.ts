import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { bannerWidth, bannerHeight } from 'types/CSS';

const imagePathFixture = 'cypress/fixtures/banner.png';
const imagePathDownloads = 'cypress/downloads/banner.png';

describe('banner download spec', () => {
  const url = Cypress.config('baseUrl');
  if (!url) {
    throw new Error('Missing baseUrl');
  }

  it('should download banner image as png', () => {
    cy.visit(url);
    cy.wait(6000);
    const downloadButton = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-menu')
      .shadow()
      .find('my-menu-canvas')
      .shadow()
      .find('[data-testid="menu-download"]')
      .shadow()
      .find('button');
    downloadButton.click({
      force: true,
    });
    cy.wait(6000);
    cy.readFile(imagePathDownloads).should('exist');
    cy.exec(`rm ${imagePathDownloads}`);
  });

  it('should download banner image look like expected', () => {
    cy.visit(url);
    cy.wait(6000);
    const sortAscButton = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-menu')
      .shadow()
      .find('my-menu-canvas')
      .shadow()
      .find('[data-testid="menu-sort-asc"]')
      .shadow()
      .find('button');
    sortAscButton.click({
      force: true,
    });
    cy.wait(1000);
    const downloadButton = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-menu')
      .shadow()
      .find('my-menu-canvas')
      .shadow()
      .find('[data-testid="menu-download"]')
      .shadow()
      .find('button');
    downloadButton.click({
      force: true,
    });
    cy.wait(6000);

    cy.readFile(imagePathFixture, 'base64').then((image1) => {
      const buffer1 = Buffer.from(image1, 'base64');
      const png1 = PNG.sync.read(buffer1);

      cy.readFile(imagePathDownloads, 'base64').then((image2) => {
        const buffer2 = Buffer.from(image2, 'base64');
        const png2 = PNG.sync.read(buffer2);

        const { width, height } = png1;
        const diff = new PNG({ width, height });

        const numDiffPixels = pixelmatch(
          png1.data,
          png2.data,
          diff.data,
          width,
          height,
          { threshold: 0.5 }
        );

        expect(numDiffPixels).to.eq(0);
      });

      cy.exec(`rm ${imagePathDownloads}`);
    });
  });

  it('should download banner image with correct dimensions', () => {
    cy.visit(url);
    cy.wait(6000);
    const downloadButton = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-menu')
      .shadow()
      .find('my-menu-canvas')
      .shadow()
      .find('[data-testid="menu-download"]')
      .shadow()
      .find('button');
    downloadButton.click({
      force: true,
    });
    cy.wait(6000);

    cy.readFile(imagePathDownloads, 'base64').then((image) => {
      const buffer = Buffer.from(image, 'base64');
      const png = PNG.sync.read(buffer);

      expect(png.width).to.eq(bannerWidth);
      expect(png.height).to.eq(bannerHeight);
    });

    cy.exec(`rm ${imagePathDownloads}`);
  });
});
