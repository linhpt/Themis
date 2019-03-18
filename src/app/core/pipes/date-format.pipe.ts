import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let date = new Date(value);
    return format(date);

    function format(date: Date) {
      let year = date.getFullYear();

      let month = (date.getMonth() + 1).toString();
      let formatedMonth = (month.length === 1) ? ('0' + month) : month;

      let day = date.getDate().toString();
      let formatedDay = (day.length === 1) ? ('0' + day) : day;

      let hour = date.getHours().toString();
      let formatedHour = (hour.length === 1) ? ('0' + hour) : hour;

      let minute = date.getMinutes().toString();
      let formatedMinute = (minute.length === 1) ? ('0' + minute) : minute;

      let second = date.getSeconds().toString();
      let formatedSecond = (second.length === 1) ? ('0' + second) : second;
      
      return `${formatedHour}:${formatedMinute}:${formatedSecond} ${formatedDay}/${formatedMonth}/${year}`;
    }
  }

}
