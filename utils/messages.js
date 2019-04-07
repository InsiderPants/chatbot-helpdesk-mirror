/*
    *Module for defining all errors
*/
module.exports = {
    error:{
        SERVER_ERROR: "Server Error",
        UNKNOWN_ERROR: "Sorry, unknown error occured. We're looking into the matter.",
        INVALID_REQUEST: "Invalid Request",
        DATADASE_PUSH_ERROR_USER: "Server error while adding. Try again",
        DATABASE_SAVE_ERROR: "Error Saving to database",
        REPEAT_SIGNUP_ERROR: "You are already registered. Please login to continue",
        UNAUTH_API_REQUEST: 'You are not authorised to access this API',
        INVALID_ACCESS_TOKEN: "Access token not valid",
        UNREGISTERED_EMAIL: "This Email is not registered. Please Signup to continue",
        INCORRECT_PASSWORD: "Incorrect password, please try again",
        NO_INTENT_IN_DB: "No intent exists in database. Add some to view",
        INTENT_NOT_FOUND: "Intent not found in database"
    },
    success: {
        ACCESS_VALIDATED: "Access validated",
        SUCCESSFULLY_ADDED_TO_DATABASE: "Successfully added into database",
        SIGNUP_SUCCESS: "SignUp successful, please login to continue",
        LOGIN_SUCCESS: 'Login Successful',
        SUCCESSFULLY_REMOVED_FROM_DATABASE: "Successfully removed from database"
    }

};