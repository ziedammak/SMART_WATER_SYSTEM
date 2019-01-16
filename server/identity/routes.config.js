const IdentityProvider = require('./controllers/identity.provider');
const AuthorizationValidation = require('../security/authorization/authorization.validation');
const AuthorizationPermission = require('../security/authorization/authorization.permission');
const config = require('../env.config');

const Master = config.permissionLevels.Master;
const Member = config.permissionLevels.Member;
const Surfer = config.permissionLevels.Surfer;

exports.routesConfig = function (app) {
    app.post('/users', [
        IdentityProvider.insert
    ]);
    app.get('/users', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Member),
        IdentityProvider.list
    ]);
    app.get('/users/:userId', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Surfer),
        AuthorizationPermission.onlySameUserOrAdminCanDoThisAction,
        IdentityProvider.getById
    ]);

    /**
     * In a PUT request, the enclosed entity is considered to be
     * a modified version of the resource stored on the origin server,
     * and the client is requesting that the stored version be replaced.
     * So all the attributes are to be updated!
     * Thus this is a privileged action done only by administrator
     */
    app.put('/users/:userId', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        AuthorizationPermission.sameUserCantDoThisAction,
        IdentityProvider.putById
    ]);

    /**
     * PATCH specifies that the enclosed entity contains a set of instructions describing
     * how a resource currently residing on the origin server should be modified to produce a new version.
     * So, some attributes could or should remain unchanged.
     * In our case, a regular user cannot change permissionLevel!
     * Thus only same user or admin can patch without changing identity permission level.
     */
    app.patch('/users/:userId', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Surfer),
        AuthorizationPermission.onlySameUserOrAdminCanDoThisAction,
        IdentityProvider.patchById
    ]);
    app.delete('/users/:userId', [
        AuthorizationValidation.validJWTNeeded,
        AuthorizationPermission.minimumPermissionLevelRequired(Master),
        AuthorizationPermission.sameUserCantDoThisAction,
        IdentityProvider.removeById
    ]);
};