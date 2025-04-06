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
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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

  const { login, isLoggingIn } = useAuth();

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

            <Button type="submit" radius="xl" loading={isLoggingIn}>
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
