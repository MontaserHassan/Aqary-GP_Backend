/* eslint-disable space-in-parens */
/* eslint-disable eol-last */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/extensions */
const logger = require('./config/logger.js');
const app = require('./index.js');
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => logger.info(`app listening on port http://localhost:${PORT}`) );