import { Injectable, EventEmitter } from '@angular/core';
import { StudentService } from './student.service';
import { IStudent } from '../interfaces/core';
import * as _ from 'lodash';

const chokidar = (<any>window).require('chokidar');
const path = (<any>window).require('path');
const fs = (<any>window).require('fs');

@Injectable({
    providedIn: 'root'
})
export class LogsWatcher {
    private watcher: any;
    public successEvent = new EventEmitter<boolean>();

    constructor(
        private studentService: StudentService
    ) {
    }

    public initLogsWatcher() {
        let logsFolder = localStorage.getItem('logsFolder');
        this.watcher = chokidar.watch(logsFolder, {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        this.watcher.on('add', this.updateScore);
    }

    private updateScore = (absolutePath: any) => {
        let fileWithExtension = _.last(path.normalize(absolutePath).split('\\'));
        let fileName = _.first(fileWithExtension.split('.'));
        let mssv = Number(fileName.split('][')
            .join(',').split('[')
            .join(',').split(']')
            .join(',').split(',')[1]);
        fs.readFile(absolutePath, {
            encoding: 'utf-8'
        }, (err: any, scoreLog: string) => {
            if (!err) {
                const result = {
                    mssv,
                    scoreLog
                };

                this.studentService.getAll().then((students: IStudent[]) => {
                    let updateStudent = <IStudent>_.find(students, (student: IStudent) => student.mssv == result.mssv);
                    if (updateStudent) {
                        updateStudent.score = scoreLog;
                    }
                    this.studentService.update(updateStudent.id, updateStudent).then(() => {
                        this.successEvent.emit(true);
                    });
                });

            } else {
                console.log(err);
            }
        });


    }
}
