export interface IPost {
  id: number;
  author: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  content: string;
  post_type: "text" | "image" | "video";
  media?: { url: string }[];
  privacy_type: "public" | "followers" | "private";
  created_at: string;
  is_liked: boolean;
  like_count: number;
  comment_count: number;
}

export interface IFeed {
  count: number;
  next: string | null;
  previous: string | null;
  results: IPost[];
}
