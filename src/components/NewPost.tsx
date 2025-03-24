import { useRef, useState } from "react";
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Divider,
  Group,
  Textarea,
  Image,
  CloseButton,
} from "@mantine/core";
import { IconPhotoPlus, IconUsers, IconWorld } from "@tabler/icons-react";

const NewPost = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const imgRef = useRef(null);
  const [privacy, setPrivacy] = useState("public");

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="border border-gray-700 rounded-md p-4" mt="md">
      <Group align="start" gap="sm">
        {/* Avatar */}
        <Avatar radius="xl" src="/avatar-placeholder.png" />
        <div className="flex flex-col flex-1">
          {/* Text Input */}
          <Textarea
            placeholder="What is happening?!"
            autosize
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="unstyled"
          />

          {/* Image Preview */}
          {image && (
            <div className="relative w-72 mx-auto mt-2">
              <CloseButton
                className="absolute top-2 right-2 bg-gray-800 rounded-full"
                onClick={() => setImage(null)}
              />
              <Image src={image} radius="md" />
            </div>
          )}

          {/* Divider */}
          <Divider my="sm" />
          <Group justify="space-between">
            <Group>
              <ActionIcon
                variant="transparent"
                color="blue"
                onClick={() => imgRef.current.click()}
              >
                <IconPhotoPlus size={18} />
              </ActionIcon>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={imgRef}
                onChange={handleImgChange}
              />
              <ActionIcon
                variant="transparent"
                color="blue"
                onClick={() =>
                  setPrivacy(privacy === "public" ? "private" : "public")
                }
              >
                {privacy === "public" ? (
                  <IconWorld size={20} />
                ) : (
                  <IconUsers size={20} />
                )}
              </ActionIcon>
            </Group>

            <Button radius="xl" variant="outline" disabled={!text && !image}>
              Post
            </Button>
          </Group>
        </div>
      </Group>
    </Card>
  );
};

export default NewPost;
