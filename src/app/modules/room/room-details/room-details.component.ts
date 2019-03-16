import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RoomService } from 'src/app/core/services/room.service';
import { IRoom, IStudent } from 'src/app/core/interfaces/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import { StudentService } from 'src/app/core/services/student.service';
import { LogsWatcher } from 'src/app/core/services/logs.service';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import * as creds from 'src/app/core/credentials/client_secret.json';
const fs = (<any>window).require("fs");
const GoogleSpreadsheet = (<any>window).require('google-spreadsheet');

export interface ExcelColumn{
  Hodem: string
  MSSV: number
  NS: number
  STT: number
  Ten: string
}

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
    private studentService: StudentService,
    private logsWatcher: LogsWatcher
  ) { }

  incomingFile(event) {
    this.file = event.target.files[0];
  }

  ngOnInit() {
    this.createSpreadsheet();
    this.logsWatcher.initLogsWatcher();
    this.utilsService.setRoomDetailsOpen(false);
    this.logsWatcher.successEvent.subscribe((success: boolean) => {
      if (success) {
        this.studentService.getAll().then((students: IStudent[]) => {
          this.studentsInRoom.length = 0;
          this.studentsInRoom.push(...students);
        });
      }
    })
    this.route.params.subscribe((params: Params) => {
      const roomId = params['id'];
      this.roomService.getAll().then((roomList: IRoom[]) => {
        this.currentRoom = _.find(roomList, (room: IRoom) => room.id = roomId);
        if (this.currentRoom) {
          this.studentService.getAll().then((students: IStudent[]) => {
            this.studentsInRoom = _.filter(students, (student: IStudent) => student.roomId == roomId);
            this.canUpload = this.studentsInRoom.length == 0;
          });
        }
      });
    });
  }


  upload() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let arrayBuffer = <ArrayBuffer>fileReader.result;
      let buffer = new Uint8Array(arrayBuffer);
      let workbook = XLSX.read(String.fromCharCode.apply(null, buffer), { type: "binary" });
      let sheetNameList = workbook.SheetNames;
      let worksheet = workbook.Sheets[sheetNameList[0]];
      let data = XLSX.utils.sheet_to_json(worksheet);
      this.studentsInRoom = _.map(data, item => mapToStudents(item, this.currentRoom));
      createFolders(this.studentsInRoom);
    }
    fileReader.readAsArrayBuffer(this.file);

    let mapToStudents = (data: ExcelColumn, room: IRoom) => {
      return <IStudent>{ roomId: room.id, roomName: room.name, mssv: data.MSSV, firstName: data.Hodem, lastName: data.Ten}
    }

    let createFolders = (students: IStudent[]) => {
      _.forEach(students, (student: IStudent) => {
        let dir = localStorage.getItem('studentFolder') + student.mssv;
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
          this.studentService.add(student);
        }
      });
    }
  }

  createSpreadsheet() {
    var doc = new GoogleSpreadsheet(localStorage.getItem('spreadsheetId'));
    doc.useServiceAccountAuth(creds, function (err: any) {

      doc.getRows(1, function (err: any, rows) {
      });
    });
  }

}
