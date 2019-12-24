const DefineTypes = require('./DefineTypes');
const Schema = require('./Schema');

class Types {
    constructor(value, Interface = false) {
        this.rfb = true; // Return boolean if true, otherwise throw a new Error
        this.rtb = true; // Return boolean if true, otherwise return data entered
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
        if (!this.rtb || !bool) throw new Error(`Value is marked as type "${typeCheckError}" but you get type "${typeError}"`);
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

    options = (options = { return_false_boolean: true, return_true_boolean: true }) => {
        // If false return new Error(), if true return Boolean
        this.rfb = options.return_false_boolean != undefined ? options.return_false_boolean : false;
        // If false return the data inserted, if true return Boolean
        this.rtb = options.return_true_boolean != undefined ? options.return_true_boolean : true;
        return this;
    }

    set = (value, Interface = false) => {
        this.clearConfig();
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
        // Set Any types if not specified
        if (this.types.length == 0) this.types = [DefineTypes.Any];
        // Go throw check logic
        if (this.checkIfNotEmpty(this.value)) {
            if (this.Schema == null) {
                if (!this.interface) {
                    if (this.checkType(this.value)) {
                        this.clearConfig();
                        if (this.rtb) return true;
                        return this.value;
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
                    if (this.rtb) return true;
                    return this.value;
                } else {
                    this.clearConfig();
                    if (!this.rfb) throw new Error(result.error);
                    return false;
                }
            }
        }
        // Value required but empty
        this.clearConfig();
        if (!this.rfb) throw new Error('Value is marked as required but no data was provided');
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

module.exports = Types;