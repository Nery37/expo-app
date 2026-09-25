import { Pencil, Trash2 } from 'lucide-react-native';

import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import type { SchoolClass } from '../types';
import { TurnoBadge } from './TurnoBadge';

interface ClassListItemProps {
  schoolClass: SchoolClass;
  onEdit: (schoolClass: SchoolClass) => void;
  onDelete: (schoolClass: SchoolClass) => void;
}

export function ClassListItem({ schoolClass, onEdit, onDelete }: ClassListItemProps) {
  return (
    <Card className="gap-2">
      <HStack className="items-center justify-between">
        <VStack className="flex-1">
          <Heading size="sm">{schoolClass.nome}</Heading>
          <Text size="sm" className="text-muted-foreground">
            Ano letivo {schoolClass.anoLetivo}
          </Text>
        </VStack>
        <TurnoBadge turno={schoolClass.turno} />
      </HStack>

      <HStack space="sm" className="justify-end border-t border-border pt-2">
        <Pressable
          className="flex-row items-center gap-1 px-2 py-1"
          onPress={() => onEdit(schoolClass)}
          hitSlop={8}
        >
          <Icon as={Pencil} size="xs" className="text-muted-foreground" />
          <Text size="sm" className="text-muted-foreground">
            Editar
          </Text>
        </Pressable>
        <Pressable
          className="flex-row items-center gap-1 px-2 py-1"
          onPress={() => onDelete(schoolClass)}
          hitSlop={8}
        >
          <Icon as={Trash2} size="xs" className="text-destructive" />
          <Text size="sm" className="text-destructive">
            Excluir
          </Text>
        </Pressable>
      </HStack>
    </Card>
  );
}
