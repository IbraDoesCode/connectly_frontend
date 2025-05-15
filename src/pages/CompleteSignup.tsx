import {
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
  Anchor,
  Checkbox,
} from "@mantine/core";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const CompleteSignup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [checked, setChecked] = useState(false);
  const location = useLocation();
  const token = location.state?.token;

  const { completeSignUp, isCompletingSignup } = useAuth();

  const handleSubmit = () => {
    if (!username || !checked || !token) return;

    completeSignUp({ username, token });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Paper w={420} radius="md" p="xl" withBorder>
        <Stack>
          <Title order={2}>Create your username</Title>
          <Text size="sm" c="dimmed">
            Continue with your google account or{" "}
            <Anchor size="sm" underline="always" onClick={() => navigate("/")}>
              choose another
            </Anchor>
          </Text>
          <TextInput
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
            error={!username ? "Username is required" : false}
          />

          <Checkbox
            label="I agree to the Terms and Conditions"
            checked={checked}
            onChange={(e) => setChecked(e.currentTarget.checked)}
          />

          <Button
            variant="outline"
            type="submit"
            radius="lg"
            disabled={!(username && checked)}
            onClick={() => handleSubmit()}
            loading={isCompletingSignup}
          >
            Sign up
          </Button>
        </Stack>
      </Paper>
    </div>
  );
};

export default CompleteSignup;
