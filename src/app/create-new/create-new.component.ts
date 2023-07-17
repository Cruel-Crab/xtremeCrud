import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StorageService } from '../services/storage.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { tableStructure } from '../home/home.model';

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss'],
})
export class CreateNewComponent implements OnInit {
  new_product: FormGroup;
  isEditing: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateNewComponent>,
    private storage: StorageService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: tableStructure // Inject the data object
  ) {}

  ngOnInit(): void {
    this.isEditing = !!this.data; // Check if data is provided to determine if it's editing or creating
    this.initializeForm();
    if (this.isEditing) {
      // if the data is not null, populate the form controls with the data received
      this.populateFormWithData();
    }
  }

  initializeForm() {
    this.new_product = this.formBuilder.group({
      product_name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      product_price: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ],
      ],
      product_description: [''],
      product_image: [''],
      product_category: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      product_brand: ['', Validators.required],
    });
  }

  // fn to set data to the local storage
  addData() {
    this.new_product.markAllAsTouched();
    if (!this.new_product.valid) {
      return;
    }

    const existingData = this.storage.getData('data'); // get the existing data
    const formValues = this.new_product.value;     // form values

    // if editing true -> then update the existing data
    if (this.isEditing) {
      const index = existingData.findIndex((item) => item.id === this.data.id); // find the index of the data to be updated

      formValues.id = this.data.id;
      formValues.action = `Action ${this.data.id}`;
      existingData[index] = formValues;
    } 
    else {
      // add a new id to the form values
      formValues.id = existingData.length + 1;
      formValues.action = `Action ${formValues.id}`;

      existingData.push(formValues); // add the new data to the existing data
    }

    this.storage.setData('data', existingData); // set the updated data to the local storage

    Swal.fire('Success', 'Data updated successfully', 'success').then(() => {
      this.closeDialog();
      // route to home page
      this.router.navigate(['']);
    });
    return;
  }

  // close the dialog
  closeDialog() {
    this.new_product.reset(); // reset the form
    this.dialogRef.close(); // closing the dialog
  }

  // Populating the form controls with the data object
  populateFormWithData() {
    if (this.data) { // if data is not null, then populate the form controls
      this.new_product.patchValue({
        product_name: this.data.product_name,
        product_price: this.data.product_price,
        product_description: this.data.product_description,
        product_image: this.data.product_image,
        product_category: this.data.product_category,
        product_brand: this.data.product_brand,
      });
    }
  }
}
