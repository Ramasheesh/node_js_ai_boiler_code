import { Router } from 'express';
import { userController } from './user.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { updateUserSchema, updateProfileSchema, userIdParamSchema } from './user.validation.js';
import { Role } from '@prisma/client';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Own profile (must come before /:id to avoid conflict)
router.patch(
  '/profile',
  validate({ body: updateProfileSchema }),
  userController.updateProfile.bind(userController),
);

// Admin-only routes
router.get('/', authorize(Role.ADMIN), userController.getUsers.bind(userController));

router.get(
  '/:id',
  authorize(Role.ADMIN),
  validate({ params: userIdParamSchema }),
  userController.getUserById.bind(userController),
);

router.patch(
  '/:id',
  authorize(Role.ADMIN),
  validate({ params: userIdParamSchema, body: updateUserSchema }),
  userController.updateUser.bind(userController),
);

router.delete(
  '/:id',
  authorize(Role.ADMIN),
  validate({ params: userIdParamSchema }),
  userController.deleteUser.bind(userController),
);

export default router;
