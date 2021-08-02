import log from './log.js';
import users from './users.js';
import courses from './courses.js';
import language from './language.js';
import pdf from './pdf.js';
import resume from './resume.js';

const resolverArray = [users, courses, language, log, pdf, resume];

export default resolverArray;
