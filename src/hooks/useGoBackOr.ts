import { useRouter } from 'expo-router';

/**
 * `router.back()` dispara um aviso ("GO_BACK not handled") quando a tela
 * atual não tem histórico de navegação — por exemplo, ao abrir um link direto
 * para uma rota de modal. Usado ao fechar os formulários de criar/editar
 * após salvar com sucesso.
 */
export function useGoBackOr(fallbackHref: string) {
  const router = useRouter();

  return () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackHref as never);
    }
  };
}
