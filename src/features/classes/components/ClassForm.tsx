import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { ApiError } from '@/src/services/http/httpClient';

import { classFormSchema, type ClassFormValues } from '../schema';
import { TURNO_LABELS, TURNOS } from '../types';

interface ClassFormProps {
  defaultValues?: ClassFormValues;
  submitLabel: string;
  onSubmit: (values: ClassFormValues) => Promise<void>;
}

export function ClassForm({ defaultValues, submitLabel, onSubmit }: ClassFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: defaultValues ?? {
      nome: '',
      turno: 'manha',
      anoLetivo: new Date().getFullYear(),
    },
  });

  async function submit(values: ClassFormValues) {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : 'Não foi possível salvar a turma.');
    }
  }

  return (
    <VStack space="lg">
      <FormControl isInvalid={!!errors.nome}>
        <FormControlLabel>
          <FormControlLabelText>Nome da turma</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Ex.: Turma A"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoFocus
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorText>{errors.nome?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.turno}>
        <FormControlLabel>
          <FormControlLabelText>Turno</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="turno"
          render={({ field: { onChange, value } }) => (
            <Select selectedValue={value} onValueChange={(v) => onChange(v)}>
              <SelectTrigger>
                <SelectInput placeholder="Selecione o turno" value={TURNO_LABELS[value]} />
                <SelectIcon as={ChevronDown} className="mr-3" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {TURNOS.map((turno) => (
                    <SelectItem key={turno} label={TURNO_LABELS[turno]} value={turno} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          )}
        />
        <FormControlError>
          <FormControlErrorText>{errors.turno?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isInvalid={!!errors.anoLetivo}>
        <FormControlLabel>
          <FormControlLabelText>Ano letivo</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="anoLetivo"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="2026"
                keyboardType="numeric"
                value={String(value ?? '')}
                onChangeText={(text) => onChange(Number(text.replace(/[^0-9]/g, '')))}
                onBlur={onBlur}
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorText>{errors.anoLetivo?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      {formError ? <Text className="text-destructive">{formError}</Text> : null}

      <Button onPress={handleSubmit(submit)} isDisabled={isSubmitting}>
        {isSubmitting ? <ButtonSpinner /> : null}
        <ButtonText>{submitLabel}</ButtonText>
      </Button>
    </VStack>
  );
}
