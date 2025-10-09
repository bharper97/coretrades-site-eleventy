// .eleventy.js
const { DateTime } = require("luxon");

function toDate(input){ return input instanceof Date ? input : new Date(input || null); }

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("date", (val, fmt = "MMMM d, yyyy") =>
    DateTime.fromJSDate(toDate(val)).toFormat(fmt)
  );
  eleventyConfig.addFilter("readableDate", (val) =>
    DateTime.fromJSDate(toDate(val)).toFormat("MMMM d, yyyy")
  );

  eleventyConfig.addPassthroughCopy({ "src/background.jpg": "background.jpg" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/CoreTrades_Lean_Canvas_Canada.pdf": "CoreTrades_Lean_Canvas_Canada.pdf" });
  eleventyConfig.addPassthroughCopy({ "src/CoreTrades_Full_Business_Plan_Canada_Final.pdf": "CoreTrades_Full_Business_Plan_Canada_Final.pdf" });
  eleventyConfig.addPassthroughCopy({ "src/CoreTrades_Full_Business_Plan_Canada.pdf": "CoreTrades_Full_Business_Plan_Canada.pdf" });
  eleventyConfig.addPassthroughCopy({ "src/Core_Trades_Proof_Deck.pdf": "Core_Trades_Proof_Deck.pdf" });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", layouts: "_includes/layouts" },
    templateFormats: ["njk","md","html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
