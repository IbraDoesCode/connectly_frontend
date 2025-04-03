export interface IPost {
  id: number;
  author: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  content: string;
  post_type: "text" | "image" | "video";
  media?: { url: string }[];
  created_at: string;
  is_liked: boolean;
  like_count: number;
  comment_count: number;
}

export type FeedType = "public" | "following";
