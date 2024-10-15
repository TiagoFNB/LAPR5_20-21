const joi = require('@hapi/joi');
const validateDriverType = function (data)  {
    const schema= {
    key: joi.string().min(1).optional(),
    description:joi.string().required().min(3).max(250),
    
    }
    return joi.validate(data,schema);

};



module.exports.validateDriverType  = validateDriverType ;