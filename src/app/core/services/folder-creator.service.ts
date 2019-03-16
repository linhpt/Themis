import { Injectable, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

const chokidar = (<any>window).require('chokidar');
const path = (<any>window).require('path');
const fs = (<any>window).require('fs');
const fsExtra = (<any>window).require('fs-extra');

@Injectable({
    providedIn: 'root'
})
export class FolderCreator {
    examFolder: string;

    constructor(
    ) {
        this.examFolder = localStorage.getItem('examFolder');
    }

    createContestants(contestantIds: Array<number>) {
        let contestantsFolder = this.examFolder + 'contestants';
        if (!fs.existsSync(contestantsFolder)) {
            fs.mkdirSync(contestantsFolder);
        }

        for (var i = 0; i < contestantIds.length; i++){
            let contestant = contestantsFolder + '\\' +  contestantIds[i];
            if (!fs.existsSync(contestant)) {
                fs.mkdirSync(contestant);
            }
    
        }
    }

    createTasks(taskNames: Array<string>) {
        let tasksFolder = this.examFolder + 'tasks';
        if (!fs.existsSync(tasksFolder)) {
            fs.mkdirSync(tasksFolder);
        }

        for (var i = 0; i < taskNames.length; i++){
            let taskFolder = tasksFolder + '\\' +  taskNames[i];
            if (!fs.existsSync(taskFolder)) {
                fs.mkdirSync(taskFolder);
            }
    
        }
    }
}
