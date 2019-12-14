// Require `Types` class
const { Types } = require('../index');
// Declare `Types`
const CheckTypes = new Types().options({ return_boolean: false });
// Declare a new Schema
const schema = {
    first_name: {
        type: "string",
        default: "John"
    },
    last_name: {
        type: "string",
        required: true,
        default: null
    }
}
// My dummy data source
const data = {
    first_name: "John",
    last_name: "Doe",
    email: "example@example.com"
}
// Set schema e do checks
const isValid = CheckTypes.set(data).setSchema(schema, { strict: true, extended: false }).check();
const isValidNotStrict = CheckTypes.set(data).setSchema(schema, { strict: false, extended: true }).check();
const isValidExtended = CheckTypes.set(data).setSchema(schema, { strict: true, extended: true }).check();
// Log results
console.log(isValid); // Log true
console.log(isValidNotStrict); // Log { isValid: true, dataValidated: { first_name: 'John', last_name: 'Doe',  email: 'example@example.com' } }
console.log(isValidExtended); // Log { isValid: true, dataValidated: { first_name: 'John', last_name: 'Doe' } }