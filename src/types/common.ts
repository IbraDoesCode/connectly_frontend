import { PaginatedResponse, Post, Comment } from "./APITypes";

export type Feed = PaginatedResponse<Post>;
export type Comments = PaginatedResponse<Comment>;
export type FeedType = "public" | "following" | "posts";
