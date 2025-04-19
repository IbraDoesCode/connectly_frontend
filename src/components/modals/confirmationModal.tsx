import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";

const confirmationModal = (
  title: string,
  message: string,
  onConfirm: () => void
) => {
  modals.openConfirmModal({
    title,
    children: <Text>{message}</Text>,
    labels: { confirm: "Delete", cancel: "Cancel" },
    onConfirm,
  });
};

export default confirmationModal;
