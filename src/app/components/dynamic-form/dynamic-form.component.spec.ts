import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { DynamicFormComponent } from './dynamic-form.component';
import { FormBuilderService } from '../../services/form-builder.service';
import moment from 'moment';
import { FormGroup } from '@angular/forms';


describe('DynamicFormComponent', () => {
	let component: DynamicFormComponent;
	let fixture: ComponentFixture<DynamicFormComponent>;
	let httpMock: HttpTestingController;
	let formBuilderService: FormBuilderService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DynamicFormComponent],
			providers: [        
				provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
				provideHttpClientTesting()
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(DynamicFormComponent);
		component = fixture.componentInstance;
		httpMock = TestBed.inject(HttpTestingController);
		formBuilderService = TestBed.inject(FormBuilderService);
		fixture.detectChanges();
	});

	it('should load form definition from JSON file on init', () => {
        const mockFormDefinition = [
			{
				fieldtype: "text",
				group: "General Information",
				name: "Order No",
				validator: [
					"required"
				]
			},
			{
				fieldtype: "date",
				group: "General Information",
				name: "OrderedDate",
				validator: [
					"required"
				]
			},
			{
				condition: "and",
				fieldtype: "text",
				group: "General Information",
				name: "OrderedInfo",
				rules: [
					{
						"field": "OrderedDate",
						"operator": "!=",
						"value": ""
					}
				],
				validator: [
					"required"
				]
			},
			{
				fieldtype: "integer",
				group: "Product Information",
				name: "Price",
				validator: [
					"required"
				]
			},
			{
				fieldtype: "boolean",
				group: "Product Information",
				name: "Refurbished",
				selectList: [
					"Yes",
					"No"
				]
			},
			{
				condition: "or",
				fieldtype: "text",
				group: "Product Information",
				name: "Address",
				rules: [
					{
						field: "Order No",
						operator: ">=",
						value: "100"
					},
					{
						field: "Price",
						operator: "<=",
						value: "100"
					}
				]
			}
		]
        
        // Mock the HTTP GET request
        component.ngOnInit();
        
        const req = httpMock.expectOne('/assets/form-definition.json');
        expect(req.request.method).toBe('GET');
        req.flush(mockFormDefinition); // simulate returning data
        
        expect(component.formDefinition).toEqual(mockFormDefinition);
        expect(component.form).toBeDefined();
    });

	it('should build the form based on the form definition', () => {
		const mockFormDefinition = [
			{
				fieldtype: "text",
				group: "General Information",
				name: "Order No",
				validator: [
					"required"
				]
			},
			{
				fieldtype: "date",
				group: "General Information",
				name: "OrderedDate",
				validator: [
					"required"
				]
			},
			{
				condition: "and",
				fieldtype: "text",
				group: "General Information",
				name: "OrderedInfo",
				rules: [
					{
						"field": "OrderedDate",
						"operator": "!=",
						"value": ""
					}
				],
				validator: [
					"required"
				]
			},
			{
				fieldtype: "integer",
				group: "Product Information",
				name: "Price",
				validator: [
					"required"
				]
			},
			{
				fieldtype: "boolean",
				group: "Product Information",
				name: "Refurbished",
				selectList: [
					"Yes",
					"No"
				]
			},
			{
				condition: "or",
				fieldtype: "text",
				group: "Product Information",
				name: "Address",
				rules: [
					{
						field: "Order No",
						operator: ">=",
						value: "100"
					},
					{
						field: "Price",
						operator: "<=",
						value: "100"
					}
				]
			}
		]

        spyOn(formBuilderService, 'buildForm').and.returnValue({
            valid: true,
            value: {
                OrderedInfo: 'Info',
                OrderedDate: '2024-10-31',
                Price: 100,
                Refurbished: true,
                Address: '123 Test St',
            },
            controls: {
                OrderedInfo: { markAsTouched: () => {}, markAsDirty: () => {} },
                OrderedDate: { markAsTouched: () => {}, markAsDirty: () => {} },
                Price: { markAsTouched: () => {}, markAsDirty: () => {} },
                Refurbished: { markAsTouched: () => {}, markAsDirty: () => {} },
                Address: { markAsTouched: () => {}, markAsDirty: () => {} },
            }
        });

        component.formDefinition = mockFormDefinition;
        component.ngOnInit();

		const req = httpMock.expectOne('/assets/form-definition.json');
    	req.flush(mockFormDefinition);

        expect(formBuilderService.buildForm).toHaveBeenCalledWith(mockFormDefinition);
        expect(component.form).toBeDefined();
    });

    it('should submit form and set submittedData correctly', () => {
        component.form = {
            valid: true,
            value: {
                OrderedInfo: 'Info',
                OrderedDate: '31-10-2024',
                Price: 100,
                Refurbished: true,
                Address: '123 Test St',
            }
        } as FormGroup<any>; // Cast to any to bypass type checking

        component.onSubmit();

        expect(component.submittedData).toEqual({
            "Order No": "Info undefined", // Adjust this based on your form structure
            "OrderedDate": moment(new Date('31-10-2024')).format("l"),
            "Price": 100,
            "Refurbished": true,
            "Address": '123 Test St'
        });
    });

    it('should mark form controls as touched and dirty if form is invalid', () => {
        component.form = {
            valid: false,
            controls: {
                OrderedInfo: {
                    markAsTouched: jasmine.createSpy('markAsTouched'),
                    markAsDirty: jasmine.createSpy('markAsDirty')
                },
                OrderedDate: {
                    markAsTouched: jasmine.createSpy('markAsTouched'),
                    markAsDirty: jasmine.createSpy('markAsDirty')
                },
                Price: {
                    markAsTouched: jasmine.createSpy('markAsTouched'),
                    markAsDirty: jasmine.createSpy('markAsDirty')
                },
                Refurbished: {
                    markAsTouched: jasmine.createSpy('markAsTouched'),
                    markAsDirty: jasmine.createSpy('markAsDirty')
                },
                Address: {
                    markAsTouched: jasmine.createSpy('markAsTouched'),
                    markAsDirty: jasmine.createSpy('markAsDirty')
                },
            }
        } as any; // Cast to any to bypass type checking

        component.onSubmit();

        expect(component.form.controls['OrderedInfo'].markAsTouched).toHaveBeenCalled();
        expect(component.form.controls['OrderedInfo'].markAsDirty).toHaveBeenCalled();
        expect(component.form.controls['OrderedDate'].markAsTouched).toHaveBeenCalled();
        expect(component.form.controls['OrderedDate'].markAsDirty).toHaveBeenCalled();
        expect(component.form.controls['Price'].markAsTouched).toHaveBeenCalled();
        expect(component.form.controls['Price'].markAsDirty).toHaveBeenCalled();
        expect(component.form.controls['Refurbished'].markAsTouched).toHaveBeenCalled();
        expect(component.form.controls['Refurbished'].markAsDirty).toHaveBeenCalled();
        expect(component.form.controls['Address'].markAsTouched).toHaveBeenCalled();
        expect(component.form.controls['Address'].markAsDirty).toHaveBeenCalled();
    });

    it('should evaluate field visibility based on conditions', () => {
        const mockField = {
            condition: true,
            rules: [
				{
					field: "Order No",
					operator: ">=",
					value: "100"
				},
				{
					field: "Price",
					operator: "<=",
					value: "100"
				}
			]// Populate as necessary
        };

        spyOn(formBuilderService, 'evaluateCondition').and.returnValue(true);
        
        const isVisible = component.isFieldVisible(mockField);
        
        expect(isVisible).toBeTrue();
        expect(formBuilderService.evaluateCondition).toHaveBeenCalledWith(mockField, component.form);
    });

	it('should evaluate field visibility is no rules exists', () => {
        const mockField = {};
        
        const isVisible = component.isFieldVisible(mockField);
        
        expect(isVisible).toBeTrue();
    });
});
