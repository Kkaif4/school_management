import { Transform } from 'class-transformer';
import { IsBoolean, ValidationOptions } from 'class-validator';

/**
 * A decorator that transforms input into a boolean and then validates it.
 * It correctly handles boolean values and string values "true" and "false".
 * @param validationOptions Standard class-validator options.
 */
export function IsStrictBoolean(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    // 1. Transform the incoming value
    Transform(({ value }: { value: unknown }) => {
      if (value === 'true') {
        return true;
      }
      if (value === 'false') {
        return false;
      }
      return value;
    })(object, propertyName);

    // 2. Validate that the (potentially transformed) value is a boolean
    IsBoolean({
      message: `${propertyName} must be a boolean value (true or false)`,
      ...validationOptions,
    })(object, propertyName);
  };
}
