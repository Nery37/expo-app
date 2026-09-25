import { useRouter } from 'expo-router';
import { MapPin, Pencil, School as SchoolIcon, Trash2 } from 'lucide-react-native';

import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import type { School } from '../types';

interface SchoolListItemProps {
  school: School;
  onDelete: (school: School) => void;
}

export function SchoolListItem({ school, onDelete }: SchoolListItemProps) {
  const router = useRouter();
  const totalTurmas = school.turmas?.length ?? 0;

  return (
    <Pressable onPress={() => router.push(`/schools/${school.id}`)}>
      <Card className="gap-3">
        <HStack className="items-start justify-between">
          <HStack space="sm" className="flex-1 items-center">
            <Box>
              <Icon as={SchoolIcon} className="text-primary" size="md" />
            </Box>
            <VStack className="flex-1">
              <Heading size="sm" numberOfLines={1}>
                {school.nome}
              </Heading>
              <HStack space="xs" className="items-center">
                <Icon as={MapPin} size="2xs" className="text-muted-foreground" />
                <Text size="sm" className="flex-1 text-muted-foreground" numberOfLines={1}>
                  {school.endereco}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          <Badge variant="secondary">
            <BadgeText>
              {totalTurmas} {totalTurmas === 1 ? 'turma' : 'turmas'}
            </BadgeText>
          </Badge>
        </HStack>

        <HStack space="sm" className="justify-end border-t border-border pt-2">
          <Pressable
            className="flex-row items-center gap-1 px-2 py-1"
            onPress={() => router.push(`/schools/${school.id}/edit`)}
            hitSlop={8}
          >
            <Icon as={Pencil} size="xs" className="text-muted-foreground" />
            <Text size="sm" className="text-muted-foreground">
              Editar
            </Text>
          </Pressable>
          <Pressable
            className="flex-row items-center gap-1 px-2 py-1"
            onPress={() => onDelete(school)}
            hitSlop={8}
          >
            <Icon as={Trash2} size="xs" className="text-destructive" />
            <Text size="sm" className="text-destructive">
              Excluir
            </Text>
          </Pressable>
        </HStack>
      </Card>
    </Pressable>
  );
}
