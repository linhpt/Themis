import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RoomService } from 'src/app/core/services/room.service';
import { IRoom, IStudent } from 'src/app/core/interfaces/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import { StudentService } from 'src/app/core/services/student.service';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
const fs = (<any>window).require("fs");
const excel = (<any>window).require('excel4node');

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {

  arrayBuffer: any;
  file: File;
  currentRoom: IRoom;
  studentsInRoom: IStudent[] = [];
  canUpload = false;

  constructor(
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private roomService: RoomService,
    private studentService: StudentService
  ) { }

  incomingFile(event) {
    this.file = event.target.files[0];
  }

  ngOnInit() {
    this.utilsService.toggle(true);
    this.route.params.subscribe((params: Params) => {
      const roomId = params['id'];

      this.roomService.getAll().then((roomList: IRoom[]) => {
        this.currentRoom = _.find(roomList, room => room.id = roomId);
        if (this.currentRoom) {
          this.studentService.getAll().then((students: IStudent[]) => {
            this.studentsInRoom  = _.filter(students, student => student.roomId == roomId);
            this.canUpload = this.studentsInRoom.length == 0;
          });
        }
      });
    });
  }

  createExcel() {
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet('Sheet 1');
    let style = workbook.createStyle({
      font: {
        color: '#FF0800',
        size: 12
      },
    });

    _.forEach(this.studentsInRoom, (student: IStudent, index: number) => {
      worksheet.cell(index + 1, 1).number(student.mssv).style(style);
      worksheet.cell(index + 1, 2).string(student.firstName).style(style);
      worksheet.cell(index + 1, 3).string(student.lastName).style(style);
      worksheet.cell(index + 1, 4).number(student.roomId).style(style);
      worksheet.cell(index + 1, 4).string(student.roomName).style(style);
      worksheet.cell(index + 1, 5).string(student.score).style(style);
    });

    workbook.write('C:\\Users\\linhp\\Google Drive (linhgando@gmail.com)\\ExcelFile.xlsx');
  }

  upload() {
    let folder = (mssv: string) => `C:\\Users\\linhp\\Documents\\personal\\Students\\${mssv}`;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      let data = new Uint8Array(this.arrayBuffer);
      let arr = [];

      for (let i = 0; i != data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }

      let bstr = arr.join('');
      let workbook = XLSX.read(bstr, { 
        type: "binary" 
      });
      let firstSheetName = _.first(workbook.SheetNames);
      let worksheet = workbook.Sheets[firstSheetName];
      let dataJson = XLSX.utils.sheet_to_json(worksheet, { 
        raw: true 
      });
      this.studentsInRoom = _.map(dataJson, data => {
        return <IStudent>{
          roomId: this.currentRoom.id,
          roomName: this.currentRoom.name,
          mssv: data.__EMPTY,
          firstName: data.__EMPTY_1,
          lastName: data.__EMPTY_2,
        }
      });
      this.studentsInRoom = _.filter(this.studentsInRoom, (student: IStudent) => typeof student.mssv == 'number');
      _.forEach(this.studentsInRoom, (student: IStudent) => {
        let dir = folder(student.mssv);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
          this.studentService.add(student);
        }
      });
      this.createExcel();
    }
    fileReader.readAsArrayBuffer(this.file);
  }

}
