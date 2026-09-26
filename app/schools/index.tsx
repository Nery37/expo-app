import { useRouter } from 'expo-router';
import { Plus, School as SchoolIcon } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList } from 'react-native';

import { Box } from '@/components/ui/box';
import { Fab, FabIcon } from '@/components/ui/fab';
import { Spinner } from '@/components/ui/spinner';

import { ConfirmDeleteDialog } from '@/src/components/ConfirmDeleteDialog';
import { EmptyState } from '@/src/components/EmptyState';
import { ErrorState } from '@/src/components/ErrorState';
import { SearchInput } from '@/src/components/SearchInput';
import { SchoolListItem } from '@/src/features/schools/components/SchoolListItem';
import { useSchools } from '@/src/features/schools/hooks/useSchools';
import { useSchoolsStore } from '@/src/features/schools/store/useSchoolsStore';
import type { School } from '@/src/features/schools/types';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

export default function SchoolsListScreen() {
  const router = useRouter();
  const { schools, isLoading, isError, error, setSearchTerm, refetch } = useSchools();
  const deleteSchool = useSchoolsStore((state) => state.deleteSchool);
  const { columns } = useBreakpoint();
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);

  return (
    <Box className="flex-1 bg-background">
      <Box className="gap-3 px-4 pb-2 pt-4">
        <SearchInput placeholder="Buscar por nome ou endereço" onChangeText={setSearchTerm} />
      </Box>

      {isLoading && schools.length === 0 ? (
        <Box className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </Box>
      ) : isError ? (
        <ErrorState message={error ?? 'Não foi possível carregar as escolas.'} onRetry={refetch} />
      ) : schools.length === 0 ? (
        <EmptyState
          icon={SchoolIcon}
          title="Nenhuma escola cadastrada"
          description="Toque no botão + para cadastrar a primeira escola."
        />
      ) : (
        <FlatList
          key={columns}
          data={schools}
          keyExtractor={(item) => item.id}
          numColumns={columns}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          columnWrapperStyle={columns > 1 ? { gap: 12 } : undefined}
          renderItem={({ item }) => (
            <Box className={columns > 1 ? 'flex-1' : undefined}>
              <SchoolListItem school={item} onDelete={setSchoolToDelete} />
            </Box>
          )}
        />
      )}

      <Fab
        size="lg"
        placement="bottom right"
        accessibilityLabel="Adicionar escola"
        onPress={() => router.push('/schools/new')}
      >
        <FabIcon as={Plus} />
      </Fab>

      <ConfirmDeleteDialog
        isOpen={!!schoolToDelete}
        title="Excluir escola"
        description={`Tem certeza que deseja excluir "${schoolToDelete?.nome}"? Todas as turmas vinculadas também serão excluídas.`}
        onClose={() => setSchoolToDelete(null)}
        onConfirm={async () => {
          if (schoolToDelete) {
            await deleteSchool(schoolToDelete.id);
          }
          setSchoolToDelete(null);
        }}
      />
    </Box>
  );
}
