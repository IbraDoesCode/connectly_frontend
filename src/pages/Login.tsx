import {
  Anchor,
  Button,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { notifications } from "@mantine/notifications";

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

  const { login, isLoggingIn, authenticatedUser, googleLogin } = useAuth();

  useEffect(() => {
    if (authenticatedUser) navigate("/home");
  }, [authenticatedUser, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Paper w={420} radius="md" p="xl" withBorder>
        <form onSubmit={form.onSubmit((values) => login(values))}>
          <Stack gap="lg">
            <Text size="lg" fw={600} ta="center">
              Sign in to Connectly
            </Text>

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

            <Button
              variant="outline"
              type="submit"
              radius="lg"
              loading={isLoggingIn}
            >
              Login
            </Button>

            <Divider label="or" labelPosition="center" />

            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse) {
                  googleLogin(credentialResponse.credential!);
                }
              }}
              onError={() => {
                notifications.show({
                  title: "Authentication",
                  message: "Google login failed",
                });
              }}
              text="continue_with"
              shape="pill"
            />

            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => navigate("/signup")}
              size="xs"
              ta="start"
            >
              Don't have an account? Register
            </Anchor>
          </Stack>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
