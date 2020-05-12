# Check Types Definitions

Simple javascript library that give the ability to manage data types and Validate without `typescript` .

* [Install](#how-to-install)
* [How it works?](#how-it-works)
* [Types](#types)
* [Types Parameters](#types-parameters)
* [Types Methods](#types-methods)
* [How to check data value?](#how-to-check-data-value)
* [How to use interface?](#how-to-use-interface)
* [Define data types](#define-data-types)
* [Define data types list](#define-data-types-list)
* [How to use Schema?](#how-to-use-schema)
* [Define a Schema](#define-a-schema)
* [Schema types Allowed](#schema-types-allowed)
* [Valid Schema options](#valid-schema-options)
* [Validate](#types)
* [Validate Parameters](#Validate-parameters)
* [Validate Methods](#Validate-methods)
* [Validate Phone Format](#Validate-phone-format)
* [Use data Validate](#use-data-Validate)

## How to Install?

Simply run `npm i check-types-definitions --s` or `yarn add check-types-definitions` .

## How it works?

First of all you have to require the main class. The `Validate` class will add new features for validation purpose like `isEmail` , `isUrl` or `isPhone` with some special options.

``` javascript
const { Types, Validate } = require('check-types-definitions');
```

Then you can use `Types` in two ways. First you can declare it on a new constant and use it multiple times:

``` javascript
const CheckTypes = new Types().options({
    return_false_boolean: true,
    return_true_boolean: true
});

const value = "12";
const check1 = CheckTypes.set(value).String().Number().Required().check();
const check2 = CheckTypes.set(value).Number().Required().check();

console.log(check1); // Log true
console.log(check2); // Log false
```

Or you can declare Types class every time you need it:

``` javascript
const value = "12";
const check1 = new Types(value).String().Number().Required().check();
const check2 = new Types(value).Number().Required().check();

console.log(check1); // Log true
console.log(check2); // Log false
```

# Types

The first scope is to give the ability to manage data type without TypeScript. `Types` is a class wich constructor accept two parameters: 
`value` that is data to validate and `Interface` that is a class reference to check data.

## Types Prameters

| Parameter   | Type              | Description                       |
|-------------|-------------------|-----------------------------------|
| `value`     | `Any`             | The data to validate.             |
| `Interface` | `Class reference` | Class reference to validate data. |

## Types Methods

| Name          |                    Params                    | Description                                                                                                                                                                                                                                 | Default |
|---------------|:--------------------------------------------:|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------:|
| `options()`   |             `(options<Object>)`              | `return_false_boolean<Boolean>` . If true the `false` response will be boolean otherwise it will throw a new Error. `return_true_boolean<Boolean>` . If true the `true` response will be boolean otherwise it will return the checked data. | `false` |
| `set()`       |              `(<Any>, <Class>)`              | Set the `value` and `Interface` outside the constructor.                                                                                                                                                                                    |   --    |
| `setSchema()` |           `(<Schema>, <Options>)`            | Set the `schema` and `options` for your validation rules. More info [here](#how-to-use-schema).                                                                                                                                             |   --    |
| `check()`     |                      --                      | Run the validation process.                                                                                                                                                                                                                 |   --    |
| `Required()`  |                      --                      | Mark data as required so string can't be empty, null or undefined and Object and Array can't be empty.                                                                                                                                      |   --    |
| `Any()`       |                      --                      | Mark data type validation to `Any` and/or others specified.                                                                                                                                                                                 |   --    |
| `Null()`      |                      --                      | Mark data type validation to `Null` and/or others specified.                                                                                                                                                                                |   --    |
| `String()`    |                      --                      | Mark data type validation to `String` and/or others specified.                                                                                                                                                                              |   --    |
| `Number()`    |                      --                      | Mark data type validation to `Number` and/or others specified.                                                                                                                                                                              |   --    |
| `BigInt()`    |                      --                      | Mark data type validation to `BigInt` and/or others specified.                                                                                                                                                                              |   --    |
| `Function()`  |                      --                      | Mark data type validation to `Function` and/or others specified.                                                                                                                                                                            |   --    |
| `Symbol()`    |                      --                      | Mark data type validation to `Symbol` and/or others specified.                                                                                                                                                                              |   --    |
| `Object()`    |                      --                      | Mark data type validation to `Object` and/or others specified.                                                                                                                                                                              |   --    |
| `Array()`     | `childrens<{ of: <Schema>||<DefineTypes> }>` | Mark data type validation to `Array` and/or others specified. The { of } option allow to check array childrens. Permitted value are Schemas and DefineTypes definitions                                                                     |   --    |
| `Boolean()`   |                      --                      | Mark data type validation to `Boolean` and/or others specified.                                                                                                                                                                             |   --    |

## How to check data value?

Eg. What if we want to check if data is provided and type of String or Number:

``` javascript
// Require Types class
const { Types } = required('check-types-definitions');
// Call Types contructor and set options
const CheckTypes = new Types().options({
    return_boolean: true
});
// Eg. Set data to validate and check if data type is String or Number and Required
const isValid = CheckTypes.set("123").Required().String().Number().check(); // Return true
```

## How to check Array childrens data value?

``` javascript
// Require Types class
const { Types, Schema, DefineTypes } = require('../index');
// Call Types contructor and set options
const CheckTypes = new Types().options({
    return_false_boolean: true,
    return_true_boolean: false
});
// Input data
const data = {
    "aa": [{ "average": 12.3456, "frequency": [1123123, 1231233] }, { "average": 12.3456, "frequency": [1123123, 1231233] }],
    "bb": ["st", "rt", 12],
};
// Schema declaration
const aaSchema = new Schema({
    average: {
        type: DefineTypes.Number,
        required: true
    },
    frequency: {
        type: DefineTypes.Array, // Nested array type check not provided yet
        required: true
    }
});
// Now I want to check if `aa` is and array of objects defined in schema, `bb` is an array of Strings, and cc is an array of Strings or Numbers with a default value of `[]`
const aa = CheckTypes.set(data.aa).Required().Array({ of: aaSchema }).check(); // Return [{ "average": 12.3456, "frequency": [1123123, 1231233] }, { "average": 12.3456, "frequency": [1123123, 1231233] }]
const bb = CheckTypes.set(data.bb).Required().Array({ of: DefineTypes.String }).check(); // Return false
const cc = CheckTypes.set(data.cc).Default([]).Array({ of: [DefineTypes.String, DefineTypes.Number] }).check(); // Return [] as default
```

## How to use Interface

You can compare data type to a specific class for validation purpose:

``` javascript
// Require Types class
const { Types } = required('check-types-definitions');
// Call Types contructor and set options
const CheckTypes = new Types().options({
    return_boolean: true
});
// My custom class
class UserData {
    constructor(first_name, last_name, email, phone) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
    }
}
// Get a new class istance
const user = new UserData("John", "Doe", "john.doe@domain.com", "0123456789");
// Now i want to check if `user` is `UserData` data type
const isValid = CheckTypes.set(user, UserData).check(); // Return true
```

That example give you the ability to check if `user` is a valid `UserData` instance.

## Define data types

To define data types you need to use the `DefineTypes` class:

``` javascript
const { DefineTypes } = require('check-types-definitions');
// Example: define a string data type
const stringType = DefineTypes.String;
```

## Define data types list

01. `DefineTypes.Any` any types accepted.
02. `DefineTypes.Null` only null type accepted.
03. `DefineTypes.String` only string type accepted.
04. `DefineTypes.Number` only number type accepted.
05. `DefineTypes.BigInt` only bigint type accepted.
06. `DefineTypes.Function` only function type accepted.
07. `DefineTypes.Symbol` only symbol instance accepted.
08. `DefineTypes.Object` only object type accepted.
09. `DefineTypes.Array` only array type accepted.
10. `DefineTypes.Boolean` sonly boolean type accepted.

## How to use Schema?

Define a `Schema` allow you to check data using strong validation definitions declared in it:

``` javascript
// Require classes
const { Types, DefineTypes, Schema } = require('check-types-definitions');
// Declare `Types` 
const CheckTypes = new Types().options({
    return_boolean: true
});
// Declare a new Schema
const schema = new Schema({
    first_name: {
        type: DefineTypes.String,
        default: "John"
    },
    last_name: {
        type: DefineTypes.String,
        required: true,
        default: null
    }
});
// My dummy data source
const data = {
    first_name: "John",
    last_name: "Doe",
    email: "example@example.com"
}
// Set schema e do checks
const isValid = CheckTypes.set(data).setSchema(schema, {
    strict: true,
    extended: false
}).check();
const isValidNotStrict = CheckTypes.set(data).setSchema(schema, {
    strict: false,
    extended: true
}).check();
const isValidExtended = CheckTypes.set(data).setSchema(schema, {
    strict: true,
    extended: true
}).check();
// Log results
console.log(isValid); // Log true
console.log(isValidNotStrict); // Log { isValid: true, dataValidated: { first_name: 'John', last_name: 'Doe',  email: 'example@example.com' } }
console.log(isValidExtended); // Log { isValid: true, dataValidated: { first_name: 'John', last_name: 'Doe' } }
```

## Define a Schema

The `setSchema()` metode accept a `<Schema>` type object that need, for each paramenter specified, 3 parameters:

| Parameter  | Type      | Description                                                                 | Required |
|------------|-----------|-----------------------------------------------------------------------------|:--------:|
| `type`     | `Any`     | The data type to validate.[Here](#schema-types-allowed) types allowed list. |  `true`  |
| `required` | `Boolean` | Mark that field as required.                                                | `false`  |
| `default`  | `Any`     | Provide a default value if data provided was empty.                         | `false`  |

Here an example of a valid schema definition:

``` javascript
// Require `Schema` 
const { DefineTypes, Schema } = require('check-types-definitions');
// Declare a new `Schema` object
const schema = new Schema({
    field_1: {
        type: DefineTypes.String
    },
    field_2: {
        type: DefineTypes.Number,
        required: true
    },
    field_3: {
        type: DefineTypes.String,
        default: null
    },
    field_4: {
        type: DefineTypes.String,
        required: true,
        default: null
    }
});
```

## Schema types Allowed

The `Schema` type property allowed only `DefineTypes` data type definitions. Check the allowed list of typed [here](#define-data-types-list).

## Valid Schema options

The `setSchema()` methode accept a `<Options>` type object that accept 2 parameters:

| Parameter  | Type      | Description                                                                                             | Default |
|------------|-----------|---------------------------------------------------------------------------------------------------------|:-------:|
| `strict`   | `Boolean` | If `true` field not specified in schema will be removed. Otherwise they will pass the validation check. | `true`  |
| `extended` | `Boolean` | If `true` the check methode will return filtered data, otherwise only boolean.                          | `true`  |

# Validate

Class that extends the `Types` functions. It allow you to validate data in multiple case.

## Validate Prameters

| Parameter   | Type              | Description                       |
|-------------|-------------------|-----------------------------------|
| `value`     | `Any`             | The data to validate.             |
| `Interface` | `Class reference` | Class reference to validate data. |

## Validate Methods

It include all `Types` [method](#types-methods) adding some functionalities:

| Name        |            Params             | Description                                                                                            |         Default         |
|-------------|:-----------------------------:|--------------------------------------------------------------------------------------------------------|:-----------------------:|
| `isEmail()` |             `()`              | Check if data provided is a valid email address. `[string@string.ext]`                                 |           --            |
| `isUrl()`   |             `()`              | Check if data provided is a valid url. `protocol://? www? domain_name.ext`                             |           --            |
| `isPhone()` | `(format<Validation.Format>)` | Check if data provided is a valid phone number. There are some formats [here](#Validate-phone-format). | `GENERIC_INTERNATIONAL` |

## Validate Phone Format

There are five validation type for phone numbers:

| Name                    | Declaration                      | Description                                                                                                      |
|-------------------------|----------------------------------|------------------------------------------------------------------------------------------------------------------|
| `GENERIC_INTERNATIONAL` | `Validate.GENERIC_INTERNATIONAL` | Generic international phone number standard. Valid: `+393331231232` or `3331231232` . `+[0-9][0-9]? [0-9]{9-10}` |
| `IT_PHONE_NUMBER`       | `Validate.IT_PHONE_NUMBER`       | Generic IT phone number standard. Check IT phone number standards.                                               |
| `US_PHONE_NUMBER`       | `Validate.US_PHONE_NUMBER`       | Generic US phone number standard. Check US phone number standards.                                               |
| `FRANCE_PHONE_NUMBER`   | `Validate.FRANCE_PHONE_NUMBER`   | Generic FR phone number standard. Check FR phone number standards.                                               |
| `GERMAN_PHONE_NUMBER`   | `Validate.GERMAN_PHONE_NUMBER`   | Generic DE phone number standard. Check DE phone number standards.                                               |

## Use data Validate

We can use `Validate` methods to check if data provided is a valid email, url or specific phone number:

``` javascript
// Require Validate class
const { Validate } = required('check-types-definitions');
// Call Validate contructor
const CheckValidate = new Validate().options({
    return_boolean: true
});
// Eg. Check if data is valid email
const isEmail = CheckValidate.set("email@domain.com").isEmail(); // Return true
// Eg. Check if data is valid url
const isEmail = CheckValidate.set("www.google.com").isUrl(); // Return true
// Eg. Check if data is valid IT phone number
const isEmail = CheckValidate.set("+39 338 1234567").isPhone(Validate.IT_PHONE_NUMBER); // Return true
```
