import passport, { PassportStatic, Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();
const setupPassport = (passport: PassportStatic) => {
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
};

export default setupPassport;
