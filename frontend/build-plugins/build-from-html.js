import * as fs from 'fs';
import { parseHtml } from 'libxmljs2';

export const buildFromHtml = (htmlFileName) => {
  const doc = parseHtml(fs.readFileSync(htmlFileName, 'utf8'));
  let scriptTagsWithInputReferences;

  return {
    name: 'generate-html',
    buildStart() {
      scriptTagsWithInputReferences = doc.find('//script').map((tag) => ({
        tag,
        referenceId: this.emitFile({ type: 'chunk', id: tag.attr('src').value() }),
      }));
    },
    generateBundle() {
      for (const { tag, referenceId } of scriptTagsWithInputReferences) {
        tag.attr('src', this.getFileName(referenceId));
      }
      this.emitFile({ type: 'asset', source: doc.toString(false), fileName: 'index.html' });
    },
  };
};
