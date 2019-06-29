import * as fs from 'fs';
import * as path from 'path';

const WORKSPACE_PATH = path.join(__dirname, '../../workspaces');

export enum WorkspaceTypes {
   bot = 'bot'
}

export function getWorkspaceDirectory(reqUser: any, workspaceName: string): string {
    return path.join(WORKSPACE_PATH, reqUser._id, workspaceName);
}

export function directoryExists(dir: string): Promise<boolean> {
    return new Promise((resolve: Function, reject: Function) => {

        fs.access(dir, (error: any) => {
           if (error) {
               return resolve(false);
           }

           resolve(true);
         });
    });
}

export async function createWorkspace(reqUser: any, dir: string, type: WorkspaceTypes = WorkspaceTypes.bot): Promise<string> {
    const workspaceDirectory: string = getWorkspaceDirectory(reqUser, dir);
    const directoryDoesNotExist = !(await directoryExists(workspaceDirectory));
    
    if (directoryDoesNotExist) {
        fs.mkdirSync(workspaceDirectory);
    }

    return workspaceDirectory;
}