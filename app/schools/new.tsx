import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';

import { SchoolForm } from '@/src/features/schools/components/SchoolForm';
import { useSchoolsStore } from '@/src/features/schools/store/useSchoolsStore';
import { useGoBackOr } from '@/src/hooks/useGoBackOr';

export default function NewSchoolScreen() {
  const goBack = useGoBackOr('/schools');
  const createSchool = useSchoolsStore((state) => state.createSchool);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1 bg-background" keyboardShouldPersistTaps="handled">
        <Box className="p-4">
          <SchoolForm
            submitLabel="Cadastrar escola"
            onSubmit={async (values) => {
              await createSchool(values);
              goBack();
            }}
          />
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
