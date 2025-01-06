import { PRESELECTED } from 'utils/preselectedSvgs';
import { gradients } from 'types/CSS';

describe('banner canvas spec', () => {
  const url = Cypress.config('baseUrl');
  if (!url) {
    throw new Error('Missing baseUrl');
  }

  it('should show preselect banner items', () => {
    cy.visit(url);
    const buttons = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-banner')
      .shadow()
      .find('.banner-grid my-button');
    buttons.each((button) => {
      const logo = cy.wrap(button.find('my-logo'));
      logo.should('exist');

      logo.invoke('attr', 'item').then((data) => {
        if (data) {
          const item = JSON.parse(`${data}`);
          if (
            !item.id ||
            !PRESELECTED.some((t) => item.id.toLowerCase().match(t))
          ) {
            const error = `Title ${item.title} not find in preselected items`;
            throw new Error(error);
          }
        } else {
          throw new Error('No data found');
        }
      });
    });
  });

  it('should change banner width', () => {
    cy.visit(url);
    // change width via menu
    const input = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-menu')
      .shadow()
      .find('my-menu-canvas')
      .shadow()
      .find('[data-testid="menu-width"] input');
    expect(input).to.exist;
    input.invoke('val', '50').trigger('change').should('have.value', '50');

    // check width
    const homeElement = cy.get('my-index').shadow().find('my-home');

    homeElement.then(($el) => {
      const style = getComputedStyle($el[0]);
      const width = style.getPropertyValue('--banner-inner-width').trim();
      expect(width).to.eq('50%');
    });
  });

  it('should randomize banner items', () => {
    cy.visit(url);
    const buttonsBefore = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-banner')
      .shadow()
      .find('.banner-grid my-button');
    let sortIndexBefore = 0;
    const logoTitleBefore: Array<{
      index: number;
      title: string;
    }> = [];

    buttonsBefore.each((button) => {
      const logo = cy.wrap(button.find('my-logo'));
      logo.should('exist');

      logo.invoke('attr', 'item').then((data) => {
        if (data) {
          const item = JSON.parse(`${data}`);
          logoTitleBefore.push({
            index: sortIndexBefore,
            title: item.title,
          });
        } else {
          throw new Error('No data found');
        }
      });
      sortIndexBefore++;
    });

    const randomizeButton = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-menu')
      .shadow()
      .find('my-menu-canvas')
      .shadow()
      .find('[data-testid="menu-randomize"]')
      .shadow()
      .find('button');
    expect(randomizeButton).to.exist;
    randomizeButton.click({
      force: true,
    });
    cy.wait(1000);

    const buttonsAfter = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-banner')
      .shadow()
      .find('.banner-grid my-button');
    let sortIndexAfter = 0;
    const logoTitleAfter: Array<{
      index: number;
      title: string;
    }> = [];
    buttonsAfter
      .each((button) => {
        const logo = cy.wrap(button.find('my-logo'));
        logo.should('exist');

        logo.invoke('attr', 'item').then((data) => {
          if (data) {
            const item = JSON.parse(`${data}`);
            logoTitleAfter.push({
              index: sortIndexAfter,
              title: item.title,
            });
          } else {
            throw new Error('No data found');
          }
        });
        sortIndexAfter++;
      })
      .then(() => {
        expect(logoTitleBefore).not.to.deep.equal(logoTitleAfter);
      });
  });

  it('should sort banner items asc', () => {
    cy.visit(url);
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
    expect(sortAscButton).to.exist;
    sortAscButton.click({
      force: true,
    });
    cy.wait(1000);

    const buttons = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-banner')
      .shadow()
      .find('.banner-grid my-button');
    let sortIndex = 0;
    const logoTitle: Array<{
      index: number;
      title: string;
    }> = [];
    buttons.each((button) => {
      const logo = cy.wrap(button.find('my-logo'));
      logo.should('exist');

      logo.invoke('attr', 'item').then((data) => {
        if (data) {
          const item = JSON.parse(`${data}`);
          logoTitle.push({
            index: sortIndex,
            title: item.title,
          });
        } else {
          throw new Error('No data found');
        }
      });
      sortIndex++;
    });

    logoTitle.sort((a, b) => a.title.localeCompare(b.title));
    for (let i = 0; i < logoTitle.length; i++) {
      const button = cy
        .get('my-index')
        .shadow()
        .find('my-home')
        .shadow()
        .find('my-banner')
        .shadow()
        .find('.banner-grid my-button')
        .eq(i);
      const logo = button.find('my-logo');
      logo.invoke('attr', 'item').then((data) => {
        if (data) {
          const item = JSON.parse(`${data}`);
          expect(item.title).to.eq(logoTitle[i].title);
        }
      });
    }
  });

  it('should sort banner items desc', () => {
    cy.visit(url);
    const sortDescButton = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-menu')
      .shadow()
      .find('my-menu-canvas')
      .shadow()
      .find('[data-testid="menu-sort-desc"]')
      .shadow()
      .find('button');
    expect(sortDescButton).to.exist;
    sortDescButton.click({
      force: true,
    });
    cy.wait(1000);

    const buttons = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-banner')
      .shadow()
      .find('.banner-grid my-button');
    let sortIndex = 0;
    const logoTitle: Array<{
      index: number;
      title: string;
    }> = [];
    buttons.each((button) => {
      const logo = cy.wrap(button.find('my-logo'));
      logo.should('exist');

      logo.invoke('attr', 'item').then((data) => {
        if (data) {
          const item = JSON.parse(`${data}`);
          logoTitle.push({
            index: sortIndex,
            title: item.title,
          });
        } else {
          throw new Error('No data found');
        }
      });
      sortIndex++;
    });

    logoTitle.sort((a, b) => b.title.localeCompare(a.title));
    for (let i = 0; i < logoTitle.length; i++) {
      const button = cy
        .get('my-index')
        .shadow()
        .find('my-home')
        .shadow()
        .find('my-banner')
        .shadow()
        .find('.banner-grid my-button')
        .eq(i);
      const logo = button.find('my-logo');
      logo.invoke('attr', 'item').then((data) => {
        if (data) {
          const item = JSON.parse(`${data}`);
          expect(item.title).to.eq(logoTitle[i].title);
        }
      });
    }
  });

  it('should change random background gradient', () => {
    cy.visit(url);
    const currentGradient = gradients[0];
    const randomGradientButton = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-menu')
      .shadow()
      .find('my-menu-canvas')
      .shadow()
      .find('[data-testid="menu-random-gradient"]')
      .shadow()
      .find('button');
    expect(randomGradientButton).to.exist;
    randomGradientButton.click({
      force: true,
    });
    cy.wait(1000);

    const homeElement = cy.get('my-index').shadow().find('my-home');

    homeElement.then(($el) => {
      const style = getComputedStyle($el[0]);
      const bgColor = style.getPropertyValue('--bg-color').trim();
      expect(bgColor).to.not.eq(currentGradient);
    });
  });

  it('should change banner background color', () => {
    cy.visit(url);
    const bgColor = '#ff0000';
    const colorInput = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-menu')
      .shadow()
      .find('my-menu-canvas')
      .shadow()
      .find('[data-testid="menu-color"] input');
    expect(colorInput).to.exist;
    colorInput
      .invoke('val', bgColor)
      .trigger('change')
      .should('have.value', '#ff0000');
    cy.wait(1000);

    const homeElement = cy.get('my-index').shadow().find('my-home');

    homeElement.then(($el) => {
      const style = getComputedStyle($el[0]);
      const bgColorCurrent = style.getPropertyValue('--bg-color').trim();
      expect(bgColorCurrent).to.eq(bgColor);
    });
  });

  it('should change banner background gradient', () => {
    cy.visit(url);
    const gradientButtonElement = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-menu')
      .shadow()
      .find('my-menu-gradient')
      .shadow()
      .find('my-button:first-child');
    let gradient = '';
    gradientButtonElement.invoke('attr', 'style').then((style) => {
      if (style) {
        const bg = style.match(/--button-gradient-bg: (.+);/);
        if (bg) {
          gradient = bg[1];
        }
      }
    });

    const gradientButton = cy
      .get('my-index')
      .shadow()
      .find('my-home')
      .shadow()
      .find('my-menu')
      .shadow()
      .find('my-menu-gradient')
      .shadow()
      .find('my-button:first-child')
      .shadow()
      .find('button');
    expect(gradientButton).to.exist;
    gradientButton.click({
      force: true,
    });
    cy.wait(1000);

    const homeElement = cy.get('my-index').shadow().find('my-home');

    homeElement.then(($el) => {
      const style = getComputedStyle($el[0]);
      const bgColor = style.getPropertyValue('--bg-color').trim();
      expect(bgColor).to.eq(gradient);
    });
  });
});
