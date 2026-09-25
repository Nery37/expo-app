import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

if (__DEV__) {
  // Backend simulado (MirageJS): só sobe em desenvolvimento, nunca num build
  // de produção real.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@/src/mocks/server').startMockServer();
}

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: 'white' },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="schools/index" options={{ title: 'Escolas' }} />
          <Stack.Screen
            name="schools/new"
            options={{ title: 'Nova escola', presentation: 'modal' }}
          />
          <Stack.Screen
            name="schools/[id]/index"
            options={{ title: 'Detalhes da escola' }}
          />
          <Stack.Screen
            name="schools/[id]/edit"
            options={{ title: 'Editar escola', presentation: 'modal' }}
          />
          <Stack.Screen
            name="schools/[id]/classes/new"
            options={{ title: 'Nova turma', presentation: 'modal' }}
          />
          <Stack.Screen
            name="schools/[id]/classes/[classId]/edit"
            options={{ title: 'Editar turma', presentation: 'modal' }}
          />
          <Stack.Screen name="+not-found" options={{ title: 'Não encontrado' }} />
        </Stack>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
