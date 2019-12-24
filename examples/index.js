const { Types } = require('../index');
const CheckTypes = new Types().options({ return_false_boolean: true, return_true_boolean: false });

const a = CheckTypes.set("alexdant91@gmail.com").Required().check();
const b = CheckTypes.set("1234").Required().check();

console.log(a, b);