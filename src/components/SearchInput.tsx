import { Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';

import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';

import { useDebouncedValue } from '../hooks/useDebouncedValue';

interface SearchInputProps {
  placeholder?: string;
  /** Chamado com o valor já "debounced" (300ms de silêncio de digitação). */
  onChangeText: (term: string) => void;
  className?: string;
}

export function SearchInput({ placeholder = 'Buscar...', onChangeText, className }: SearchInputProps) {
  const [value, setValue] = useState('');
  const debounced = useDebouncedValue(value, 300);

  useEffect(() => {
    onChangeText(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <Input className={className}>
      <InputSlot className="pl-3">
        <InputIcon as={Search} />
      </InputSlot>
      <InputField
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        autoCorrect={false}
        returnKeyType="search"
      />
    </Input>
  );
}
