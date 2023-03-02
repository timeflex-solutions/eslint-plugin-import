/**
 * @fileOverview Forbids a module from importing itself
 * @author Gio d'Amelio
 */

import resolve from 'eslint-module-utils/resolve';
import moduleVisitor from 'eslint-module-utils/moduleVisitor';
import docsUrl from '../docsUrl';

var path = require('path');
const isIndexRegex = /index\.(ts|js)/;
const isNodeModuleRegex = /node_modules/;

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Static analysis',
      description: 'Forbid a module to import any index to prevent cyclic imports',
      recommended: false,
      url: docsUrl('no-index-import'),
    },
    schema: [],
  },
  create(context) {
    return moduleVisitor((source, node) => {
      const filePath = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
      const fileName = path.basename(filePath);
      const resolved = resolve(source.value, context);
      const resolveFileName = path.basename(resolved);

      if (!isNodeModuleRegex.test(resolved) && !isIndexRegex.test(fileName) && isIndexRegex.test(resolveFileName)) {
        context.report({
          node,
          message: 'Index imports are not allowed',
        });
      }
    }, {commonjs: true});
  },
};
