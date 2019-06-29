import express from "express";
// import compression from "compression";  // compresses requests
import session from "express-session";
import * as bodyParser from "body-parser";
// import lusca from "lusca";
import * as dotenv from "dotenv";
import mongo from "connect-mongo";
import flash from 'express-flash';
import * as path from "path";
import mongoose from "mongoose";
import passport from "passport";
import * as passportConfig from "./config/passport";

// import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import editorController from "./controllers/editor.controller";
import userController from "./controllers/user.controller";
import { register } from "./controllers/user.controller";
import { MONGO_ERROR_VALIDATION, MONGO_ERROR_KIND_REQUIRED, G_ERROR_MISSING_FIELD, MONGO_ERROR_KIND_DUPLICATE, G_ERROR_DUPLICATE_FIELD, G_ERROR_UNKNOWN } from "./util/constants";
import { log } from "console";

const MongoStore = mongo(session);

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;

mongoose.connect(mongoUrl, { useNewUrlParser: true }).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
});

// Express configuration
app.set("port", process.env.PORT || 3000);
// app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use(lusca.xframe("SAMEORIGIN"));
// app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== "/login" &&
        req.path !== "/register" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
        req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
});

// assets path (temp)
app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

// routes
app.use("/api/v1/login", userController);
app.use("/api/v1/register", register);
app.use('/api/v1/editor', editorController)

app.use((error, req, res, next) => {
	if (res.headersSent) {
		console.error('API', error);
		return next(error);
	}

	// pre-handled error
	if (error.statusCode)
		return res.status(error.statusCode).send(error);

	// to-handle error
	if (error.name === MONGO_ERROR_VALIDATION) {
		const firstErrorField =  Object.keys(error.errors)[0];
		const firstErrorKind = error.errors[firstErrorField].kind;

		switch (firstErrorKind) {
			case MONGO_ERROR_KIND_REQUIRED:
				return res.status(409).send({ code: G_ERROR_MISSING_FIELD, field: firstErrorField });
			case MONGO_ERROR_KIND_DUPLICATE:
				return res.status(409).send({ code: G_ERROR_DUPLICATE_FIELD, field: firstErrorField });
			default:
				return res.status(500).send({ code: G_ERROR_UNKNOWN });
		}
	}

	// system error
	console.error('API', error);
	res.status(500).send(error || 'Unknown error');
});

/**
 * Primary app routes.
 */
// app.get("/", homeController.index);
// app.get("/login", userController.getLogin);
// app.post("/login", userController.postLogin);
// app.get("/logout", userController.logout);
// app.get("/forgot", userController.getForgot);
// app.post("/forgot", userController.postForgot);
// app.get("/reset/:token", userController.getReset);
// app.post("/reset/:token", userController.postReset);
// app.get("/signup", userController.getSignup);
// app.post("/signup", userController.postSignup);
// app.get("/contact", contactController.getContact);
// app.post("/contact", contactController.postContact);
// app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
// app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
// app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
// app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
// app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
// app.get("/api", apiController.getApi);

export default app;