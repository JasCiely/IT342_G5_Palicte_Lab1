import logger from './utils/logger';

console.log("Login successful:", response.data);

logger.log("Login successful:", response.data);

logger.logUser(response.data, { hideEmail: true });