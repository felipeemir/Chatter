import { ChatterClientPage } from './app.po';

describe('chatter-client App', function() {
  let page: ChatterClientPage;

  beforeEach(() => {
    page = new ChatterClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
