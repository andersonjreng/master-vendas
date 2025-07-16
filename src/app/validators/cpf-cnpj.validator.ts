import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CpfCnpjValidator {
  static validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (!value) {
      return null; // Permite campo vazio
    }

    if (value.length === 11) {
      return this.validarCPF(value) ? null : { cpfInvalido: true };
    } else if (value.length === 14) {
      return this.validarCNPJ(value) ? null : { cnpjInvalido: true };
    }

    return { formatoInvalido: true };
  }

  private static validarCPF(cpf: string): boolean {
    let sum = 0, remainder;

    if (/^(.)\1+$/.test(cpf)) return false; // Evita CPFs com todos os dígitos iguais

    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf[10]);
  }

  private static validarCNPJ(cnpj: string): boolean {
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    let digits = cnpj.substring(length);
    let sum = 0, pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers[length - i]) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits[0])) return false;

    length++;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers[length - i]) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result === parseInt(digits[1]);
  }
}
