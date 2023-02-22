const { expect } = require("chai");
const { injectYamlOpenebsComment } = require("../kurl-yaml");

describe("injectYamlOpenebsComment", () => {
  it("will inject the comment if openebs is included", async () => {
        const yaml = `apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
metadata:
  name: ''
spec:
  kubernetes:
    version: 1.24.x
  weave:
    version: 2.6.x
  contour:
    version: 1.22.x
  registry:
    version: 2.8.x
  prometheus:
    version: 0.58.x
  ekco:
    version: latest
  containerd:
    version: 1.6.x
  minio:
    version: 2022-09-07T22-25-02Z
  openebs:
    version: 3.3.x
    isLocalPVEnabled: true
    localPVStorageClassName: local
`;
        const expected = `apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
metadata:
  name: ''
spec:
  kubernetes:
    version: 1.24.x
  weave:
    version: 2.6.x
  contour:
    version: 1.22.x
  registry:
    version: 2.8.x
  prometheus:
    version: 0.58.x
  ekco:
    version: latest
  containerd:
    version: 1.6.x
  minio:
    version: 2022-09-07T22-25-02Z

  # OpenEBS is the default PV provisioner, and
  # will work for single node clusters, or for
  # applications that handle data replication
  # between nodes themselves (MongoDB, Cassandra,
  # etc). If your requirements are different than
  # this, see
  # https://kurl.sh/docs/create-installer/choosing-a-pv-provisioner
  #
  openebs:
    version: 3.3.x
    isLocalPVEnabled: true
    localPVStorageClassName: local
`;
    const actual = injectYamlOpenebsComment(yaml);
    expect(actual).to.equal(expected);
  });
  
  it("will not mutate the yaml if openebs is not included", async () => {
        const yaml = `apiVersion: cluster.kurl.sh/v1beta1
kind: Installer
metadata:
  name: ''
spec:
  kubernetes:
    version: 1.24.x
  weave:
    version: 2.6.x
  contour:
    version: 1.22.x
  registry:
    version: 2.8.x
  prometheus:
    version: 0.58.x
  ekco:
    version: latest
  containerd:
    version: 1.6.x
  minio:
    version: 2022-09-07T22-25-02Z
`;
    const actual = injectYamlOpenebsComment(yaml);
    expect(actual).to.equal(yaml);
  });
});
