<<<<<<< HEAD
import { Router } from "express";
import { healthCheck  } from "../controllers/healthcheck.controller.js";

const router = Router();

router.route("/").get( healthCheck )

=======
import { Router } from "express";
import { healthCheck  } from "../controllers/healthcheck.controller.js";

const router = Router();

router.route("/").get( healthCheck )

>>>>>>> origin/master
export default router;