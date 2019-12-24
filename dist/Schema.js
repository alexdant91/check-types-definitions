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

module.exports = Schema;