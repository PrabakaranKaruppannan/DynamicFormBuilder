import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilderService } from '../../services/form-builder.service';
import { FormGroup, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import moment from 'moment';

@Component({
	selector: 'app-dynamic-form',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './dynamic-form.component.html',
	styleUrl: './dynamic-form.component.css'
})
export class DynamicFormComponent {
	
	@Input() formDefinition: any[] = []; // JSON definition passed as input
	form!: FormGroup;
	submittedData: any = null; 
	private initialized: boolean = false;

  	constructor(private formBuilderService: FormBuilderService, private http: HttpClient) {}

	ngOnInit(): void {
		if (this.initialized) {
            return; // Skip if already initialized
        }
        this.initialized = true; // Set the flag

		// Load JSON file containing form definition
		this.http.get<any[]>('/assets/form-definition.json').subscribe(data => {
			this.formDefinition = data;
			this.form = this.formBuilderService.buildForm(this.formDefinition);
		});
	}

	onSubmit(): void {
		if (this.form.valid) {			
			console.log('Form Submitted:', this.form.value);
			let date = new Date(this.form.value["OrderedDate"])
			this.submittedData  = {
				"Order No":  this.form.value["OrderedInfo"] + " " + this.form.value["Order No"], 
				"OrderedDate": moment(date, "DD-MM-YYYY").format("l"), 
				"Price": this.form.value["Price"],
				"Refurbished": this.form.value["Refurbished"],
				"Address": this.form.value["Address"]
			}
		} else {
			console.log('Form is invalid');
			Object.keys(this.form.controls).forEach(controlName => {
				this.form.controls[controlName]?.markAsTouched();
				this.form.controls[controlName]?.markAsDirty();
			});
		}
	}

	isFieldVisible(field: any): boolean {
		if (!field.condition || !field.rules) {
			return true;
		}
		return this.formBuilderService.evaluateCondition(field, this.form);
	}
}
