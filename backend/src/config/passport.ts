import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  VerifiedCallback,
} from "passport-jwt";
import User from "../models/User";
import dotenv from "dotenv";
import generateRandomPassword from "../utils/generateRandomPassword";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENTID!,
      clientSecret: process.env.CLIENTSECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    async (
      _accessToken: string,
      _refreshToken: string | undefined,
      profile: Profile,
      done: VerifiedCallback
    ) => {
      try {
        console.log("Profile:", profile);

        if (!profile) {
          console.error("Google Profile is undefined");
          return done(new Error("Google Profile is undefined"));
        }
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails ? profile.emails[0].value : "",
            name: profile.displayName || "Anonymous",
            profileImage: profile.photos ? profile.photos[0].value : "",
            password: await generateRandomPassword(),
          });
          await user.save();
        }
        const accessToken = generateAccessToken({ id: user.id });
        const refreshToken = generateRefreshToken({ id: user.id });

        const userObject = user.toObject();
        done(null, { ...userObject, accessToken, refreshToken });
      } catch (err) {
        console.error("Error in GoogleStrategy:", err);
        done(err);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN!,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
