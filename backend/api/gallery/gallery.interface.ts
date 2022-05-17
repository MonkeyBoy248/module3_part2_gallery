import { Picture } from "@interfaces/picture.interface";

export interface GalleryObject {
  objects: Picture[];
  page: number;
  total: number;
}

export interface QueryObject {
  page: number,
  limit: number,
  filter: boolean,
}