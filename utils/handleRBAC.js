import { ForbiddenExpection } from './errors.js';

async function handleRBAC(allowedRoles, userRole) {
  try {
    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenExpection('Access denied');
    }
  } catch (error) {
    throw error;
  }
}

export default handleRBAC;
