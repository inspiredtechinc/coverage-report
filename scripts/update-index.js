const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');

function getServiceDirs() {
  return fs.readdirSync(rootDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'scripts')
    .map(dirent => dirent.name);
}

function buildIndex(services) {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Coverage Reports</title>
  <style>body{font-family:sans-serif;} ul{line-height:2;}</style>
</head>
<body>
  <h1>Coverage Reports</h1>
  <ul>
`;
  services.forEach(service => {
    const reportPath = `${service}/index.html`;
    if (fs.existsSync(path.join(rootDir, reportPath))) {
      html += `    <li><a href="${reportPath}">${service}</a></li>\n`;
    }
  });
  html += '  </ul>\n</body>\n</html>\n';
  return html;
}

const services = getServiceDirs();
const indexHtml = buildIndex(services);
fs.writeFileSync(indexPath, indexHtml);
console.log('Updated index.html with coverage report links:', services);
