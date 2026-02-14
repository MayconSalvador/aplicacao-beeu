import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_phone(value):
    """
    Valida telefones brasileiros com DDD.
    Formatos aceitos:
    (XX) XXXXX-XXXX
    (XX) XXXX-XXXX
    XX XXXXX-XXXX
    XXXXXXXXXXX
    """
    # Remove caracteres não numéricos
    clean_value = re.sub(r'\D', '', value)
    
    if not 10 <= len(clean_value) <= 11:
        raise ValidationError(
            _('O telefone deve ter 10 ou 11 dígitos (com DDD).'),
            code='invalid_phone'
        )
    
    # Regex para validar formatos comuns se necessário, mas length check + cleaning é robusto o suficiente para armazenamento
    # Se quiser ser estrito com formato visual:
    # pattern = re.compile(r'^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$')
    # if not pattern.match(value): ...

def validate_cpf(value):
    """
    Valida formato de CPF (apenas dígitos).
    """
    clean_value = re.sub(r'\D', '', value)
    
    if len(clean_value) != 11:
        raise ValidationError(
            _('O CPF deve ter 11 dígitos.'),
            code='invalid_cpf'
        )
    
    # Aqui poderia entrar validação de algoritmo de CPF
    if clean_value == clean_value[0] * 11:
        raise ValidationError(_('CPF inválido.'))

    # Algoritmo de validação de CPF
    def calculate_digit(digits):
        s = sum(w * d for w, d in zip(range(len(digits) + 1, 1, -1), digits))
        d = 11 - s % 11
        return 0 if d >= 10 else d

    numbers = [int(d) for d in clean_value]
    
    if calculate_digit(numbers[:9]) != numbers[9]:
        raise ValidationError(_('CPF inválido.'))
    
    if calculate_digit(numbers[:10]) != numbers[10]:
        raise ValidationError(_('CPF inválido.'))
