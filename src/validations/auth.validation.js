import Joi from "joi";

const register ={
    body: Joi.object({
        HoTen: Joi.string().required().min(3).max(50),
        Email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        SoDienThoai: Joi.string().required().pattern(new RegExp('^[0-9]{10}$')),
        TenTaiKhoan: Joi.string().required(),
        MatKhau: Joi.string().required(),
})
};

const login = { 
    body: Joi.object({
        Email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        MatKhau: Joi.string().required(),
})} ;

export {
    register,
    login
}