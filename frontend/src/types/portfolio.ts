export type Uuid = string;
export type IsoDate = string;
export type IsoDateTime = string;

export type Skill = {
  id: Uuid;
  name: string;
  category: string;
  sort_order: number;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
};

export type Experience = {
  id: Uuid;
  profile_id: Uuid;
  company: string;
  role: string;
  description: string;
  start_date: IsoDate;
  end_date: IsoDate | null;
  is_current: boolean;
  sort_order: number;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
};

export type Project = {
  id: Uuid;
  profile_id: Uuid;
  slug: string;
  title: string;
  summary: string;
  description: string;
  repository_url: string | null;
  live_url: string | null;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
  skills: Skill[];
};

export type Profile = {
  id: Uuid;
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  github_url: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
};

export type Portfolio = {
  profile: Profile;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
};
