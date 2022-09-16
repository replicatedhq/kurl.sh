
exports.openebsComment = `# OpenEBS is the default PV provisioner, and
# will work for single node clusters, or for
# applications that handle data replication
# between nodes themselves (MongoDB, Cassandra,
# etc). If your requirements are different than
# this, contact us at
# https://community.replicated.com .
#`

exports.injectYamlOpenebsComment = (yaml) => {
  const m = yaml.match(/^ +openebs: *$/m);
  if (!m) {
    return yaml;
  }
  const indent = getIndentCount(m[0]);
  return `${yaml.slice(0, m.index)}
${indentString(this.openebsComment, indent)}
${yaml.slice(m.index)}`;
};

const getIndentCount = (str) =>
  str.match(/^[^o]+/m)[0].length;

const indentString = (str, count) =>
  str.replace(/^/gm, ' '.repeat(count));
