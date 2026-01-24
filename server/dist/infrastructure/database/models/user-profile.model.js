"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileModel = void 0;
const mongoose_1 = require("mongoose");
const user_profile_schema_1 = require("../schemas/user-profile.schema");
exports.UserProfileModel = (0, mongoose_1.model)("UserProfile", user_profile_schema_1.UserProfileSchema);
