import { Component, OnInit, Input } from '@angular/core';
import { ITask, ITest, IExam } from 'src/app/core/interfaces/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskDatabase } from 'src/app/core/services/db-utils/task.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import * as _ from 'lodash';
import { ExamDatabase } from 'src/app/core/services/db-utils/exam.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AlertDialogComponent } from 'src/app/core/alert-dialog/alert-dialog.component';
const uuidv1 = (<any>window).require('uuid/v1');

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  @Input() action: string;
  taskForm: FormGroup;
  submitted: boolean = false;
  editMode = false;
  examStarted = true;
  tasks: ITask[] = [];
  private examId: number;
  private taskId: number;

  get f() {
    return this.taskForm.controls;
  }

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private examDatabase: ExamDatabase,
    private taskDatabase: TaskDatabase
  ) {


  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {

      const id = +params['id'];

      if (this.action == 'create') {
        this.examId = id;
        this.taskDatabase.getByExamId(id).then((tasks: ITask[]) => {
          this.tasks = tasks;
        });
      } else {
        this.taskId = id;
      }
      this.taskForm = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        examId: '',
        timeCreated: '',
        description: ['', Validators.required],
        tests: this.fb.array([])
      });

      this.patchValues();
    });
  }

  onSubmit() {
    this.submitted = true;
    const task = this.processToSave();
    this.save(task);
  }

  save(task: ITask) {
    if (this.action == 'create') {
      if (_.some(this.tasks, (task1: ITask) => task1.name == task.name)) {
        let message = {
          title: `Task information`,
          message: `Task with name is already existed. Please use another name.`
        }

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = message;
        this.dialog.open(AlertDialogComponent, dialogConfig);
      } else {
        this.taskDatabase.add(task);
      }

    } else {
      this.taskDatabase.update(task.id, task);
    }
    this.back();
  }

  patchValues() {

    if (this.action == 'create') {
      const now = new Date;
      this.taskForm.patchValue({
        timeCreated: now.toString(),
        examId: this.examId
      });

      delete this.taskForm.controls['id'];

    } else if (this.action == 'edit') {
      this.taskDatabase.getById(this.taskId).then((task: ITask) => {

        this.taskForm.patchValue({
          id: task.id,
          timeCreated: task.timeCreated,
          examId: task.examId,
          name: task.name,
          description: task.description
        });

        this.examDatabase.getById(task.examId).then((exam: IExam) => {
          this.examStarted = exam.started;
        });

        _.forEach(task.tests, (test: ITest) => {
          this.addTest(test);
        });

      });
    }
  }

  processToSave() {
    if (this.action == 'create') {
      _.forEach((<FormArray>this.taskForm.controls['tests']).controls, (tests: FormGroup) => {
        tests.controls['id'].setValue(uuidv1());
      });
    }
    return this.taskForm.value;
  }

  addTest(test: ITest = undefined) {

    const tests = <FormArray>this.taskForm.controls['tests'];
    const form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      input: ['', Validators.required],
      output: ['', Validators.required]
    });

    if (test) {
      form.patchValue(test);
    }

    tests.push(form);
  }

  removeTest(index: number) {
    const tests = <FormArray>this.taskForm.controls['tests'];
    tests.removeAt(index);
  }

  edit() {
    this.editMode = true;
  }

  back() {
    this.location.back();
  }
}
