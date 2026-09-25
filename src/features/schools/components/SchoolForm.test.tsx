import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { SchoolForm } from './SchoolForm';

describe('SchoolForm', () => {
  it('mostra erros de validação e não chama onSubmit quando os campos estão vazios', async () => {
    const onSubmit = jest.fn();
    render(<SchoolForm submitLabel="Cadastrar escola" onSubmit={onSubmit} />);

    fireEvent.press(screen.getByText('Cadastrar escola'));

    await waitFor(() => {
      expect(screen.getByText('Informe o nome da escola.')).toBeTruthy();
      expect(screen.getByText('Informe o endereço da escola.')).toBeTruthy();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('chama onSubmit com os valores preenchidos', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<SchoolForm submitLabel="Cadastrar escola" onSubmit={onSubmit} />);

    fireEvent.changeText(screen.getByPlaceholderText('Ex.: EMEF Anísio Teixeira'), 'Escola Teste');
    fireEvent.changeText(screen.getByPlaceholderText('Rua, número, bairro'), 'Rua Teste, 100');
    fireEvent.press(screen.getByText('Cadastrar escola'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ nome: 'Escola Teste', endereco: 'Rua Teste, 100' });
    });
  });
});
