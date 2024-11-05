import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../userPool";

export const loginUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool,
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                console.log("onSuccess: ", data);
                localStorage.setItem('jwt_access_token', data.accessToken.jwtToken);
                localStorage.setItem('user_sub', data.accessToken.payload.sub);
                resolve(data);
            },
            onFailure: (err) => {
                console.error("onFailure: ", err.message);
                reject(err);
            },
            newPasswordRequired: (data) => {
                console.log("newPasswordRequired: ", data);
                reject(new Error("New password required"));
            },
        });
    });
};
