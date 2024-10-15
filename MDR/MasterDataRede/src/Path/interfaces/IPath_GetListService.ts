export interface IPath_GetListService{
    obtainPaths(): Promise<any> ;
    getPath(string : string) : Promise<any> ;
}