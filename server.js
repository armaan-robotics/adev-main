const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp"
};

function send(res, statusCode, body, contentType) {
  res.writeHead(statusCode, { "Content-Type": contentType || "text/plain; charset=utf-8" });
  res.end(body);
}

function getFilePath(urlPath) {
  var cleanPath = decodeURIComponent(urlPath.split("?")[0]).replace(/^\/+/, "");
  var requestedPath = path.resolve(ROOT, cleanPath || "index.html");

  if (!requestedPath.startsWith(ROOT)) {
    return null;
  }

  return requestedPath;
}

http.createServer(function (req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed");
    return;
  }

  var filePath = getFilePath(req.url);

  if (!filePath) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.stat(filePath, function (statError, stats) {
    if (statError || !stats.isFile()) {
      send(res, 404, "Not found");
      return;
    }

    var contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";

    if (req.method === "HEAD") {
      send(res, 200, "", contentType);
      return;
    }

    fs.createReadStream(filePath)
      .on("error", function () {
        send(res, 500, "Server error");
      })
      .pipe(res);
  });
}).listen(PORT, function () {
  console.log("ADev running at http://localhost:" + PORT);
});
