import type { LucideIcon } from 'lucide-react-native';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box className="flex-1 items-center justify-center px-8 py-16">
      <VStack space="md" className="items-center">
        <Box className="rounded-full bg-secondary p-4">
          <Icon as={icon} size="xl" className="text-muted-foreground" />
        </Box>
        <Heading size="md" className="text-center">
          {title}
        </Heading>
        {description ? (
          <Text className="text-center text-muted-foreground">{description}</Text>
        ) : null}
        {action}
      </VStack>
    </Box>
  );
}
