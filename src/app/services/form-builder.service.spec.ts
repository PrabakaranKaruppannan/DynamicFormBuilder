import { TestBed } from '@angular/core/testing';

import { FormBuilderService } from './form-builder.service';
import { FormGroup } from '@angular/forms';

describe('FormBuilderService', () => {
	let service: FormBuilderService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(FormBuilderService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should create a FormGroup based on form definition', () => {
		const formDefinition = [
		  { name: 'firstName', validator: ['required'] },
		  { name: 'age', validator: [] }
		];
	
		const formGroup: FormGroup = service.buildForm(formDefinition);
		
		expect(formGroup.contains('firstName')).toBeTrue();
		expect(formGroup.contains('age')).toBeTrue();
		expect(formGroup.get('firstName')?.validator).toBeTruthy(); // should have validators
		expect(formGroup.get('age')?.validator).toBeNull(); // should not have validators
	});
	
	it('should create form controls with required validators', () => {
		const field = { name: 'email', validator: ['required'] };
		
		const control = service['createFormControl'](field);
		
		expect(control).toBeTruthy();
		expect(control.validator).toBeTruthy(); // should have validators
		expect(control.valid).toBeFalse(); // should be invalid initially
		control.setValue('test@example.com');
		expect(control.valid).toBeTrue(); // should be valid after setting value
	});
	
	it('should evaluate conditions based on field values', () => {
		const formGroup: FormGroup = service.buildForm([
		  { name: 'age', validator: [] }
		]);
	
		formGroup.get('age')?.setValue(25);
	
		const field = {
		  rules: [
			{ field: 'age', operator: '>', value: 18 }
		  ],
		  condition: 'and'
		};
	
		const result = service.evaluateCondition(field, formGroup);
		expect(result).toBeTrue(); // 25 > 18 should return true
	});
	
	it('should evaluate conditions correctly with "or" logic', () => {
		const formGroup: FormGroup = service.buildForm([
		  { name: 'age', validator: [] }
		]);
	
		formGroup.get('age')?.setValue(15);
	
		const field = {
		  rules: [
			{ field: 'age', operator: '<', value: 18 },
			{ field: 'age', operator: '>', value: 20 }
		  ],
		  condition: 'or'
		};
	
		const result = service.evaluateCondition(field, formGroup);
		expect(result).toBeTrue(); // 15 < 18 should return true
	});
	
	it('should evaluate conditions correctly with "and" logic', () => {
		const formGroup: FormGroup = service.buildForm([
		  { name: 'age', validator: [] }
		]);
	
		formGroup.get('age')?.setValue(25);
	
		const field = {
		  rules: [
			{ field: 'age', operator: '>', value: 20 },
			{ field: 'age', operator: '<', value: 30 }
		  ],
		  condition: 'and'
		};
	
		const result = service.evaluateCondition(field, formGroup);
		expect(result).toBeTrue(); // 25 > 20 and 25 < 30 should return true
	});
	
	it('should return false for "and" logic when one condition fails', () => {
		const formGroup: FormGroup = service.buildForm([
		  { name: 'age', validator: [] }
		]);
	
		formGroup.get('age')?.setValue(15);
	
		const field = {
		  rules: [
			{ field: 'age', operator: '>', value: 10 },
			{ field: 'age', operator: '>', value: 20 }
		  ],
		  condition: 'and'
		};
	
		const result = service.evaluateCondition(field, formGroup);
		expect(result).toBeFalse(); // 15 > 10 is true but 15 > 20 is false
	});
});
