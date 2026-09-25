import { zodResolver } from '@hookform/resolvers/zod';
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
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { ApiError } from '@/src/services/http/httpClient';

import { schoolFormSchema, type SchoolFormValues } from '../schema';

interface SchoolFormProps {
  defaultValues?: SchoolFormValues;
  submitLabel: string;
  onSubmit: (values: SchoolFormValues) => Promise<void>;
}

export function SchoolForm({ defaultValues, submitLabel, onSubmit }: SchoolFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: defaultValues ?? { nome: '', endereco: '' },
  });

  async function submit(values: SchoolFormValues) {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : 'Não foi possível salvar a escola.');
    }
  }

  return (
    <VStack space="lg">
      <FormControl isInvalid={!!errors.nome}>
        <FormControlLabel>
          <FormControlLabelText>Nome da escola</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Ex.: EMEF Anísio Teixeira"
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

      <FormControl isInvalid={!!errors.endereco}>
        <FormControlLabel>
          <FormControlLabelText>Endereço</FormControlLabelText>
        </FormControlLabel>
        <Controller
          control={control}
          name="endereco"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input>
              <InputField
                placeholder="Rua, número, bairro"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            </Input>
          )}
        />
        <FormControlError>
          <FormControlErrorText>{errors.endereco?.message}</FormControlErrorText>
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
