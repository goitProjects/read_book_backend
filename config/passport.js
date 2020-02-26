/* eslint-disable no-undef */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../server/models/user.model.js');

const { secretJwtKey, googleClientId, googleClientKey } = require('./config');

const isDevMode = process.env.NODE_ENV === 'development';

module.exports = function(passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = secretJwtKey;

  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      // console.log('jwtPayload', jwtPayload);
      User.findOne(
        {
          _id: jwtPayload.id
        },
        (err, user) => {
          if (err) return done(err, false);

          if (user) return done(null, user);

          return done(null, false);
          // or you could create a new account
        }
      );
    })
  );

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      (email, password, done) => {
        User.findOne(
          {
            email
          },
          (err, user) => {
            if (err) throw err;

            if (!user)
              return done(null, false, {
                message: 'Unknown User'
              });

            user.comparePassword(password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                const token = user.getJWT();
                const userData = user.getPublicFields();
                userData.token = token;
                return done(null, userData);
              }

              return done(null, false, {
                message: 'Invalid password'
              });
            });
          }
        );
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientKey,

        callbackURL: isDevMode
          ? `http://localhost:5000/api/v1/auth/google/callback`
          : 'https://book-read.goit.co.ua/api/v1/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('profile', profile);
          const getUser = await User.findOne({
            googleId: profile.id
          });
          console.log('getUser', getUser);
          if (!getUser) {
            const newUser = new User({
              googleId: profile._json.sub,
              name: {
                fullName: profile._json.name,
                firstName: profile._json.given_name,
                lastName: profile._json.family_name
              },
              photo: profile._json.picture,
              email: profile._json.email
            });

            const savedUser = await newUser.save();

            const token = savedUser.getJWT();
            return done(null, {
              ...savedUser,
              token
            });
          }

          if (getUser) {
            const token = getUser.getJWT();
            return done(null, {
              ...getUser,
              token
            });
          }
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};
