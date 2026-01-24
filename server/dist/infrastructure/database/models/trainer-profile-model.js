"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerProfileModel = void 0;
const mongoose_1 = require("mongoose");
const trainer_profile_schema_1 = require("../schemas/trainer-profile.schema");
exports.TrainerProfileModel = (0, mongoose_1.model)("TrainerProfile", trainer_profile_schema_1.TrainerProfileSchema);
