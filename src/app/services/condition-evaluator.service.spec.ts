import { TestBed } from '@angular/core/testing';

import { ConditionEvaluatorService } from './condition-evaluator.service';

describe('ConditionEvaluatorServiceService', () => {
	let service: ConditionEvaluatorService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ConditionEvaluatorService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return false for undefined value', () => {
		expect(service.evaluateCondition(undefined, '>', 5)).toBeFalse();
	});
	
	it('should return false for null value', () => {
		expect(service.evaluateCondition(null, '>', 5)).toBeFalse();
	});
	
	it('should return false for empty string value', () => {
		expect(service.evaluateCondition("", '>', 5)).toBeFalse();
	});
	
	it('should evaluate > operator correctly', () => {
		expect(service.evaluateCondition(6, '>', 5)).toBeTrue();
		expect(service.evaluateCondition(5, '>', 5)).toBeFalse();
	});
	
	it('should evaluate >= operator correctly', () => {
		expect(service.evaluateCondition(6, '>=', 5)).toBeTrue();
		expect(service.evaluateCondition(5, '>=', 5)).toBeTrue();
		expect(service.evaluateCondition(4, '>=', 5)).toBeFalse();
	});
	
	it('should evaluate < operator correctly', () => {
		expect(service.evaluateCondition(4, '<', 5)).toBeTrue();
		expect(service.evaluateCondition(5, '<', 5)).toBeFalse();
	});
	
	it('should evaluate <= operator correctly', () => {
		expect(service.evaluateCondition(4, '<=', 5)).toBeTrue();
		expect(service.evaluateCondition(5, '<=', 5)).toBeTrue();
		expect(service.evaluateCondition(6, '<=', 5)).toBeFalse();
	});
	
	it('should evaluate == operator correctly', () => {
		expect(service.evaluateCondition(5, '==', '5')).toBeTrue(); // loose equality
		expect(service.evaluateCondition(5, '==', 6)).toBeFalse();
	});
	
	it('should evaluate === operator correctly', () => {
		expect(service.evaluateCondition(5, '===', 5)).toBeTrue(); // strict equality
		expect(service.evaluateCondition(5, '===', '5')).toBeFalse(); // different types
	});
	
	it('should evaluate != operator correctly', () => {
		expect(service.evaluateCondition(5, '!=', 6)).toBeTrue();
		expect(service.evaluateCondition(5, '!=', '5')).toBeFalse(); // loose inequality
	});
	
	it('should evaluate !== operator correctly', () => {
		expect(service.evaluateCondition(5, '!==', 6)).toBeTrue();
		expect(service.evaluateCondition(5, '!==', '5')).toBeTrue(); // different types
		expect(service.evaluateCondition(5, '!==', 5)).toBeFalse(); // same type and value
	});
	
	it('should return false for unknown operator', () => {
		expect(service.evaluateCondition(5, 'unknown', 6)).toBeFalse();
	});
});
