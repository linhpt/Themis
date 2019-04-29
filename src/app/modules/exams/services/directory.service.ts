import { Injectable } from '@angular/core';
const fs = (<any>window).require('fs');
const fsExtra = (<any>window).require('fs-extra');

@Injectable({
    providedIn: 'root'
})
export class DirectoryService {

    emptyDirectory(directory: string) {
        fsExtra.emptyDirSync(directory);
    }

    createDirectory(dir: string) {
        if (!dir) return;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    createFile(absolutePath: string, content: string) {
        fs.writeFile(absolutePath, content, (err: string) => {
            if (err) return console.log(err);
        });
    }
}
