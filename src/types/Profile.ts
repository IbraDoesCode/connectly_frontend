export interface IProfile {
  id: number;
  username: string;
  full_name: string;
  bio: string;
  created_at: string;
  is_following: boolean;
  posts_count: number;
  followers: number;
  following: number;
}
