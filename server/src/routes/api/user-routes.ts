import express from 'express';
const router = express.Router();
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} from '../../controllers/user-controller.js';

// import middleware
import { authenticateToken } from '../../services/auth.js';

router.route('/')
  .post(async (req, res) => {
    await createUser(req, res);
  })
  .put(authenticateToken, async (req, res) => {
    await saveBook(req, res);
  });

router.route('/login').post(async (req, res) => {
  await login(req, res);
});

router.route('/me').get(authenticateToken, async (req, res) => {
  await getSingleUser(req, res);
});

router.route('/books/:bookId').delete(authenticateToken, async (req, res) => {
  await deleteBook(req, res);
});

export default router;