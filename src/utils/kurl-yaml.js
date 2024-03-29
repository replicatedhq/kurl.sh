
const openebsComment = `# OpenEBS is the default PV provisioner, and
# will work for single node clusters, or for
# applications that handle data replication
# between nodes themselves (MongoDB, Cassandra,
# etc). If your requirements are different than
# this, see
# https://kurl.sh/docs/create-installer/choosing-a-pv-provisioner
#`

exports.injectYamlOpenebsComment = (yaml) => {
  const m = yaml.match(/^ +openebs: *$/m);
  if (!m) {
    return yaml;
  }
  const indent = getIndentCount(m[0]);
  return `${yaml.slice(0, m.index)}
${indentString(openebsComment, indent)}
${yaml.slice(m.index)}`;
};

const getIndentCount = (str) =>
  str.match(/^[^o]+/m)[0].length;

const indentString = (str, count) =>
  str.replace(/^/gm, ' '.repeat(count));
