import express from "express";
import { HttpError } from "http-errors-enhanced";
import authRouter from "./auth";
import plansRouter from "./plans";
import usersRouter from "./users";
import paymentMethodRouter from "./payment-methods";
import appDedicatedServerPlansRouter from "./app-dedicated-server-plans";
import appsRouter from "./apps";
import webhookRouter from "./webhooks";
import { ErrorResBody } from "../types/http";

const api = express.Router();
api.use("/webhook", webhookRouter);

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.use("/auth", authRouter);
api.use("/plans", plansRouter);
api.use("/users", usersRouter);
api.use("/payment-methods", paymentMethodRouter);
api.use("/app-dedicated-server-plans", appDedicatedServerPlansRouter);
api.use("/apps", appsRouter);

api.use(
  (err: Error | HttpError & ErrorResBody, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof HttpError) {
      if (err.errors) {
        return res.status(err.statusCode).json({ errors: err.errors });
      }
      return res.status(err.statusCode).json({
        errors: { server: { message: err.message } },
      });
    }

    res.status(500).json({ errors: { server: { message: "Server error" } } });
  }
);

export default api;
