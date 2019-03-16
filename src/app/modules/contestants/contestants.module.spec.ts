import { ContestantsModule } from './contestants.module';

describe('ContestantsModule', () => {
  let contestantsModule: ContestantsModule;

  beforeEach(() => {
    contestantsModule = new ContestantsModule();
  });

  it('should create an instance', () => {
    expect(contestantsModule).toBeTruthy();
  });
});
