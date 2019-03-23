import { IContestantRank } from "./start-exam.component";
import { IContestantSubmission } from "./details-contestant/details-contestant.component";

export const contestantsRank: IContestantRank[] = [
    {
        rank: 1,
        id: 18,
        fullName: 'Pham Tuan Linh',
        aliasName: 'LinhPT',
        dob: '20/10/1998',
        email: 'linhgando@gmail.com',
        examId: 2,
        joinDate: '20/10/2015',
        score: 890
    },
    {
        rank: 2,
        id: 14,
        fullName: 'Nguyen Tran Nhan',
        aliasName: 'pocolomos',
        dob: '03/11/1988',
        email: 'nguyen.tran@gmail.com',
        examId: 3,
        joinDate: '19/02/2015',
        score: 220
    },
    {
        rank: 3,
        id: 23,
        fullName: 'Luc Van Minh',
        aliasName: 'mink.luk',
        dob: '08/04/1996',
        email: 'minh.luc96@gmail.com',
        examId: 2,
        joinDate: '20/03/2012',
        score: 118
    },
    {
        rank: 4,
        id: 12,
        fullName: 'Hoang Tran Xuan',
        aliasName: 'Katakuri',
        dob: '01/01/1995',
        email: 'hoangtran0101@gmail.com',
        examId: 2,
        joinDate: '07/12/2017',
        score: 713
    }
];


export const contestantSubmission: IContestantSubmission[] = [
    {
        id: 18,
        aliasName: 'LinhPT',
        examName: 'HK@2',
        taskName: 'HelloWorld',
        score: 10,
    },
    {
        id: 18,
        aliasName: 'LinhPT',
        examName: 'ACM',
        taskName: 'Tetris',
        score: 21,
    },
    {
        id: 18,
        aliasName: 'LinhPT',
        examName: 'UET Code Camp',
        taskName: 'BigInteger',
        score: 3,
    },
    {
        id: 18,
        aliasName: 'LinhPT',
        examName: 'ACM',
        taskName: 'Dijkstra',
        score: 43,
    },

]