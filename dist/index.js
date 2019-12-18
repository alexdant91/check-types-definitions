/**
 * MIT License
 * -------------------------------------------------------------------------------------------------------
 * Begin license text.
 * -------------------------------------------------------------------------------------------------------
 * 
 * Copyright 2019 Alessandro D'Antoni
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN 
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * -------------------------------------------------------------------------------------------------------
 * End license text.
 * -------------------------------------------------------------------------------------------------------
 */

// ?NEW FEATURE
class DefineTypes {
    static Any = "any";
    static Null = null;
    static String = "string";
    static Number = "number";
    static BigInt = "bigint";
    static Function = "function";
    static Symbol = "symbol";
    static Object = "object";
    static Array = "array";
    static Boolean = "boolean";
}

// ?NEW FEATURE
class Schema {
    constructor(schema) {
        if (typeof schema === "object" && !Array.isArray(schema)) {
            Object.keys(schema).map(key => {
                if (schema[key].type) {
                    this[key] = schema[key];
                } else {
                    throw new Error("Schema type property accept only `DefineTypes` data type.");
                }
            });
        } else {
            throw new Error("Schema constructor accept only object data type.");
        }
    }
}

class Types {
    constructor(value, Interface = false) {
        this.rb = false; // Return boolean if false, not throw new Error
        this.value = value;
        this.types = [];
        this.required = false;
        this.interface = Interface;
        this.Schema = null;
        this.SchemaStrictMode = true;
        this.SchemaExtendedMode = true;
    }

    clearConfig = () => {
        this.value = undefined;
        this.types = [];
        this.required = false;
        this.Schema = null;
        this.SchemaStrictMode = true;
        this.SchemaExtendedMode = true;
        return this;
    }

    checkType = (value, types = null, bool = true) => {
        const typeError = Array.isArray(value) ? "array" : typeof value;
        const typeCheckError = types == null ? this.types.join('" or "') : types.join('" or "');
        const typesArray = types == null ? this.types : types;
        if (typesArray.indexOf(typeError) !== -1 || this.types.indexOf("any") !== -1) return true;
        // Value not corrisponding to types
        if (!this.rb || !bool) throw new Error(`Value is marked as type "${typeCheckError}" but you get type "${typeError}"`);
        return false;
    }

    checkIfNotEmpty = (value) => {
        if (this.required) {
            if (this.types == "object") {
                return Object.keys(value).length > 0;
            } else if (this.types == "array") {
                return value.length > 0;
            } else {
                return value != undefined && value != null && value.length != "";
            }
        }
        return true;
    }

    validateDataSchema = (data, schema, cb = (err = { field: null, message: null }, isValid = false, data = null) => { }, options = { strict: true }) => {
        if (schema instanceof Schema) {

            const keys = Object.keys(schema);

            let dataFiltered = {};
            let dataValidated = { ...data };

            if (options.strict) {
                Object.keys(data).map(key => {
                    if (schema[key] !== undefined) dataFiltered[key] = data[key];
                });
                data = { ...dataFiltered };
                dataValidated = { ...dataFiltered };
            } else {
                data = dataValidated;
            }

            // Array to store all errors
            let errors = [];

            for (let i = 0;i < keys.length;i++) {
                const key = keys[i];
                const validation = schema[key];
                // Validate is default
                let isDefault = false;
                // Validate required if defined
                if (validation.required) {
                    if (validation.default === undefined) {
                        if (!this.checkType(data[key], ["boolean"], true) && (data[key] == undefined || data[key] == '')) return cb({ field: `${key}`, message: `'${key}' is required.` }, false, null);
                    } else {
                        if (!this.checkType(data[key], ["boolean"], true) && (data[key] == undefined || data[key] == '')) {
                            dataValidated = { ...dataValidated, [key]: typeof validation.default === "function" ? validation.default() : validation.default }
                            isDefault = true;
                        }
                    }
                }
                // Validate type, skip if is default true or if required is undefined
                if (!isDefault || validation.required === undefined) {
                    if (!this.checkType(data[key], [validation.type], true)) return cb(`'${key}' need to be typeof ${validation.type}.`, false, null);
                }
            }
            // Check if theres errors to return else return isValid true
            if (errors.length == 0) return cb(null, true, dataValidated);
            if (errors.length == 1) return cb({ field: `${errors[0].error.field}`, message: errors[0].error.message }, false, null);
            return cb(errors, false, null);
        } else {
            return cb(`'${schema}' need to be a <Schema> object type.`, false, null);
        }
    }

    checkSchemaDefinitions = () => {
        return this.validateDataSchema(this.value, this.Schema, (error, isValid, dataValidated) => {
            return { error, isValid, dataValidated };
        }, { strict: this.SchemaStrictMode });
    }

    options = (options = { return_boolean: false }) => {
        this.rb = options.return_boolean;
        return this;
    }

    set = (value, Interface = false) => {
        this.value = value;
        this.types = [];
        this.required = false;
        this.interface = Interface;
        return this;
    }

    setSchema = (schema = {}, options = { strict: true, extended: true }) => {
        if (schema instanceof Schema) {
            this.Schema = schema;
            this.SchemaStrictMode = options.strict != undefined ? options.strict : true;
            this.SchemaExtendedMode = options.extended != undefined ? options.extended : true;
            return this;
        } else {
            throw new Error("Schema type object required. Use the `Schema` class provided.");
        }
    }

    check = () => {
        if (this.checkIfNotEmpty(this.value)) {
            if (this.Schema == null) {
                if (!this.interface) {
                    if (this.checkType(this.value)) {
                        this.clearConfig();
                        return true;
                    }
                } else {
                    const ClassInterface = this.interface;
                    const result = this.value instanceof ClassInterface;
                    this.clearConfig();
                    return result;
                }
            } else {
                // Check Schema
                const result = this.checkSchemaDefinitions();
                if (result.error == null && this.SchemaExtendedMode) {
                    this.clearConfig();
                    return { isValid: result.isValid, dataValidated: result.dataValidated }
                } else if (result.error == null && !this.SchemaExtendedMode) {
                    this.clearConfig();
                    return true
                } else {
                    if (!this.rb) throw new Error(result.error);
                    this.clearConfig();
                    return false;
                }
            }
        }
        // Value required but empty
        this.clearConfig();
        if (!this.rb) throw new Error('Value is marked as required but no data was provided');
        return false;
    }

    Required = () => {
        this.required = true;
        return this;
    }

    // Specials
    Any = () => {
        this.types.push(DefineTypes.Any);
        return this;
    }

    Null = () => {
        this.types.push(DefineTypes.Null);
        return this;
    }

    // Normal
    String = () => {
        this.types.push(DefineTypes.String);
        return this;
    }

    Number = () => {
        this.types.push(DefineTypes.Number);
        return this;
    }

    BigInt = () => {
        this.types.push(DefineTypes.BigInt);
        return this;
    }

    Function = () => {
        this.types.push(DefineTypes.Function);
        return this;
    }

    Symbol = () => {
        this.types.push(DefineTypes.Symbol);
        return this;
    }

    Object = () => {
        this.types.push(DefineTypes.Object);
        return this;
    }

    Array = () => {
        this.types.push(DefineTypes.Array);
        return this;
    }

    Boolean = () => {
        this.types.push(DefineTypes.Boolean);
        return this;
    }

}

class Validate extends Types {
    constructor(value, Interface = false) {
        super(value, Interface);
    }

    STANDARD_EMAIL = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, "ig");
    STANDARD_URL = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, "ig");
    STANDARD_PHONE_NUMBER = new RegExp(/\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/, "ig");

    static GENERIC_INTERNATIONAL = this.STANDARD_PHONE_NUMBER;
    static IT_PHONE_NUMBER = new RegExp(/^(\+39)?[ ]?([0-9]{2,3}(\/|-| )?[0-9]{6,8})$/, "ig");
    static US_PHONE_NUMBER = new RegExp(/^\(?[\d]{3}\)?[\s-]?[\d]{3}[\s-]?[\d]{4}$/, "ig");
    static FRANCE_PHONE_NUMBER = new RegExp(/^0[1-6]{1}(([0-9]{2}){4})|((\s[0-9]{2}){4})|((-[0-9]{2}){4})$/, "ig");
    static GERMAN_PHONE_NUMBER = new RegExp(/^\(\d{1,2}(\s\d{1,2}){1,2}\)\s(\d{1,2}(\s\d{1,2}){1,2})((-(\d{1,4})){0,1})$/, "ig");

    // ?NEW FEATURE
    isNotNull = () => {
        if (typeof this.value !== 'null') return true;
        if (!this.rb) throw new Error("Value must be not null");
        return false;
    }

    isEmail = () => {
        const regExp = this.STANDARD_EMAIL;
        if (this.value.toString().match(regExp)) return true;
        if (!this.rb) throw new Error("Value must be a valid email \"example@domain.ext\"");
        return false;
    }

    isUrl = () => {
        const regExp = this.STANDARD_URL;
        if (this.value.toString().match(regExp)) return true;
        if (!this.rb) throw new Error("Value must be a valid url \"example@domain.ext\"");
        return false;
    }

    isPhone = (format = this.STANDARD_PHONE_NUMBER) => {
        const regExp = format;
        if (this.value.toString().match(regExp)) return true;
        return false;
    }

}

module.exports = { DefineTypes, Types, Validate, Schema };