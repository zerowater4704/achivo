"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const setupPassport = (passport) => {
    // passport.use(
    //   new GoogleStrategy(
    //     {
    //       clientID: process.env.CLIENTID!,
    //       clientSecret: process.env.CLIENTSECRET!,
    //       callbackURL: "http://localhost:3000/auth/google/callback",
    //     },
    //     async (
    //       _accessToken: string,
    //       _refreshToken: string | undefined,
    //       profile: Profile,
    //       done: (error: any, user?: any) => void
    //     ): Promise<void> => {
    //       try {
    //         let user = await User.findOne({ googleId: profile.id });
    //         if (!user) {
    //           user = new User({
    //             googleId: profile.id,
    //             email: profile.emails ? profile.emails[0].value : "",
    //             name: profile.displayName || "Anonymous",
    //             profileImage: profile.photos ? profile.photos[0].value : "",
    //           });
    //           await user.save();
    //         }
    //         done(null, user);
    //       } catch (err) {
    //         done(err, null);
    //       }
    //     }
    //   )
    // );
    passport.use(new passport_jwt_1.Strategy({
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
};
exports.default = setupPassport;
