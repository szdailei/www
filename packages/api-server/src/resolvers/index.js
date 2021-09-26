import log from './log';
import users from './users';
import courses from './courses';
import resume from './resume';

const resolverArray = [users, courses, log, resume];

export default resolverArray;
