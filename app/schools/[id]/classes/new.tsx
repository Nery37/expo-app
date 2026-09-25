import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';

import { ClassForm } from '@/src/features/classes/components/ClassForm';
import { useClassesStore } from '@/src/features/classes/store/useClassesStore';

export default function NewClassScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const createClass = useClassesStore((state) => state.createClass);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1 bg-background" keyboardShouldPersistTaps="handled">
        <Box className="p-4">
          <ClassForm
            submitLabel="Cadastrar turma"
            onSubmit={async (values) => {
              await createClass(id, values);
              router.back();
            }}
          />
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
