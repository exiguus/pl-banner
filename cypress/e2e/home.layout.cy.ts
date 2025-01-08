import i18n from '../../i18n.json';

describe('home layout spec', () => {
  const url = Cypress.config('baseUrl');
  if (!url) {
    throw new Error('Missing baseUrl');
  }

  it('headline should exist', () => {
    cy.visit(url);
    const element = cy.get('my-index');
    element.should('exist');
    const dom = element.shadow();
    dom.find('h1').contains(i18n.en.title);
  });

  it('disclaimer should exist', () => {
    cy.visit(url);
    const element = cy.get('my-index');
    element.should('exist');
    const dom = element.shadow();
    dom.find('.disclaimer').contains(i18n.en.disclaimer.replace(/&.*;/g, ''));
  });

  it('description should exist', () => {
    cy.visit(url);
    const element = cy.get('my-index');
    element.should('exist');
    const dom = element.shadow();
    dom.find('.subtitle-container').contains(i18n.en.description);
  });

  it('banner should exist', () => {
    cy.visit(url);
    const element = cy.get('my-index');
    element.should('exist');

    const dom = element.shadow();
    const layout = dom.find('my-layout');
    const home = dom.find('my-home');

    layout.should('exist');
    home.should('exist');

    const banner = home.shadow().find('my-banner').shadow();
    const buttons = banner.find('.banner-grid my-button');

    buttons.should('have.length', 159);

    buttons.each((button) => {
      const wrap = cy.wrap(button);
      const shadow = wrap.shadow();

      shadow.find('button').should('exist');
      shadow.find('slot').should('exist');
    });
  });

  it('menu should exist', () => {
    cy.visit(url);
    const element = cy.get('my-index');
    element.should('exist');

    const dom = element.shadow();
    const layout = dom.find('my-layout');
    const home = dom.find('my-home');

    layout.should('exist');
    home.should('exist');

    const menu = home.shadow().find('my-menu');
    menu.should('exist');

    // somehow the shadow dom is not loaded and buggy
    //  By buggy I mean it only finds the first element
    //   when performing a find on the shadow dom
    //  Normally, if shodow is used, just get the element again
    menu.shadow().then(($el) => {
      const menuGradient = $el.find('my-menu-gradient');
      const menuCanvas = $el.find('my-menu-canvas');
      if (menuGradient.length !== 1) throw new Error('menuGradient not found');
      if (menuCanvas.length !== 1) throw new Error('menuCanvas not found');

      const menuLogoSelect = $el.find('my-menu-logo-select');
      if (menuLogoSelect.length !== 1)
        throw new Error('menuLogoSelect not found');
    });
  });

  it('footer should exist', () => {
    cy.visit(url);
    const element = cy.get('my-index');
    element.should('exist');

    const dom = element.shadow();
    const layout = dom.find('my-layout');
    const footer = layout.find('div[slot="footer"]');

    footer.should('exist');
    footer.contains(i18n.en.disclaimer.replace(/&.*;/g, ''));
  });
});
