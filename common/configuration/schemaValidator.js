// Copyright 2022 The CmLab Authors
// This file is part of the expand Library.

const Ajv = require('ajv');

const ajv = new Ajv( {allErrors: true, strict: true, useDefaults: true} );
const errorMessage = require('./errorMessage.json');

// Import the AJV error messages
require("ajv-errors")(ajv);


// Standard JSON schema for the complete adaptor program
// Including all the functions
const {jsonSchema} = require('./schema');

exports.validateInput = async(options) => {
    /*
     * This functions validate the given options as per the schema
     * Returns the validate response as of following
     * 
     * {
     *    "valid": false,
     *    "message" : {
     *       "error": {
     *          missingProperty: 'address' 
     *      }
     *    }
     *    "code" : 401
     * }    
     */
    const validate = ajv.compile(jsonSchema);
    const valid = validate(options);
    const error = valid ? null : validate.errors[0].params;
    const response = {};

    response.valid = valid;

    if ( !valid ) {
        response.message = error;
        if(validate.errors[0].params.errors !== undefined){
        delete response.message;
        response.additionalProperty = validate.errors[0].params.errors[0].params.additionalProperty;
        response.allowedValues = validate.errors[0].message;
        }
        response.code = errorMessage.error.code.invalidInput;
    } 

    
    return (response);
};