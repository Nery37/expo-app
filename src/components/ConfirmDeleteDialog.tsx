import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

/** Diálogo de confirmação reutilizável para exclusões (escola ou turma). */
export function ConfirmDeleteDialog({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading size="md">{title}</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text className="text-muted-foreground">{description}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button variant="outline" onPress={onClose} isDisabled={isDeleting}>
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button variant="destructive" onPress={handleConfirm} isDisabled={isDeleting}>
            {isDeleting ? <ButtonSpinner /> : null}
            <ButtonText>Excluir</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
