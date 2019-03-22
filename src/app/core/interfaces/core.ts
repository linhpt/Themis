export interface IDocument {
  id?: number;
}

export interface IExam extends IDocument {
  name?: string;
  started?: boolean;
  description?: string;
  timeCreated?: string;
  sheetId?: string;
}

export interface IContestant extends IDocument {
  examId?: number;
  fullName?: string;
  aliasName?: string;
  email?: string;
  joinDate?: string;
  dob?: string;
}

export interface ITask extends IDocument {
  examId?: number;
  name?: string;
  timeCreated?: string;
  description?: string;
}

export interface ISubmission extends IDocument {
  taskId?: number;
  examId?: number;
  contestantId?: number;
  timeSubmission?: string;
  score?: string;
}

export enum DocType {
  EXAM = 'Exam',
  CONTESTANT = 'Contestant',
  TASK = 'Task',
  SUBMISSION = 'Submission' 
}