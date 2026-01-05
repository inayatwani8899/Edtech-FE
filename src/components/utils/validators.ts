export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
}

export interface ValidationRules {
    [fieldName: string]: ValidationRule;
}

export interface ValidationResult {
    isValid: boolean;
    errors: { [fieldName: string]: string };
}

export class FormValidator {
    private rules: ValidationRules;

    constructor(rules: ValidationRules) {
        this.rules = rules;
    }

    validateField(fieldName: string, value: any): string | null {
        const rule = this.rules[fieldName];
        if (!rule) return null;

        // Required validation
        if (rule.required) {
            if (value === null || value === undefined || value === '') {
                return 'This field is required.';
            }
        }

        // Skip further validation if value is empty and not required
        if (!value && !rule.required) {
            return null;
        }

        // String-specific validations
        if (typeof value === 'string') {
            const stringValue = value.trim();

            // Min length validation
            if (rule.minLength && stringValue.length < rule.minLength) {
                return `Must be at least ${rule.minLength} characters long.`;
            }

            // Max length validation
            if (rule.maxLength && stringValue.length > rule.maxLength) {
                return `Must be less than ${rule.maxLength} characters long.`;
            }

            // Pattern validation
            if (rule.pattern && !rule.pattern.test(stringValue)) {
                return 'Invalid format.';
            }
        }

        // Number-specific validations
        if (typeof value === 'number') {
            if (rule.minLength && value < rule.minLength) {
                return `Must be at least ${rule.minLength}.`;
            }
        }

        // Custom validation
        if (rule.custom) {
            return rule.custom(value);
        }

        return null;
    }

    validateForm(formData: { [key: string]: any }): ValidationResult {
        const errors: { [fieldName: string]: string } = {};

        Object.keys(this.rules).forEach(fieldName => {
            const error = this.validateField(fieldName, formData[fieldName]);
            if (error) {
                errors[fieldName] = error;
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    validateFields(fields: string[], formData: { [key: string]: any }): ValidationResult {
        const errors: { [fieldName: string]: string } = {};

        fields.forEach(fieldName => {
            const error = this.validateField(fieldName, formData[fieldName]);
            if (error) {
                errors[fieldName] = error;
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// Pre-defined validation rules for common scenarios
export const categoryValidationRules: ValidationRules = {
    categoryName: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z0-9\s\-_]+$/,
        custom: (value: string) => {
            if (value.trim().length < 2) {
                return 'Category name must be at least 2 characters long.';
            }
            return null;
        }
    },
    description: {
        required: true,
        minLength: 10,
        maxLength: 500,
        custom: (value: string) => {
            if (value.trim().length < 10) {
                return 'Description must be at least 10 characters long.';
            }
            return null;
        }
    }
};

// Common validation rules that can be reused across forms
export const commonValidationRules = {
    required: (fieldName: string): ValidationRule => ({
        required: true,
        custom: (value: any) => !value ? `${fieldName} is required.` : null
    }),
    email: (): ValidationRule => ({
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address.' : null
    }),
    password: (): ValidationRule => ({
        required: true,
        minLength: 6,
        custom: (value: string) => value.length < 6 ? 'Password must be at least 6 characters long.' : null
    }),
    number: (min?: number, max?: number): ValidationRule => ({
        required: true,
        custom: (value: number) => {
            if (min !== undefined && value < min) return `Must be at least ${min}.`;
            if (max !== undefined && value > max) return `Must be less than ${max}.`;
            return null;
        }
    })
};