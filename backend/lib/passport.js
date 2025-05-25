import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

console.log("Passport strategy loaded"); // thử log ra

// Tạm thời comment lại Google OAuth
/*
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value, 
            googleId: profile.id,
            profilePic: profile.photos?.[0]?.value || '',
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
*/
