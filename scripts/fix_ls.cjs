const fs = require('fs');

function fixFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  
  content = content.replace(/localStorage\.setItem\('lactic_progress_([a-zA-Z0-9_]+)', 'true'\);/g, 
    "fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stepKey: '$1' }) }).catch(console.error);"
  );
  
  content = content.replace(/localStorage\.removeItem\('lactic_progress_([a-zA-Z0-9_]+)'\);/g, '');

  // Add typeof window checks for other localStorage usages
  content = content.replace(/localStorage\.getItem\(([^)]+)\)/g, "(typeof window !== 'undefined' ? localStorage.getItem($1) : null)");
  content = content.replace(/localStorage\.setItem\(([^)]+)\)/g, "if (typeof window !== 'undefined') localStorage.setItem($1)");
  content = content.replace(/localStorage\.removeItem\(([^)]+)\)/g, "if (typeof window !== 'undefined') localStorage.removeItem($1)");

  fs.writeFileSync(path, content);
}

fixFile('src/app/activity/hd2/page.tsx');
fixFile('src/app/activity/hd3/page.tsx');
fixFile('src/app/activity/hd4/page.tsx');
fixFile('src/app/activity/assessment/page.tsx');
