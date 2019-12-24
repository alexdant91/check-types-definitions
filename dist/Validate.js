const Types = require('./Types');

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
        if (!this.rfb) throw new Error("Value must be not null");
        return false;
    }

    isEmail = () => {
        const regExp = this.STANDARD_EMAIL;
        if (this.value.toString().match(regExp)) return true;
        if (!this.rfb) throw new Error("Value must be a valid email \"example@domain.ext\"");
        return false;
    }

    isUrl = () => {
        const regExp = this.STANDARD_URL;
        if (this.value.toString().match(regExp)) return true;
        if (!this.rfb) throw new Error("Value must be a valid url \"https://example.com\"");
        return false;
    }

    isPhone = (format = this.STANDARD_PHONE_NUMBER) => {
        const regExp = format;
        if (this.value.toString().match(regExp)) return true;
        if (!this.rfb) throw new Error("Value must be a valid phone number \"3121223456\"");
        return false;
    }

}

module.exports = Validate;