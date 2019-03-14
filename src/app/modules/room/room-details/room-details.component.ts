import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ClassService } from 'src/app/core/services/class.service';
import { IClass, IStudent } from 'src/app/core/interfaces/core';
import * as _ from 'lodash';
import { UtilsService } from 'src/app/core/services/utils.service';
import * as XLSX from 'xlsx';
import { StudentService } from 'src/app/core/services/student.service';
const fs = (<any>window).require("fs");

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {

  arrayBuffer: any;
  file: File;
  dsmssv: any = [];
  lop: any;
  canUpload = false;

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private utilsService: UtilsService,
    private studentService: StudentService
  ) { }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  ngOnInit() {
    this.utilsService.toggle(true);
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.classService.getAll().then((classList: IClass[]) => {
        this.lop = _.find(classList, (cls: IClass) => cls.id == id);

        if (this.lop) {
          this.canUpload = false;
          this.studentService.getAll().then((students: IStudent[]) => {
            this.classService.getAll().then((classes: IClass[]) => {
              this.dsmssv = students;
              let klass = _.find(classes, klass => klass.id = this.lop.id);
              _.forEach(this.dsmssv, sv => {
                sv.tenLop = klass.name;
              });
            });
            
          });
        } else {
          this.canUpload = true;
        }
      });
    });
  }

  upload() {
    let folder = (mssv) => `C:\\Users\\linhp\\Documents\\personal\\students\\${mssv}`;
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = [];

      for (var i = 0; i != data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }

      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var datajson = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.dsmssv = _.map(datajson, data => {
        return {
          lop: this.lop.id,
          mssv: data.__EMPTY,
          hodem: data.__EMPTY_1,
          ten: data.__EMPTY_2,
          diem: null
        }
      });
      this.dsmssv = _.filter(this.dsmssv, sv => typeof sv.mssv == 'number');
      _.forEach(this.dsmssv, sv => {
        let dir = folder(sv.mssv);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
          let student = {
            lop: this.lop.id,
            mssv: sv.mssv,
            hodem: sv.hodem,
            ten: sv.ten,
            diem: ''
          };
          this.studentService.add(student);
        }
      });

    }
    fileReader.readAsArrayBuffer(this.file);
  }

}
