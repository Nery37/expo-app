import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

import { SchoolForm } from '@/src/features/schools/components/SchoolForm';
import { useSchool } from '@/src/features/schools/hooks/useSchool';
import { useSchoolsStore } from '@/src/features/schools/store/useSchoolsStore';

export default function EditSchoolScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const school = useSchool(id);
  const updateSchool = useSchoolsStore((state) => state.updateSchool);

  if (!school) {
    return (
      <Box className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-muted-foreground">Escola não encontrada.</Text>
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
          <SchoolForm
            defaultValues={{ nome: school.nome, endereco: school.endereco }}
            submitLabel="Salvar alterações"
            onSubmit={async (values) => {
              await updateSchool(school.id, values);
              router.back();
            }}
          />
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
