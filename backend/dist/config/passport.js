"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_jwt_1 = require("passport-jwt");
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
const generateRandomPassword_1 = __importDefault(require("../utils/generateRandomPassword"));
const token_1 = require("../utils/token");
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        let user = await User_1.default.findOne({ googleId: profile.id });
        if (!user) {
            user = new User_1.default({
                googleId: profile.id,
                email: profile.emails ? profile.emails[0].value : "",
                name: profile.displayName || "Anonymous",
                profileImage: profile.photos ? profile.photos[0].value : "",
                password: await (0, generateRandomPassword_1.default)(),
            });
            await user.save();
        }
        const accessToken = (0, token_1.generateAccessToken)({ id: user.id });
        const refreshToken = (0, token_1.generateRefreshToken)({ id: user.id });
        const userObject = user.toObject();
        done(null, { ...userObject, accessToken, refreshToken });
    }
    catch (err) {
        console.error("Error in GoogleStrategy:", err);
        done(new Error());
    }
}));
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN,
}, async (payload, done) => {
    try {
        const user = await User_1.default.findById(payload.id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
}));
exports.default = passport_1.default;
