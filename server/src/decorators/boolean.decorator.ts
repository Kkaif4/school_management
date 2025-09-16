import { Transform } from 'class-transformer';
import { IsBoolean, ValidationOptions } from 'class-validator';

export function IsStrictBoolean(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    Transform(({ value }) => {
      if (value !== true && value !== false) {
        throw new Error(`${propertyName} must be a boolean (true/false)`);
      }
      return value;
    })(object, propertyName);

    IsBoolean({
      message: `${propertyName}  must be a boolean (true/false)`,
      ...validationOptions,
    })(object, propertyName);
  };
}
