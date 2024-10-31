import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ConditionEvaluatorService } from './condition-evaluator.service';

@Injectable({
	providedIn: 'root'
})
export class FormBuilderService {

	constructor(private fb: FormBuilder, private conditionEvaluator: ConditionEvaluatorService) {}

	// Generate FormGroup dynamically based on form definition
	buildForm(formDefinition: any[]): any {
		let formGroup = this.fb.group({});				
		
		formDefinition.forEach(field => {
			const control = this.createFormControl(field);
			formGroup.addControl(field.name, control);
		});
		
		return formGroup;
	}

	// Create individual form controls based on field definitions
	private createFormControl(field: any): FormControl {
		const validators = [];
		if (field.validator && field.validator.includes('required')) {
			validators.push(Validators.required);
		}
		return new FormControl('', validators);
	}

	// Evaluate conditions based on field values
	evaluateCondition(field: any, form: FormGroup): boolean {			
		// Evaluate all rules based on the specified condition
		const results = field.rules.map((rule: any) => {
			const fieldValue = form.get(rule.field)?.value;
			return this.conditionEvaluator.evaluateCondition(fieldValue, rule.operator, rule.value);
		});
		
		// Apply 'and' or 'or' condition to combine results
		return field.condition === 'and' ? results.every((res: any) => res) : results.some((res: any) => res);		  
	}
}
