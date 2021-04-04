const axios = require("axios");
module.exports = {
  host: 0,
  hosts: ["85.62.86.187", "193.145.222.23"],
  headers: {
    host: "dle.rae.es",
    "User-Agent":
      "Mozilla/5.0 (X11; CrOS i686 2268.111.0) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11ua.firefox",
  },
  patters: {
    header: `<header.*?title="(.*?)".*?>`,
    source: `<p.*?class="n2".*?>(.*?)<\/p>`,
    definition: { rgx: `<p.*?class="j".*?>(.*?)<\/p>`, multiple: true },
  },
  setHost(idx) {
    this.host = idx;
  },
  addHost(ip) {
    this.hosts.unshift(ip);
  },
  listHosts() {
    return this.hosts;
  },
  endpoint() {
    return `https://${this.hosts[this.host]}`;
  },
  async search(query) {
    try {
      const { data } = await axios.get(`${this.endpoint()}/${query}`, {
        headers: this.headers,
      });

      const articles = data.match(
        new RegExp(`<article.*?>(.*?)<\/article>`, "igs")
      );
      let response = [];
      articles.forEach((article) => {
        let def = {};
        Object.keys(this.patters).forEach((key) => {
          const r = article.match(
            new RegExp(
              typeof this.patters[key] == "object"
                ? this.patters[key].rgx
                : this.patters[key],
              this.patters[key].multiple ? "gi" : "i"
            )
          );
          if (this.patters[key].multiple)
            def[key] = r.map((e) => {
              return this.clean(e);
            });
          else def[key] = this.clean(r ? r[1] : "");
        });
        response.push(def);
      });
      return { query: query, results: response };
    } catch (error) {
      return {
        query: query,
        error: { code: error.code ? error.code : 404, host: this.endpoint() },
      };
    }
  },
  clean(str) {
    return str.replace(/(<([^>]+)>)/gi, "");
  },
};
