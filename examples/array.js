const { Types, Schema, DefineTypes } = require('../index');
const CheckTypes = new Types().options({ return_false_boolean: true, return_true_boolean: false });

const req = {
    body: {
        "birth_date": "10-06-1991-10:00:00GTM+0200",
        "gender": "M",
        "geo_location": {
            "lat": 12345677,
            "long": 12345678
        },
        "rr": [
            { "average": 12.3456, "frequency": [1123123, 1231233] },
            { "average": 12.3456, "frequency": [1123123, 1231233] }
        ],
        "aa": ["st", "rt", 12],
        "ox_saturation": 80
    }
};

const geoLocationSchema = new Schema({
    lat: {
        type: DefineTypes.Number,
        required: true
    },
    long: {
        type: DefineTypes.Number,
        required: true
    }
});

const rrSchema = new Schema({
    average: {
        type: DefineTypes.Number,
        required: true
    },
    frequency: {
        type: DefineTypes.Array,
        required: true
    }
})

const birth_date = CheckTypes.set(req.body.birth_date).Required().String().check();
const gender = CheckTypes.set(req.body.gender).Required().String().Enum(["M", "F"]).check();
const geo_location = CheckTypes.set(req.body.geo_location).setSchema(geoLocationSchema, { strict: true, extended: true }).check().dataValidated;
const rr = CheckTypes.set(req.body.rr).Required().Array({ of: rrSchema }).check();
const aa = CheckTypes.set(req.body.aa).Required().Array({ of: [DefineTypes.String, DefineTypes.Number] }).check();
const ox_saturation = CheckTypes.set(req.body.ox_saturation).Required().Number().check();

console.log({ birth_date, gender, geo_location, rr, aa, ox_saturation })