const apiError = require("../error/apiError");
const {User} = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwt = (id, email, firstName, role, status) => {
    return jwt.sign({id, email, firstName, role, status}, process.env.SECRET_KEY, {expiresIn: "24h"});
}

class userController {
    
    async registration(request, response, next) {

        try {   
            const {email, password, role, firstName, status, lastLoginDate} = request.body;
            if(!email || !password) {
                return next(apiError.badrequest("Некорректный email или пароль"));
            }
            const candidate = await User.findOne({where: {email}});
            if(candidate) {
                return next(apiError.badrequest("Пользователь с таким email уже существует"));
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({email, password: hashPassword, firstName, status, role, lastLoginDate});
            const token = generateJwt(user.id, user.email, user.firstName, user.role, user.status, user.lastLoginDate);
            return response.json({token});
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async login(request, response, next) {

        try {
            const {email, password} = request.body;
            const user = await User.findOne({where: {email}});
            if(!user) {
                return next(apiError.internal("Пользователь не найден"));
            }
            if(user.status === 'BLOCKED') {
                return next(apiError.internal("Пользователь заблокирован"));
            }
            let comparePassword = bcrypt.compareSync(password, user.password);
            if(!comparePassword) {
                return next(apiError.internal("Неверный пароль"));
            }

            const token = generateJwt(user.id, user.email, user.firstName, user.role, user.status);
            return response.json({token});
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async changeLoginDate(request, response) {

        let {lastLoginDate} = request.body;
        let {email} = request.query;

        const user = await User.update({lastLoginDate}, {where: {email}});

        return response.json(user);
    }

    async check(request, response) {

        const token = generateJwt(request.user.id, request.user.email, request.user.firstName, request.user.role, request.user.status);
        return response.json({token});
    }

    async getALL(request, response, next) {

        try {
            const users = await User.findAll({ order: ['id'] });
            return response.json(users);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

    async delete(request, response, next) {

        try {
            let {id} = request.query;
            const user = await User.destroy({where:{id}});
            return response.json(user);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }
    
    }

    async changeStatus(request, response, next) {

        try {
            let {id} = request.query;
            let {status} = request.body;
            const user = await User.update({status: status}, {where:{id}});
            return response.json(user);
        } catch (error) {
            next(apiError.badrequest(error.message));
        }

    }

}

module.exports = new userController();
