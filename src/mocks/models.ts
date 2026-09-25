import { Model, belongsTo, hasMany } from 'miragejs';

/**
 * "school" tem muitas "class" (turmas); cada "class" pertence a uma "school".
 * O nome do modelo é interno ao Mirage — as rotas HTTP expostas (/schools,
 * /classes) são definidas separadamente em src/mocks/routes.
 */
export const models = {
  school: Model.extend({
    classes: hasMany('class'),
  }),
  class: Model.extend({
    school: belongsTo('school'),
  }),
};
