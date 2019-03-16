export interface IExam {
  examId?: number;
  name?: string;
  description?: string;
  timeCreated?: string;
}

export interface IContestant {
  contestantId?: number;
  examId?: number;
  firstName?: string;
  lastName?: string;
  joinDate?: string;
  dob?: string;
}

export interface ITask {
  taskId?: number;
  examId?: number;
  name?: string;
  timeCreated?: string;
  description?: string;
}

export interface ISubmission {
  submissionId?: number;
  taskId?: number;
  examId?: number;
  contestantId?: number;
  timeSubmission?: string;
  score?: string;
}