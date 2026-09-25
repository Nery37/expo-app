import { TriangleAlert } from 'lucide-react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Box className="flex-1 items-center justify-center px-8 py-16">
      <VStack space="md" className="items-center">
        <Icon as={TriangleAlert} size="xl" className="text-destructive" />
        <Text className="text-center text-foreground">{message}</Text>
        {onRetry ? (
          <Button variant="outline" onPress={onRetry}>
            <ButtonText>Tentar novamente</ButtonText>
          </Button>
        ) : null}
      </VStack>
    </Box>
  );
}
