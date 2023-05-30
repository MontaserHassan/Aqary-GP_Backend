const mongoose = require('../config/database');

const actionSchema = new mongoose.Schema({
    canBlockUser: { type: Boolean, default: false },
    canDeletePropertyAds: { type: Boolean, default: false },
    canDeleteProperty: { type: Boolean, default: false },
    canShowDashboard: { type: Boolean, default: false },
});

const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        required: true,
        maxLength: 128,
        minLength: 2
    },
    actions: actionSchema,
});

const RoleModel = mongoose.model("Role", roleSchema);

module.exports = RoleModel;