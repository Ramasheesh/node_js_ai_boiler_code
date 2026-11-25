import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authRateLimiter } from '../../middleware/rate-limiter.js';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validation.js';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  validate({ body: registerSchema }),
  authController.register.bind(authController),
);

router.post(
  '/login',
  authRateLimiter,
  validate({ body: loginSchema }),
  authController.login.bind(authController),
);

router.post(
  '/refresh',
  authRateLimiter,
  validate({ body: refreshTokenSchema }),
  authController.refresh.bind(authController),
);

router.post('/logout', authenticate, authController.logout.bind(authController));
router.post('/logout-all', authenticate, authController.logoutAll.bind(authController));
router.get('/me', authenticate, authController.me.bind(authController));

export default router;
