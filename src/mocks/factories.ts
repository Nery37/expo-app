import { Factory } from 'miragejs';
import { fakerPT_BR as faker } from '@faker-js/faker';

import { TURNOS } from '../features/classes/types';

const SCHOOL_PREFIXES = ['EMEF', 'EMEI', 'CEI', 'Escola Municipal', 'Colégio Municipal'];

function isoNow() {
  return new Date().toISOString();
}

export const factories = {
  school: Factory.extend({
    nome() {
      const prefix = faker.helpers.arrayElement(SCHOOL_PREFIXES);
      const patrono = faker.person.lastName();
      return `${prefix} ${patrono}`;
    },
    endereco() {
      return `${faker.location.streetAddress()}, ${faker.location.city()} - ${faker.location.state({ abbreviated: true })}`;
    },
    createdAt: isoNow,
    updatedAt: isoNow,
  }),

  class: Factory.extend({
    nome(index: number) {
      const letra = String.fromCharCode(65 + (index % 6));
      return `Turma ${letra}`;
    },
    turno() {
      return faker.helpers.arrayElement(TURNOS);
    },
    anoLetivo() {
      return new Date().getFullYear();
    },
    createdAt: isoNow,
    updatedAt: isoNow,
  }),
};
