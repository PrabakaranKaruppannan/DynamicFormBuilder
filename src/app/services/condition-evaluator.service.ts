import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConditionEvaluatorService {

  	constructor() { }

	evaluateCondition(value: any, operator: string, compareValue: any): boolean {		
		if (value === undefined || value === null || value === ""){
			return false;
		}

		switch (operator) {
			case '>':
				return parseInt(value) > parseInt(compareValue);
			case '>=':
				return parseInt(value) >= parseInt(compareValue);
			case '<':
				return parseInt(value) < parseInt(compareValue);
			case '<=':
				return parseInt(value) <= parseInt(compareValue);
			case '==':
				return value == compareValue;
			case '===':
				return value === compareValue;
			case '!=':
				return value != compareValue;
			case '!==':
				return value !== compareValue;
			default:
				return false;
		}
	}
}
