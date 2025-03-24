import { SegmentedControl } from "@mantine/core";

const FeedTypeSelector = ({ feedType, setFeedType, data }) => {
  return (
    <SegmentedControl
      value={feedType}
      onChange={setFeedType}
      data={data}
      fullWidth
      radius="md"
    />
  );
};

export default FeedTypeSelector;
