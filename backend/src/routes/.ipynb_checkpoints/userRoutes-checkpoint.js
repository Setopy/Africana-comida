const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, owner } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const validate = require('../middleware/validator');
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  addressValidation,
  passwordValidation
} = require('../validators/userValidator');

// Public routes with rate limiting
router.post(
  '/register',
  rateLimiter({ windowMs: 60 * 60 * 1000, max: 5 }),
  validate(registerValidation),
  userController.register
);

router.post(
  '/login',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 10 }),
  validate(loginValidation),
  userController.login
);

router.post(
  '/refresh-token',
  rateLimiter({ windowMs: 60 * 1000, max: 5 }),
  userController.refreshToken
);

router.post(
  '/logout',
  userController.logout
);

// Protected routes with validation
router.get(
  '/profile',
  auth,
  userController.getProfile
);

router.put(
  '/profile',
  auth,
  validate(updateProfileValidation),
  userController.updateProfile
);

router.put(
  '/change-password',
  auth,
  validate(passwordValidation),
  userController.changePassword
);

router.put(
  '/deactivate',
  auth,
  userController.deactivateAccount
);

// Address routes
router.post(
  '/address',
  auth,
  validate(addressValidation),
  userController.addAddress
);

router.put(
  '/address/:addressId',
  auth,
  validate(addressValidation),
  userController.updateAddress
);

router.delete(
  '/address/:addressId',
  auth,
  userController.deleteAddress
);

module.exports = router;