const routes = {
  login: "/",
  signup: "/signup",
  home: "/home",
  profile: (userId: string) => `/home/profile/${userId}`,
  postDetail: (postId: string) => `/home/post/${postId}`,
};

export default routes;
