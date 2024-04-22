import fs, { readFile, readFileSync } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const projectsDir = path.join(process.cwd(), 'projects');

export function getSortedProjectsData() {
  // Get file names under /projects
  const fileNames = fs.readdirSync(projectsDir);
  const allProjectsData = fileNames.map((fileName) => {

    const name = fileName;

    // Read markdown file as string
    const articlePath = path.join(projectsDir, `${name}\\${name}-desc.md`);
    const articleData = fs.readFileSync(articlePath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(articleData);

    // Combine the data with the name
    return {
      name,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allProjectsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllProjectNames() {
  const fileNames = fs.readdirSync(projectsDir);

  return fileNames.map((fileName) => {
    return {
      params: {
        name: fileName,
      },
    };
  });
}

export async function getProjectData(name) {
  const projPath = path.join(projectsDir, `${name}`);
  const articlePath = path.join(projPath, `${name}-desc.md`);
  const articleData = readFileSync(articlePath, 'utf8');

  // use gray-matter to parse the pyscript metadata section
  const matterResult = matter(articleData);    // read from {name}/pyscript.json

  // use remark to convert .md info file to html article content
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // check if project has in-browser version
  if (matterResult.interactive) {
    const scriptPath = path.join(projPath, `${name}.py`);
    const configPath = path.join(projPath, 'pyscript.json');
    // combine name, script, and gray-matter data
    return {
      name,
      scriptPath,
      configPath,
      contentHtml,
      ...matterResult.data,
    };
  } else {
    // combine name, json path, and gray-matter data
    return {
      name,
      contentHtml,
      ...matterResult.data,
    };
  };
}