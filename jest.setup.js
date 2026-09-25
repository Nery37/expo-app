// O ambiente de teste (jest-environment-node) não tem `self`/XMLHttpRequest,
// mas o MirageJS/Pretender precisa dos dois para "interceptar" (ele
// monkey-patcha `self.XMLHttpRequest`). Em runtime no app, o React Native já
// fornece o seu próprio — este polyfill existe só para os testes rodarem
// em Node.
global.self = global.self || global;
global.XMLHttpRequest = global.XMLHttpRequest || require('xhr2');

// react-native-svg (usado pelos ícones do gluestack-ui) puxa, através do seu
// mixin de Touchable, o View "css-interopado" do react-native-css — e esse
// caminho quebra sob o mock de View do preset de testes do RN (nativewind
// v5 ainda é preview). Como os testes de componente aqui não verificam a
// renderização real do SVG, um mock simples evita esse conflito.
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockedSvgComponent = React.forwardRef((props, ref) =>
    React.createElement(View, { ...props, ref }, props.children),
  );
  MockedSvgComponent.displayName = 'MockedSvgComponent';
  return new Proxy(
    { default: MockedSvgComponent },
    { get: () => MockedSvgComponent },
  );
});
