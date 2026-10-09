// Jest runs outside Vite. Substitute only the BASE_URL used by this module.
module.exports = ({ types: t }) => ({ visitor: {
  MemberExpression(path) {
    const node = path.node;
    if (t.isIdentifier(node.property, { name: 'BASE_URL' }) &&
        t.isMemberExpression(node.object) && t.isIdentifier(node.object.property, { name: 'env' }) &&
        t.isMetaProperty(node.object.object) && node.object.object.meta.name === 'import') {
      path.replaceWith(t.stringLiteral('/'));
    }
  },
} });
