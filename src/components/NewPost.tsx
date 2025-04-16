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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { createPost } from "../api/post";

const NewPost = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement | null>(null);
  const [privacy, setPrivacy] = useState("public");

  const queryClient = useQueryClient();

  const { mutate: post, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setText("");
      setImage(null);
      setPreview(null);
      queryClient.invalidateQueries({ queryKey: ["feed"] });

      notifications.show({
        title: "Success",
        message: "Post created!",
        color: "green",
      });
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("content", text);
    formData.append("privacy_type", privacy);
    if (image) {
      formData.append("post_type", "image");
      formData.append("media_files", image);
    }

    post(formData);
  };

  return (
    <Card className="border border-gray-700 rounded-md p-4" mt="md">
      <Group align="start" gap="sm">
        {/* Avatar */}
        <Avatar radius="xl" />
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
          {preview && (
            <div className="relative w-72 mx-auto mt-2">
              <CloseButton
                className="absolute top-2 right-2 bg-gray-800 rounded-full"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
              />
              <Image src={preview} radius="md" />
            </div>
          )}

          {/* Divider */}
          <Divider my="sm" />
          <Group justify="space-between">
            <Group>
              <ActionIcon
                variant="transparent"
                color="blue"
                onClick={() => imgRef.current?.click()}
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
                  setPrivacy(privacy === "public" ? "followers" : "public")
                }
              >
                {privacy === "public" ? (
                  <IconWorld size={20} />
                ) : (
                  <IconUsers size={20} />
                )}
              </ActionIcon>
            </Group>

            <Button
              radius="xl"
              variant="outline"
              disabled={!text && !image}
              loading={isPending}
              onClick={handleSubmit}
            >
              Post
            </Button>
          </Group>
        </div>
      </Group>
    </Card>
  );
};

export default NewPost;
