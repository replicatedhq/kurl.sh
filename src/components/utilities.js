
const  kubernetesVersions = {"kubernetes": ["latest", "1.17.3", "1.16.4", "1.15.3", "1.15.2", "1.15.1", "1.15.0"]}
const dockerVersion = { "docker": ["latest", "19.03.4", "18.09.8"] }

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
    try {
      const resp = await fetch(process.env.SUPPORTED_VERSIONS_JSON);
      const data = await resp.json();
      return { ...data.supportedVersions, ...kubernetesVersions, ...dockerVersion };
    } catch (error) {
      throw error;
    }
  }
}