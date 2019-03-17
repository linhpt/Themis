import { Injectable, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { IExam } from '../interfaces/core';

const chokidar = (<any>window).require('chokidar');
const path = (<any>window).require('path');
const fs = (<any>window).require('fs');
const fsExtra = (<any>window).require('fs-extra');

@Injectable({
    providedIn: 'root'
})
export class FolderCreator {
    examFolder: string;
    _exam: IExam;

    constructor(
    ) {
        this.examFolder = localStorage.getItem('examFolder');
    }

    set exam(exam: IExam) {
        this._exam = exam;
    }

    private createIfNotExisted(filePath: string) {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath);
        }
    }

    createContestants(contestantIds: Array<number>) {

        this.createIfNotExisted(this.examFolder + this._exam.examId);
        this.createIfNotExisted(this.examFolder + this._exam.examId + '\\contestants');

        let contestantsFolder = this.examFolder + this._exam.examId + '\\contestants';
        for (var i = 0; i < contestantIds.length; i++){
            let contestant = contestantsFolder + '\\' +  contestantIds[i];
            if (!fs.existsSync(contestant)) {
                fs.mkdirSync(contestant);
            }
    
        }
    }

    createTasks(taskNames: Array<string>) {
        this.createIfNotExisted(this.examFolder + this._exam.examId);
        this.createIfNotExisted(this.examFolder + this._exam.examId + '\\tasks');
        
        let tasksFolder = this.examFolder + this._exam.examId + '\\tasks';
        for (var i = 0; i < taskNames.length; i++){
            let taskFolder = tasksFolder + '\\' +  taskNames[i];
            if (!fs.existsSync(taskFolder)) {
                fs.mkdirSync(taskFolder);
            }
    
        }
    }
}
