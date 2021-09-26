import log from './log.js';
import users from './users.js';
import courses from './courses.js';
import resume from './resume.js';

const resolverArray = [users, courses, log, resume];

export default resolverArray;
