export interface Profile {
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

export interface Author {
  id: string;
  username: string;
  full_name: string;
}

export interface Post {
  id: number;
  author: Author;
  content: string;
  post_type: "text" | "image" | "video";
  media?: { url: string }[];
  privacy_type: "public" | "followers" | "private";
  created_at: string;
  is_liked: boolean;
  like_count: number;
  comment_count: number;
}

export interface Comment {
  id: number;
  post: number;
  content: string;
  comment_type: "text" | "image";
  author: Author;
  created_at: string;
  is_liked: boolean;
  like_count: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FollowStatusResponse {
  is_following: boolean;
}

export interface LikeStatusResponse {
  liked: boolean;
}
