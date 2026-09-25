import { Serializer } from 'miragejs';

// As tipagens do MirageJS para `Serializer.extend(...)` retornam
// `SerializerInterface | {}`, então sem este cast o `.extend` encadeado
// abaixo (school/class) não tipa. Workaround conhecido da própria comunidade
// Mirage para esse ponto fraco das tipagens oficiais.
const ApplicationSerializer = Serializer.extend({
  root: false,
  embed: true,
}) as typeof Serializer;

export const serializers = {
  application: ApplicationSerializer,

  // GET /schools e /schools/:id embutem as turmas da escola sob a chave
  // "turmas", conforme pedido no enunciado ("cada escola pode ter um array
  // de turmas associadas").
  school: ApplicationSerializer.extend({
    include: ['classes'],
    keyForEmbeddedRelationship() {
      return 'turmas';
    },
  }),

  // GET/POST/PUT /classes inclui o "schoolId" (chave estrangeira do
  // belongsTo) na resposta — por padrão o Serializer base do Mirage remove
  // chaves estrangeiras das respostas, e considera toda associação como
  // "embutida" quando `embed: true` é herdado do ApplicationSerializer
  // (nunca reanexando o id da FK nesse caso). `embed` como função em vez de
  // `false` desliga o embed sem esbarrar na regra do Mirage que proíbe
  // combinar `embed: false` com `root: false`.
  class: ApplicationSerializer.extend({
    embed: () => false,
    serializeIds: 'always',
  }),
};
