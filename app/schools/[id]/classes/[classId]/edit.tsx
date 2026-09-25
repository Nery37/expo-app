import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

import { ClassForm } from '@/src/features/classes/components/ClassForm';
import { useClassesStore } from '@/src/features/classes/store/useClassesStore';

export default function EditClassScreen() {
  const router = useRouter();
  const { id, classId } = useLocalSearchParams<{ id: string; classId: string }>();
  const schoolClass = useClassesStore((state) =>
    (state.classesBySchool[id] ?? []).find((item) => item.id === classId),
  );
  const updateClass = useClassesStore((state) => state.updateClass);

  if (!schoolClass) {
    return (
      <Box className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-muted-foreground">Turma não encontrada.</Text>
      </Box>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1 bg-background" keyboardShouldPersistTaps="handled">
        <Box className="p-4">
          <ClassForm
            defaultValues={{
              nome: schoolClass.nome,
              turno: schoolClass.turno,
              anoLetivo: schoolClass.anoLetivo,
            }}
            submitLabel="Salvar alterações"
            onSubmit={async (values) => {
              await updateClass(id, schoolClass.id, values);
              router.back();
            }}
          />
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
