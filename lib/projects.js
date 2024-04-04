import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const projectsDir = path.join(process.cwd(), 'projects');

export function getSortedProjectsData() {
    // Get file names under /projects
    const fileNames = fs.readdirSync(projectsDir);
    const allProjectsData = fileNames.map((fileName) => {

      const name = fileName;
      
      // Read markdown file as string
      const jsonPath = path.join(projectsDir, `${name}`, 'pyscript.json')
      const jsonContent = ["---json",
                    fs.readFileSync(jsonPath,'utf8'),
                    "---"].join('\n');
  
      // Use gray-matter to parse the post metadata section
      const matterResult = matter(jsonContent);
  
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
    const jsonContent = ["---json", fs.readFileSync(path.join(projPath, 'pyscript.json'), 'utf8'), "---"].join('\n');
    const scriptPath = path.join(projectsDir, `${name}.py`)

    // use gray-matter to parse the pyscript metadata section
    const matterResult = matter(jsonContent);    // read from {name}/pyscript.json

    // combine name, script, and gray-matter data
    return {
        name,
        jsonContent,
        scriptPath,
        ...matterResult.data,
    };
}