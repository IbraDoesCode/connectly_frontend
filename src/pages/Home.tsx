import { useState } from "react";
import FeedTypeSelector from "../components/FeedTypeSelector";
import Feed from "../components/Feed";
import NewPost from "../components/NewPost";

const Home = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="flex-1 w-full">
      <FeedTypeSelector
        feedType={feedType}
        setFeedType={setFeedType}
        data={[
          { label: "For You", value: "forYou" },
          { label: "Following", value: "following" },
        ]}
      />

      <NewPost />

      <Feed feedType={feedType} />
    </div>
  );
};

export default Home;
