import { Router } from 'express';
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import passport from "passport";
import { User, UserDocument, AuthToken } from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { WriteError } from "mongodb";
import { check, sanitize, validationResult } from "express-validator";
import "../config/passport";
import { G_ERROR_DUPLICATE_FIELD, MONGO_ERROR_VALIDATION } from '../util/constants';


const router = Router();


/**
 * login
 */
router.get('/', async (req: any, res, next) => {
  check("email", "Email is not valid").isEmail();
  check("password", "Password cannot be blank").isLength({ min: 1 });
  sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error(errors);
    // req.flash("errors", errors.array());
    // return res.redirect("/login");
  }

  passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
    if (err) { return next(err); }

    if (!user) {
      // req.flash("errors", { msg: info.message });
      return res.sendStatus(404);
    }
    // req.logIn(user, (err: any) => {
    //   if (err) { return next(err); }
    //   req.flash("success", { msg: "Success! You are logged in." });
    //   res.redirect(req.session.returnTo || "/");
    // });
  })(req, res, next);
});

/**
 * POST /login
 * Sign in using email and password.
 */
router.post('/', async (req: any, res, next) => {
  check("email", "Email is not valid").isEmail();
  check("password", "Password cannot be blank").isLength({min: 1});
  sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error(errors);
    // req.flash("errors", errors.array());
    // return res.redirect("/login");
  }

  passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
    if (err) { return next(err); }
    if (!user) {
      console.error(err)
      // req.flash("errors", {msg: info.message});
      // return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      // console.error(errors);
      // req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/");
    });
  })(req, res, next);
});


/**
 * POST /signup
 * Create a new local account.
 */
export const register = (req: Request, res: Response, next: NextFunction) => {
  check("email", "Email is not valid").isEmail();
  check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
  check("confirmPassword", "Passwords do not match").equals(req.body.password);
  sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error(errors);
    return next(errors);
    // req.flash("errors", <any>errors.array()[0]);
    // return res.status(409).send('asdf')
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    profile: {
      name: req.body.username
    }
  });

  User.findOne({ email: req.body.email }, (error, existingUser) => {
    if (error) {
      if (error.name === MONGO_ERROR_VALIDATION) {
        const firstErrorField = Object.keys(error.errors)[0];
        const firstErrorKind = error.errors[firstErrorField].kind;

        // req.flash("errors", "Account with that email address already exists.");
        return res.status(409).send({ code: G_ERROR_DUPLICATE_FIELD, field: firstErrorField });
      }
    }

    user.save((err) => {

      if (err) {
        return next(err);
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        res.redirect("/");
      });
    });
  });
};


export default router;