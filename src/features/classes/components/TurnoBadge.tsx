import { Badge, BadgeText } from '@/components/ui/badge';

import { TURNO_LABELS, type Turno } from '../types';

const TURNO_VARIANT: Record<Turno, 'default' | 'secondary' | 'outline'> = {
  manha: 'default',
  tarde: 'secondary',
  noite: 'outline',
  integral: 'default',
};

export function TurnoBadge({ turno }: { turno: Turno }) {
  return (
    <Badge variant={TURNO_VARIANT[turno]}>
      <BadgeText>{TURNO_LABELS[turno]}</BadgeText>
    </Badge>
  );
}
