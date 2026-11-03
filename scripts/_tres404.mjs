import puppeteer from "puppeteer-core";

const base = process.argv[2] || "http://localhost:3105";
const rutas = ["/", "/about", "/contact", "/cotizar", "/testimonios", "/privacidad", "/terminos", "/panel"];
const nav = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox"],
});
const p = await nav.newPage();
await p.setViewport({ width: 1440, height: 900 });
const malas = [];
p.on("response", (r) => {
  if (r.status() >= 400) malas.push(`${r.status()} ${r.url()}`);
});
for (const r of rutas) {
  await p.goto(base + r, { waitUntil: "networkidle2" });
}
console.log(malas.length ? [...new Set(malas)].join("\n") : "sin respuestas de error");
await nav.close();
