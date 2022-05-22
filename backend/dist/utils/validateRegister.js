"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (options) => {
    if (options.username.length <= 5) {
        return [
            {
                field: "username",
                message: "the username entered is too short",
            },
        ];
    }
    if (options.username.includes("@")) {
        return [
            {
                field: "username",
                message: "the username should not contain an @ symbol",
            },
        ];
    }
    if (options.email.length <= 8 || !options.email.includes("@")) {
        return [
            {
                field: "email",
                message: "invalid email",
            },
        ];
    }
    if (options.password.length <= 8) {
        return [
            {
                field: "password",
                message: "the password entered is too short",
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map