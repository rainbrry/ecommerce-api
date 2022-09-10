import { Router } from "express";
import UserController from "#controller/UserController";
import AuthController from "#controller/AuthController";
import { verifyRefreshToken } from "#middleware/VerifyToken";
import { requireAuth, requireAdmin } from "#middleware/Authenticated";

const route = Router();

// Auth routes
route.post("/login", AuthController.login);
route.post("/register", AuthController.register);
route.post("/logout", AuthController.logout);
route.post("/refresh_token", verifyRefreshToken, AuthController.refreshToken);

route.get("/", async (req, res) => res.send("Hello World!"));

// User routes
route.get("/users", requireAdmin, UserController.index);
route.get("/users/:id", requireAuth, UserController.show);
route.post("/users", requireAdmin, UserController.store);
route.put("/users/:id", requireAuth, UserController.update);
route.delete("/users/:id", requireAdmin, UserController.destroy);

export default route;
