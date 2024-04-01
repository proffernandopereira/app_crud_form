// ExcluirItemDialog.tsx

import { background } from 'native-base/lib/typescript/theme/styled-system';
import React from 'react';
import { Button, HStack, Text, VStack } from 'native-base';

interface ExcluirItemDialogProps {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ExcluirItemDialog: React.FC<ExcluirItemDialogProps> = ({ isVisible, onCancel, onConfirm }) => {
  if (!isVisible) return null;

  return (
    <VStack  bg={'#FAFFF5'} p={7}>
      <Text fontSize={16}  bold>Deseja realmente excluir este item?</Text>
      <HStack  space={2} justifyContent="center">
        <Button  rounded="md" shadow={3} h={100} w={150} bgColor={'#FCA53A'} onPress={onCancel}>Cancelar</Button>
        <Button  rounded="md" shadow={3} h={100} w={150} bgColor={'#FC3F3A'} onPress={onConfirm}>Confirmar</Button>

      </HStack>

    </VStack>
  );
};

