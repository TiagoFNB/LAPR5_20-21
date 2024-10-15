export interface IDTO_List_Lines {
    filter: string;
    typeFilter: Types;
    sortBy: Types;
  }


export enum Types{
  key = "key",
  name = "name"
}