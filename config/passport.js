const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user.model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const findOrCreateSocialUser = async ({ providerField, providerId, profile }) => {
  const email = profile.emails?.[0]?.value || "";
  const avatar = profile.photos?.[0]?.value || "";
  const fullName = profile.displayName || email || "Người dùng";

  let user = await User.findOne({
    [providerField]: providerId,
    deleted: false
  });

  if (user) {
    return user;
  }

  if (email) {
    user = await User.findOne({
      email: email,
      deleted: false
    });

    if (user) {
      user[providerField] = providerId;
      if (!user.avatar && avatar) {
        user.avatar = avatar;
      }
      if (!user.fullName && fullName) {
        user.fullName = fullName;
      }
      await user.save();
      return user;
    }
  }

  return User.create({
    [providerField]: providerId,
    fullName: fullName,
    email: email,
    avatar: avatar,
    status: "active"
  });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/user/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateSocialUser({
          providerField: "googleId",
          providerId: profile.id,
          profile: profile
        });
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BASE_URL}/user/facebook/callback`,
      profileFields: ["id", "displayName", "emails", "photos"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateSocialUser({
          providerField: "facebookId",
          providerId: profile.id,
          profile: profile
        });
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
