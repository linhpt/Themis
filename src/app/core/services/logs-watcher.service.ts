import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LogsWatcher {
    successEvent = new EventEmitter<boolean>();

    constructor(
    ) {
    }
}
