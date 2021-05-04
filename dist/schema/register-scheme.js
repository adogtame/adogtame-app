"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regsterSchema = void 0;
const express_validator_1 = require("express-validator");
const schema = [
    express_validator_1.body('email').isEmail(),
    // body('nombre').exists({ checkFalsy: true }),
    express_validator_1.body('password').isLength({ min: 5 }), // password must be at least 5 chars long
];
exports.regsterSchema = schema;
//# sourceMappingURL=register-scheme.js.map