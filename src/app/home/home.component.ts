import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { tableStructure } from './home.model';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CreateNewComponent } from '../create-new/create-new.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '../services/storage.service';
import Swal from 'sweetalert2';

let table_data : tableStructure[] = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, DoCheck {

  dataSource = [...table_data];
  showListFlag: boolean = false;

  displayedColumns: string[] = ['id', 'product_name', 'product_price', 'product_description', 'product_image', 'product_category', 'product_brand', 'action'];
  @ViewChild(MatTable) table: MatTable<tableStructure>;

  constructor(public dialog: MatDialog, private storage: StorageService) { }

  ngOnInit(): void {
  }

  // constantly look for changes in the data from local storage
  ngDoCheck(): void {
    if(this.showListFlag) {
      this.dataSource = this.storage.getData('data');
    }
  }

  // open dialog to create new data
  openDialog() {
    const dialogRef: MatDialogRef<CreateNewComponent> = this.dialog.open(CreateNewComponent, {
      width: '50vw',
      height: '90vh',
      data: null // pass null to the dialog to indicate that it is a new data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed for creating new data');
    });
  }

  // show list of data
  showList() {
    this.showListFlag = !this.showListFlag;
    if(this.showListFlag) {
      this.dataSource = this.storage.getData('data');
      console.log(this.dataSource);
    }
  }

  // delete data from the table
  deleteData(row: tableStructure): void {
    // taking confirmation from the user
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        // if user confirms, delete the data
        this.deleteDataFromStorage(row);
        Swal.fire(
          'Deleted!',
          'Your data has been deleted.',
          'success'
        )
      }
    })
    
  }

  // delete data from local storage
  deleteDataFromStorage(row: tableStructure) {
    const existingData = this.storage.getData('data');
    const newData = existingData.filter((item: tableStructure) => item.id !== row.id);
    this.storage.setData('data', newData);
    this.dataSource = this.storage.getData('data');
  }

  // edit data from the table
  editData(row: tableStructure): void {

    // pass data to the dialog
    const dialogRef: MatDialogRef<CreateNewComponent> = this.dialog.open(CreateNewComponent, {
      width: '50vw',
      height: '90vh',
      data: row // pass the data to the dialog to indicate that it is an existing data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed for editing data');
    });

  }

}
