const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const ppt = async (channel) => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://www.twitch.tv/" + channel);

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // Type into search box
  // await page.type(".devsite-search-field", "automate beyond recorder");

  // Wait and click on first result
  // const searchResultSelector = ".devsite-result-item-link";
  // await page.waitForSelector(searchResultSelector);
  // await page.click(searchResultSelector);

  // Locate the full title with a unique string
  const textSelector = await page.waitForSelector(
    'div[aria-label="Espectadores de ' + channel + ' também assistem"]'
  );
  const fullTitle = await textSelector?.evaluate((el) => {
    return el.innerHTML;
  });

  // Print the full title
  return fullTitle;
  // await browser.close();
};

app.post("/", async (req, res) => {
  try {
    const channel = req.body.channel;
    console.log(channel);
    const html = await ppt(channel);
    return res.json({ html, status: true });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ status: false });
  }
});

app.listen(3000, () => console.log("http://localhost:3000"));
