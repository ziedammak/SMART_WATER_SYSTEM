module.exports = {
    "port": 8443,
    "appEndpoint": "https://localhost:8443",
    "apiEndpoint": "https://localhost:8443",
    "refresh_secret": "Oh!42My@Go6*d9753!",
    "jwtValidityTimeInSeconds": 1020,
    "environment": "dev",
    "permissionLevels": {
        "Surfer": 1,
        "Member": 32768,
        "Master": 1073741824
    },
    "actualRefreshSecret": null,
    "initRefreshSecret": function () {
        this.actualRefreshSecret = this.refresh_secret.concat('$' + (new Date(Date.now())).toISOString());
    }
};