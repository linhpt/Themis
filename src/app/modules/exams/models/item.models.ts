import { IContestant } from "src/app/core/interfaces/core";

export const SPECIAL_CHARS = {
    TRIANGULAR_BULLET: 0x2023,
    NEWLINE: '\n',
    COLON: ':'
}

export const PATTERNS = {
    COLONE_TRIANGLE_BULLET: /:|‣/,
    FNAME_REGEX: /[[\]]{1,2}/
}

export interface IResult {
    contestantId: number;
    taskName: string;
    content: string;
}

export interface IContestantRank extends IContestant {
    rank?: number;
    score?: number;
}

export const SUBMIT_SHEMA = ['id', 'contestantName', 'taskName', 'examName', 'timeSubmission', 'score'];

export interface IContestantWithKey {
    id: number;
    generateUUIDKey: string;
}
