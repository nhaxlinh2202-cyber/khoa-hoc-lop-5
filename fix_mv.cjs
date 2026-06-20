const fs = require('fs');

function fixModelViewer(path) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/import\s+'@google\/model-viewer';/g, '');
  
  if (!content.includes('import(\\'@google/model-viewer\\')')) {
    content = content.replace(/useEffect\(\(\) => \{/, "useEffect(() => { import('@google/model-viewer').catch(console.error); ");
  }
  
  fs.writeFileSync(path, content);
}

fixModelViewer('src/app/activity/hd3/page.tsx');
