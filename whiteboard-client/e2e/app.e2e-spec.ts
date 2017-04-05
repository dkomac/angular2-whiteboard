import { WhiteboardPage } from './app.po';

describe('whiteboard App', () => {
  let page: WhiteboardPage;

  beforeEach(() => {
    page = new WhiteboardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
