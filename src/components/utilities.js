export const Utilities = {
  // Converts string to titlecase i.e. 'hello' -> 'Hello'
  // @returns {String}
  toTitleCase(word) {
    let i, j, str, lowers, uppers;
    const _word = typeof word === "string" ? word : this;
    str = _word.replace(/([^\W_]+[^\s-]*) */g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = ["A", "An", "The", "And", "But", "Or", "For", "Nor", "As", "At",
      "By", "For", "From", "In", "Into", "Near", "Of", "On", "Onto", "To", "With"];
    for (i = 0, j = lowers.length; i < j; i++) {
      str = str.replace(new RegExp("\\s" + lowers[i] + "\\s", "g"), (txt) => {
        return txt.toLowerCase();
      });
    }

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ["Id", "Tv"];
    for (i = 0, j = uppers.length; i < j; i++) {
      str = str.replace(new RegExp("\\b" + uppers[i] + "\\b", "g"), uppers[i].toUpperCase());
    }

    return str;
  },

  async getSupportedVersions() {
    const internalAddonVersions = fetch(process.env.SUPPORTED_VERSIONS_JSON)
        .then(response => response.json())
        .then(response => response.supportedVersions);

    const externalAddonVersions = fetch("https://kurl-sh.s3.amazonaws.com/external/addon-registry.json")
        .then(response => response.json());

    return this.mergeAddonVersions(...await Promise.all([internalAddonVersions, externalAddonVersions]));
  },

  mergeAddonVersions(internalAddonVersions, externalAddonVersions) {
    const addons = {};
    Object.keys(externalAddonVersions).forEach(externalAddonName => {
      const fileName = externalAddonName.slice(0, externalAddonName.length - 7);
      const [name, version] = fileName.split("-");
        if(!addons[name]) {
          addons[name] = [version]
        } else {
          addons[name].unshift(version);
        }
    });
    Object.keys(internalAddonVersions).forEach(internalAddonName => {
      if(!addons[internalAddonName]) {
        addons[internalAddonName] = internalAddonVersions[internalAddonName];
      } else {
        addons[internalAddonName].push(...internalAddonVersions[internalAddonName]);
      }
    });
    return addons;
  }
}