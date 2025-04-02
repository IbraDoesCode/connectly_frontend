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
import { notifications } from "@mantine/notifications";
import { GoogleButton } from "../components/GoogleButton";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../util/apiClient";
import { AxiosError } from "axios";

interface LoginCredentials {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: async ({ username, password }: LoginCredentials) => {
      const res = await apiClient.post("/token/", {
        username,
        password,
      });

      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      notifications.show({
        title: "Authentication",
        message: "Login success!",
        color: "green",
      });
      navigate("/");
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      notifications.show({
        title: "Authentication",
        message: error.response?.data?.detail,
        color: "red",
      });
    },
  });

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Paper w={420} radius="md" p="xl" withBorder>
        <Text size="lg" fw={500}>
          Welcome to Connectly, login with
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <form onSubmit={form.onSubmit((values) => login(values))}>
          <Stack>
            <TextInput
              required
              label="Username"
              placeholder="your username"
              value={form.values.username}
              onChange={(event) =>
                form.setFieldValue("username", event.currentTarget.value)
              }
              radius="md"
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
              onClick={() => navigate("/signup")}
              size="xs"
            >
              Don't have an account? Register
            </Anchor>

            <Button type="submit" radius="xl" loading={isPending}>
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
