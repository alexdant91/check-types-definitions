# Check Types Definitions

Simple javascript library that give the ability to manage data types and validations without `typescript`.

1. [Install](#how-to-install)
2. [How it works?](#how-it-works)
3. [Types](#types)
4. [Types Parameters](#types-parameters)
5. [Types Methods](#types-methods)
6. [How to check data value?](#how-to-check-data-value)
7. [How to use interface?](#how-to-use-interface)
8. [Validations](#types)
9. [Validations Parameters](#validations-parameters)
10. [Validations Methods](#validations-methods)
11. [Validations Phone Format](#validations-phone-format)
12. [Use data validations](#use-data-validations)

## How to Install?

Simply run `npm i check-types-definitions --s` or `yarn add check-types-definitions`.

## How it works?

First of all you have to require the main class. The `Validations` class will add new features for validation purpose like `isEmail`, `isUrl` or `isPhone` with some special options.

```javascript
const { Types, Validations } = require('check-types-definitions');
```

Then you can use `Tyeps` in two ways. First you can declare it on a new constant and use it multiple times:

```javascript
const CheckTypes = new Types().options({ return_boolean: true });

const value = "12";
const check1 = CheckTypes.set(value).String().Number().Required().check();
const check2 = CheckTypes.set(value).Number().Required().check();

console.log(check1); // Log true
console.log(check2); // Log false
```

Or you can declare Types class every time you need it:

```javascript
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

| Parameter   | Type             |  Description                      |
|-------------|------------------|-----------------------------------|
| `value`     | `Any`            | The data to validate.             |
| `Interface` | `Class reference`| Class reference to validate data. |

## Types Methods

| Name        | Params             | Description                                                                                                 | Default  |
|-------------|:------------------:|-------------------------------------------------------------------------------------------------------------|:--------:|
| `options()` | `(options<Object>)`| `return_boolean<Boolean>`. If true the `false` response will be boolean otherwise it will throw a new Error.| `false`  |
| `set()`     | `(<Any>, <Class>)` | Set the `value` and `Interface` outside the constructor.                                                    |    --    |
| `check()`   | --                 | Run the validation process.                                                                                 |    --    |
| `Required()`| --                 | Mark data as required so string can't be empty, null or undefined and Object and Array can't be empty.      |    --    |
| `Any()`     | --                 | Mark data type validation to `Any` and/or others specified.                                                 |    --    |
| `Null()`    | --                 | Mark data type validation to `Null` and/or others specified.                                                |    --    |
| `String()`  | --                 | Mark data type validation to `String` and/or others specified.                                              |    --    |
| `Number()`  | --                 | Mark data type validation to `Number` and/or others specified.                                              |    --    |
| `BigInt()`  | --                 | Mark data type validation to `BigInt` and/or others specified.                                              |    --    |
| `Function()`| --                 | Mark data type validation to `Function` and/or others specified.                                            |    --    |
| `Symbol()`  | --                 | Mark data type validation to `Symbol` and/or others specified.                                              |    --    |
| `Object()`  | --                 | Mark data type validation to `Object` and/or others specified.                                              |    --    |
| `Array()`   | --                 | Mark data type validation to `Array` and/or others specified.                                               |    --    |
| `Boolean()` | --                 | Mark data type validation to `Boolean` and/or others specified.                                             |    --    |

## How to check data value?

Eg. What if we want to check if data is provided and type of String or Number:

```javascript
// Require Types class
const { Types } = required('check-types-definitions');
// Call Types contructor and set options
const CheckTypes = new Types().options({ return_boolean: true });
// Eg. Set data to validate and check if data type is String or Number and Required
const isValid = CheckTypes.set("123").Required().String().Number().check(); // Return true
```

# How to use Interface

You can compare data type to a specific class for validation purpose:

```javascript
// Require Types class
const { Types } = required('check-types-definitions');
// Call Types contructor and set options
const CheckTypes = new Types().options({ return_boolean: true });
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

# Validations

Class that extends the `Types` functions. It allow you to validate data in multiple case.

## Validations Prameters

| Parameter   | Type             |  Description                      |
|-------------|------------------|-----------------------------------|
| `value`     | `Any`            | The data to validate.             |
| `Interface` | `Class reference`| Class reference to validate data. |

## Validations Methods

It include all `Types` [method](#types-methods) adding some functionalities:

| Name        | Params                       | Description                                                                                                 | Default               |
|-------------|:----------------------------:|-------------------------------------------------------------------------------------------------------------|:---------------------:|
| `isEmail()` | `()`                         | Check if data provided is a valid email address. `[string@string.ext]`                                      | --                    |
| `isUrl()`   | `()`                         | Check if data provided is a valid url. `protocol://? www? domain_name.ext`                                  | --                    |
| `isPhone()` | `(format<Validation.Format>)`| Check if data provided is a valid phone number. There are some formats [here](#validations-phone-format).   |`GENERIC_INTERNATIONAL`|

## Validations Phone Format

There are five validation type for phone numbers:

| Name                        | Declaration                          |  Description                                                                                                   |
|-----------------------------|--------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `GENERIC_INTERNATIONAL`     | `Validations.GENERIC_INTERNATIONAL`  | Generic international phone number standard. Valid: `+393331231232` or `3331231232`. `+[0-9][0-9]? [0-9]{9-10}`|
| `IT_PHONE_NUMBER`           | `Validations.IT_PHONE_NUMBER`        | Generic IT phone number standard. Check IT phone number standards.                                             |
| `US_PHONE_NUMBER`           | `Validations.US_PHONE_NUMBER`        | Generic US phone number standard. Check US phone number standards.                                             |
| `FRANCE_PHONE_NUMBER`       | `Validations.FRANCE_PHONE_NUMBER`    | Generic FR phone number standard. Check FR phone number standards.                                             |
| `GERMAN_PHONE_NUMBER`       | `Validations.GERMAN_PHONE_NUMBER`    | Generic DE phone number standard. Check DE phone number standards.                                             |

## Use data validations

We can use `Validations` methods to check if data provided is a valid email, url or specific phone number:

```javascript
// Require Validations class
const { Validations } = required('check-types-definitions');
// Call Validations contructor
const CheckValidations = new Validations().options({ return_boolean: true });
// Eg. Check if data is valid email
const isEmail = CheckValidations.set("email@domain.com").isEmail(); // Return true
// Eg. Check if data is valid url
const isEmail = CheckValidations.set("www.google.com").isUrl(); // Return true
// Eg. Check if data is valid IT phone number
const isEmail = CheckValidations.set("+39 338 1234567").isPhone(Validations.IT_PHONE_NUMBER); // Return true
```