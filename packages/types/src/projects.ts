import type { MessageResponse } from "./auth";
import type { CategoryProjectDetails } from "./category-projects";
import type { IsoDateString, NamedRef } from "./common";

/** Fields shared by every project response. */
interface ProjectBase {
  id: number;
  /** Max 100 characters. */
  nameAr: string;
  /** Max 100 characters. */
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
  mainImageUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  createdAt: IsoDateString;
  user: { id: number };
}

/** An item of GET /projects: categories are trimmed to `{ id, nameAr, nameEn }`. */
export interface Project extends ProjectBase {
  categoryProjects: NamedRef[];
}

/** GET /projects/:id: categories come back as full rows. */
export interface ProjectDetails extends ProjectBase {
  categoryProjects: CategoryProjectDetails[];
}

/** POST /projects */
export interface CreateProjectRequest {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
  /** Max 255 characters each. */
  mainImageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  /** Non-empty, unique ids of the user's own project categories. */
  categoryProjectsIds: number[];
}

/** The saved entity; optional URLs are omitted when not sent. */
export type CreateProjectResponse = Omit<
  ProjectDetails,
  "mainImageUrl" | "liveUrl" | "repoUrl"
> & {
  mainImageUrl?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
};

/**
 * GET /projects: NOT paginated. The backend returns all of the signed-in
 * user's projects, newest first, and ignores query params.
 */
export type ProjectsResponse = Project[];

/** PATCH /projects/:id: any subset of the create fields. */
export type UpdateProjectRequest = Partial<CreateProjectRequest>;

export type UpdateProjectResponse = MessageResponse;

export type DeleteProjectResponse = MessageResponse;
