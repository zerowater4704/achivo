declare module "bcrypt";
declare module "passport-google-oauth20";
declare module "cors";
declare module "bcryptjs";
declare module "passport-google-oauth" {
  import passport from "passport";

  export interface Profile {
    id: string;
    displayName: string;
    name?: {
      familyName: string;
      givenName: string;
    };
    emails?: Array<{ value: string }>;
    photos?: Array<{ value: string }>;
    provider: string;
    _raw: string;
    _json: any;
  }

  export interface IOAuth2StrategyOption {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  }

  export class OAuth2Strategy extends passport.Strategy {
    constructor(
      options: IOAuth2StrategyOption,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user?: any) => void
      ) => void
    );
  }
}
