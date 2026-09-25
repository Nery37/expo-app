import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, MapPin, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { Fab, FabIcon } from '@/components/ui/fab';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { ConfirmDeleteDialog } from '@/src/components/ConfirmDeleteDialog';
import { EmptyState } from '@/src/components/EmptyState';
import { ErrorState } from '@/src/components/ErrorState';
import { SearchInput } from '@/src/components/SearchInput';
import { ClassListItem } from '@/src/features/classes/components/ClassListItem';
import { useClasses } from '@/src/features/classes/hooks/useClasses';
import { useClassesStore, type TurnoFilter } from '@/src/features/classes/store/useClassesStore';
import { TURNO_LABELS, TURNOS, type SchoolClass } from '@/src/features/classes/types';
import { useSchool } from '@/src/features/schools/hooks/useSchool';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

const FILTERS: { label: string; value: TurnoFilter }[] = [
  { label: 'Todos', value: 'todos' },
  ...TURNOS.map((turno) => ({ label: TURNO_LABELS[turno], value: turno })),
];

export default function SchoolDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const school = useSchool(id);
  const { classes, isLoading, isError, error, setSearchTerm, turnoFilter, setTurnoFilter, refetch } =
    useClasses(id);
  const deleteClass = useClassesStore((state) => state.deleteClass);
  const { columns } = useBreakpoint();
  const [classToDelete, setClassToDelete] = useState<SchoolClass | null>(null);

  if (!school) {
    return (
      <Box className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-muted-foreground">Escola não encontrada.</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background">
      <VStack space="sm" className="border-b border-border px-4 pb-3 pt-4">
        <Heading size="lg">{school.nome}</Heading>
        <HStack space="xs" className="items-center">
          <Icon as={MapPin} size="xs" className="text-muted-foreground" />
          <Text size="sm" className="text-muted-foreground">
            {school.endereco}
          </Text>
        </HStack>
      </VStack>

      <Box className="gap-3 px-4 pb-2 pt-3">
        <SearchInput placeholder="Buscar turma pelo nome" onChangeText={setSearchTerm} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="sm">
            {FILTERS.map((filter) => {
              const isActive = turnoFilter === filter.value;
              return (
                <Pressable
                  key={filter.value}
                  onPress={() => setTurnoFilter(filter.value)}
                  className={`rounded-full border px-3 py-1.5 ${
                    isActive ? 'border-primary bg-primary' : 'border-border bg-background'
                  }`}
                >
                  <Text size="sm" className={isActive ? 'text-primary-foreground' : 'text-foreground'}>
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </HStack>
        </ScrollView>
      </Box>

      {isLoading && classes.length === 0 ? (
        <Box className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </Box>
      ) : isError ? (
        <ErrorState message={error ?? 'Não foi possível carregar as turmas.'} onRetry={refetch} />
      ) : classes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhuma turma encontrada"
          description="Toque no botão + para cadastrar uma turma nesta escola."
        />
      ) : (
        <FlatList
          key={columns}
          data={classes}
          keyExtractor={(item) => item.id}
          numColumns={columns}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          columnWrapperStyle={columns > 1 ? { gap: 12 } : undefined}
          renderItem={({ item }) => (
            <Box className={columns > 1 ? 'flex-1' : undefined}>
              <ClassListItem
                schoolClass={item}
                onEdit={(schoolClass) =>
                  router.push(`/schools/${school.id}/classes/${schoolClass.id}/edit`)
                }
                onDelete={setClassToDelete}
              />
            </Box>
          )}
        />
      )}

      <Fab
        size="lg"
        placement="bottom right"
        onPress={() => router.push(`/schools/${school.id}/classes/new`)}
      >
        <FabIcon as={Plus} />
      </Fab>

      <ConfirmDeleteDialog
        isOpen={!!classToDelete}
        title="Excluir turma"
        description={`Tem certeza que deseja excluir "${classToDelete?.nome}"?`}
        onClose={() => setClassToDelete(null)}
        onConfirm={async () => {
          if (classToDelete) {
            await deleteClass(school.id, classToDelete.id);
          }
          setClassToDelete(null);
        }}
      />
    </Box>
  );
}
