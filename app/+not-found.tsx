import { Link, Stack } from 'expo-router';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <Box className="flex-1 items-center justify-center bg-background p-6">
        <VStack space="md" className="items-center">
          <Heading size="lg">Essa tela não existe</Heading>
          <Text className="text-muted-foreground">O link que você acessou não é válido.</Text>
          <Link href="/schools">
            <Text className="text-primary underline">Voltar para a lista de escolas</Text>
          </Link>
        </VStack>
      </Box>
    </>
  );
}
