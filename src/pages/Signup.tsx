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
import { useForm, isEmail } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { notifications } from "@mantine/notifications";

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

  const { signup, isSigningUp, authenticatedUser, googleLogin } = useAuth();

  useEffect(() => {
    if (authenticatedUser) {
      navigate("/home");
    }
  }, [authenticatedUser, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameParts = form.values.fullname.trim().split(/\s+/);
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ");

    signup({
      first_name,
      last_name,
      username: form.values.username.trim(),
      email: form.values.email.trim(),
      password: form.values.password,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Paper w={420} radius="md" p="xl" withBorder>
        <form onSubmit={handleSubmit}>
          <Stack>
            <Text size="lg" fw={600} ta="center">
              Connectly — Join today.
            </Text>

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

            <Button
              variant="outline"
              type="submit"
              radius="lg"
              loading={isSigningUp}
            >
              Sign Up
            </Button>
          </Stack>

          <Divider label="or" labelPosition="center" my="lg" />

          <Stack gap="lg">
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
              onClick={() => navigate("/")}
              size="xs"
              ta="start"
            >
              Already have an account? Login
            </Anchor>
          </Stack>
        </form>
      </Paper>
    </div>
  );
};

export default Signup;
