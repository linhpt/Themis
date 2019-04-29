import { Injectable } from '@angular/core';
import * as _ from 'lodash';

const fs = (<any>window).require('fs');

@Injectable({
    providedIn: 'root'
})
export class FileService {
    remove(absolutePath: string, message: string) {
        fs.unlink(absolutePath, () => {
            console.log(message);
        });
    }

    move(from: string, to: string) {
        fs.createReadStream(from).pipe(fs.createWriteStream(to));  
    }

    read(absolutePath: string, callback: (err: string, content: string) => void) {
        fs.readFile(absolutePath, { encoding: 'utf-8' }, callback);
    }

    temporary(absolutePath: string) {
        if (_.last(absolutePath.split('.')) == 'tmp') return true;
        return false;
    }
}
