import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { GoogleButton } from "../components/GoogleButton";
import { useForm, isEmail } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import apiClient from "../util/apiClient";
import { AxiosError } from "axios";
import React from "react";

interface SignupData {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
    },

    validate: {
      fullname: (value) => {
        const nameParts = value.trim().split(/\s+/);
        return nameParts.length < 2
          ? "Please enter both first and last name."
          : null;
      },
      username: (value) =>
        value.trim().length < 3
          ? "Username must be at least 3 characters"
          : null,
      email: isEmail("Invalid email address"),
      password: (value) =>
        value.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const { mutate: signup, isPending } = useMutation({
    mutationFn: async (userData: SignupData) => {
      const [first_name, ...lastNameParts] = userData.fullname
        .trim()
        .split(/\s+/);
      const last_name = lastNameParts.join(" ");
      const res = await apiClient.post("/users/register/", {
        first_name,
        last_name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });

      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);

      notifications.show({
        title: "Authentication",
        message: "Sign up successful!",
        position: "top-right",
        color: "green",
      });

      navigate("/");
    },
    onError: (error: AxiosError<{ username?: string[]; email?: string[] }>) => {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response?.data.username) {
        errorMessage = error.response?.data.username[0];
      } else if (error.response?.data.email) {
        errorMessage = error.response?.data.email[0];
      }

      notifications.show({
        title: "Signup Failed",
        message: errorMessage,
        position: "top-right",
        color: "red",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = form.validate();

    if (Object.keys(validation.errors).length === 0) {
      signup(form.values);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Paper w={420} radius="md" p="xl" withBorder>
        <Text size="lg" fw={500}>
          Welcome to Connectly, Sign up with{" "}
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              required
              label="Full name"
              placeholder="Your full name"
              value={form.values.fullname}
              onChange={(event) =>
                form.setFieldValue("fullname", event.currentTarget.value)
              }
              radius="md"
              error={form.errors.fullname}
            />

            <TextInput
              required
              label="Username"
              placeholder="Username"
              value={form.values.username}
              onChange={(event) =>
                form.setFieldValue("username", event.currentTarget.value)
              }
              radius="md"
              error={form.errors.username}
            />

            <TextInput
              required
              label="Email"
              placeholder="youremail@email.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              radius="md"
              error={form.errors.email}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />
          </Stack>
          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => navigate("/login")}
              size="xs"
            >
              Already have an account? Login
            </Anchor>

            <Button type="submit" radius="xl" loading={isPending}>
              Sign Up
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
};

export default Signup;
