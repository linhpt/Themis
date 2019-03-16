import { ExamsModule } from './exams.module';

describe('ExamsModule', () => {
  let examsModule: ExamsModule;

  beforeEach(() => {
    examsModule = new ExamsModule();
  });

  it('should create an instance', () => {
    expect(examsModule).toBeTruthy();
  });
});
