import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'description'
})
export class DescriptionPipe implements PipeTransform {

    transform(text: string, maxLength: number): string {
        let trimmedString = text.substr(0, maxLength);
        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));

        return `${trimmedString}...`;
    }

}
