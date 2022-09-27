import Kurl from "../Kurlsh";

const defaultProps = {
  supportedVersions: {
    "kubernetes": [ "latest", "1.19.16", "1.19.15", "1.19.13" ],
    "antrea": [ "latest", "1.4.0", "1.2.1", "1.2.0" ],
    "aws": [ "latest", "0.1.0" ],
    "calico": [ "latest", "3.9.1" ],
    "collectd": [ "latest", "v5", "0.0.1" ],
    "containerd": [ "latest", "1.6.8", "1.6.7", "1.6.6" ],
    "contour": [ "latest", "1.22.1", "1.22.0", "1.21.1" ],
    "ekco": [ "latest", "0.21.0", "0.20.0", "0.19.9" ],
    "fluentd": [ "latest", "1.7.4" ],
    "goldpinger": [ "latest", "3.5.1-5.2.0", "3.3.0-5.1.0", "3.2.0-5.0.0" ],
    "kotsadm": [ "latest", "1.85.0", "1.84.0", "1.83.0", "1.82.0" ],
    "longhorn": [ "latest", "1.3.1", "1.2.4", "1.2.2" ],
    "metrics-server": [ "latest", "0.4.1", "0.3.7" ],
    "cert-manager": [ "latest", "1.9.1", "1.0.3" ],
    "minio": [ "latest", "2022-09-17T00-09-45Z", "2022-09-07T22-25-02Z", "2022-09-01T23-53-36Z" ],
    "nodeless": [ "latest", "0.0.1" ],
    "openebs": [ "latest", "3.3.0", "3.2.0", "2.12.9", "2.6.0" ],
    "prometheus": [ "latest", "0.59.1-40.1.0", "0.58.0-39.12.1", "0.58.0-39.11.0" ],
    "registry": [ "latest", "2.8.1", "2.7.1" ],
    "rook": [ "latest", "1.0.4", "1.7.11", "1.6.11", "1.5.12" ],
    "rookupgrade": [ "latest", "10to14" ],
    "sonobuoy": [ "latest", "0.56.10", "0.56.8", "0.56.7", "0.55.1" ],
    "velero": [ "latest", "1.9.1", "1.9.0", "1.8.1", "1.7.1" ],
    "weave": [ "latest", "2.6.5-20220825", "2.6.5-20220720", "2.6.5-20220616" ],
    "rke2": [ "latest", "v1.22.6+rke2r1", "v1.19.7+rke2r1", "v1.18.13+rke2r1" ],
    "k3s": [ "latest", "v1.23.3+k3s1", "v1.19.7+k3s1" ],
    "docker": [ "latest", "20.10.17", "20.10.5", "19.03.15" ],
    "certManager": [ "latest", "1.9.1", "1.0.3" ],
    "metricsServer": [ "latest", "0.4.1", "0.3.7" ]
  }
}

describe("Kurl", () => {
  describe("prepareVersions", () => {
    it("keeps latest next to the expected version", () => {
      const input = [
        {version: "latest"},
        {version: "1.0.0"},
        {version: "2.0.0"},
        {version: "2.1.0"},
        {version: "8.0.8"},
        {version: "8.0.9"},
      ]
      const output = [
        {version: "8.0.9"},
        {version: "8.0.8"},
        {version: "2.1.0"},
        {version: "2.0.0"},
        {version: "latest"},
        {version: "1.0.0"},
        {version: "None"},
      ]

      const res = new Kurl(defaultProps).prepareVersions(input);
      expect(res).toEqual(output);
    });

    it("sorts by semantic version", () => {
      const input = [
        {version: "latest"},
        {version: "1.0.0"},
        {version: "2.0.0"},
        {version: "3.0.0"},
        {version: "4.0.0"},
        {version: "5.0.0"},
      ]
      const output = [
        {version: "5.0.0"},
        {version: "4.0.0"},
        {version: "3.0.0"},
        {version: "2.0.0"},
        {version: "latest"},
        {version: "1.0.0"},
        {version: "None"},
      ]

      const res = new Kurl(defaultProps).prepareVersions(input);
      expect(res).toEqual(output);
    });

    it("maintains original order", () => {
      const input = [
        {version: "latest"},
        {version: "5.0.0"},
        {version: "4.0.0"},
        {version: "3.0.0"},
        {version: "2.0.0"},
        {version: "1.0.0"},
      ]
      const output = [
        {version: "latest"},
        {version: "5.0.0"},
        {version: "4.0.0"},
        {version: "3.0.0"},
        {version: "2.0.0"},
        {version: "1.0.0"},
        {version: "None"},
      ]

      const res = new Kurl(defaultProps).prepareVersions(input);
      expect(res).toEqual(output);
    });

    it("maintains x versions on top of static versions", () => {
      const input = [
        {version: "latest"},
        {version: "5.0.0"},
        {version: "4.0.1"},
        {version: "4.0.2"},
        {version: "4.0.3"},
        {version: "4.0.4"},
        {version: "4.0.5"},
        {version: "4.0.x"},
        {version: "3.0.x"},
        {version: "3.0.99"},
        {version: "3.0.100"},
        {version: "2.0.0"},
        {version: "1.0.0"},
      ]
      const output = [
        {version: "latest"},
        {version: "5.0.0"},
        {version: "4.0.x"},
        {version: "4.0.5"},
        {version: "4.0.4"},
        {version: "4.0.3"},
        {version: "4.0.2"},
        {version: "4.0.1"},
        {version: "3.0.x"},
        {version: "3.0.100"},
        {version: "3.0.99"},
        {version: "2.0.0"},
        {version: "1.0.0"},
        {version: "None"},
      ]

      const res = new Kurl(defaultProps).prepareVersions(input);
      expect(res).toEqual(output);
    });

    it("maintains order on non semantic versions", () => {
      const input = [
        {version: "latest"},
        {version: "stable"},
        {version: "nightly"},
        {version: "development"},
      ]
      const output = [
        {version: "latest"},
        {version: "stable"},
        {version: "nightly"},
        {version: "development"},
        {version: "None"},
      ]

      const res = new Kurl(defaultProps).prepareVersions(input);
      expect(res).toEqual(output);
    });
  });

  describe("compareVersions", () => {
    it("returns 0 on non semantic versions", () => {
      const res = new Kurl(defaultProps).compareVersions({version:"a"},{version: "b"});
      expect(res).toBe(0);
    });
    it("x versions to be 'newer' than static version", () => {
      const res = new Kurl(defaultProps).compareVersions({version:"2.0.x"},{version: "2.0.99"});
      expect(res).toBe(-1);
    });
    it("static versions to be 'older' than x version", () => {
      const res = new Kurl(defaultProps).compareVersions({version:"2.0.99"},{version: "2.0.x"});
      expect(res).toBe(1);
    });
    it("major versions are taken into account", () => {
      const res = new Kurl(defaultProps).compareVersions({version:"3.3.4"},{version: "2.3.4"});
      expect(res).toBe(-1);
    });
    it("minor versions are taken into account", () => {
      const res = new Kurl(defaultProps).compareVersions({version:"2.4.4"},{version: "2.3.4"});
      expect(res).toBe(-1);
    });
    it("patch versions are taken into account", () => {
      const res = new Kurl(defaultProps).compareVersions({version:"2.3.5"},{version: "2.3.4"});
      expect(res).toBe(-1);
    });
  });
});
