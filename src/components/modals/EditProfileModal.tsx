import {
  Stack,
  Button,
  Center,
  Avatar,
  Text,
  Image,
  TextInput,
  ActionIcon,
  MenuTarget,
  Menu,
  MenuDropdown,
  MenuItem,
  Group,
} from "@mantine/core";
import { Profile } from "../../types/APITypes";
import { IconDotsVertical } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/profiles";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

type EditProfileModalProps = {
  profile: Profile;
};

const EditProfileModal = ({ profile }: EditProfileModalProps) => {
  const queryClient = useQueryClient();
  const [bio, setBio] = useState(profile.bio);
  const coverImageRef = useRef<HTMLInputElement | null>(null);

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const profileImageRef = useRef<HTMLInputElement | null>(null);

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const { mutate, isPending } = useMutation({
    mutationKey: ["profile", profile.id],
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", "me"],
      });
      notifications.show({
        title: "Success",
        message: "Profile updated successfully",
        color: "green",
      });
      modals.closeAll();
    },
    onError() {
      notifications.show({
        title: "Error",
        message: "An unexpected error has occured.",
        color: "red",
      });
    },
  });

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    profile.profile_image ?? null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    profile.cover_image ?? null
  );

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImagePreview(URL.createObjectURL(file));
      setCoverImageFile(file);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImagePreview(URL.createObjectURL(file));
      setProfileImageFile(file);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("bio", bio);

    if (profileImageFile) {
      formData.append("profile_image", profileImageFile);
    } else if (profileImagePreview === null && profile.profile_image) {
      formData.append("profile_image", "delete");
    }

    if (coverImageFile) {
      formData.append("cover_image", coverImageFile);
    } else if (coverImagePreview === null && profile.cover_image) {
      formData.append("cover_image", "delete");
    }

    mutate({ userId: String(profile.id), formData });
  };

  const hasChanges =
    bio !== profile.bio ||
    profileImageFile !== null ||
    coverImageFile !== null ||
    (profile.profile_image && profileImagePreview === null) ||
    (profile.cover_image && coverImagePreview === null);

  return (
    <Stack>
      <Group pos="relative">
        <Text>Profile Image</Text>
        <Menu position="bottom-end">
          <MenuTarget>
            <ActionIcon variant="transparent" pos="absolute" top={4} right={4}>
              <IconDotsVertical size={16} />
            </ActionIcon>
          </MenuTarget>
          <MenuDropdown>
            <MenuItem
              color="red"
              onClick={() => {
                setProfileImagePreview(null);
                setProfileImageFile(null);
              }}
              disabled={!profileImagePreview}
            >
              Delete
            </MenuItem>
            <MenuItem onClick={() => profileImageRef.current?.click()}>
              Upload
            </MenuItem>
          </MenuDropdown>
        </Menu>
      </Group>
      <Center>
        <Avatar
          src={profileImagePreview !== null ? profileImagePreview : null}
          size={200}
        />

        <input
          type="file"
          accept="image/*"
          hidden
          ref={profileImageRef}
          onChange={handleProfileImageChange}
        />
      </Center>
      <Group pos="relative">
        <Text>Cover Image</Text>
        <Menu position="bottom-end">
          <MenuTarget>
            <ActionIcon variant="transparent" pos="absolute" top={4} right={4}>
              <IconDotsVertical size={16} />
            </ActionIcon>
          </MenuTarget>
          <MenuDropdown>
            <MenuItem
              color="red"
              onClick={() => {
                setCoverImagePreview(null);
                setCoverImageFile(null);
              }}
              disabled={!coverImagePreview}
            >
              Delete
            </MenuItem>
            <MenuItem onClick={() => coverImageRef.current?.click()}>
              Upload
            </MenuItem>
          </MenuDropdown>
        </Menu>
      </Group>
      <Image
        src={coverImagePreview ?? undefined}
        fallbackSrc="https://placehold.co/600x400?text=Cover"
        radius="md"
      />
      <input
        type="file"
        accept="image/*"
        hidden
        ref={coverImageRef}
        onChange={handleCoverImageChange}
      />

      <TextInput
        label="Bio"
        value={bio}
        onChange={(e) => {
          setBio(e.target.value);
        }}
        placeholder="Describe yourself..."
      />

      <Button
        variant="outline"
        radius="lg"
        onClick={handleSave}
        disabled={!hasChanges}
        loading={isPending}
      >
        Save
      </Button>
    </Stack>
  );
};

export default EditProfileModal;
