import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { Center, Heading, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-tiny-toast';
import uuid from 'react-native-uuid';
import * as yup from 'yup';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { RootTabParamList } from '../../../router';

type FormDataProps = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  confirmaSenha: string;
};

const schemaRegister = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  email: yup
    .string()
    .required('Email é obrigatório')
    .min(6, 'Informe  no minimo 6 digitos')
    .email('E-mail informado é inválido'),
  senha: yup
    .string()
    .required('Senha é obrigatório')
    .min(6, 'Informe no minimo 6 digitos')
    .max(12, 'e no máximo 12 digitos'),
  confirmaSenha: yup
    .string()
    .required('Confirma Senha é obrigatório')
    .oneOf([yup.ref('senha')], 'As senhas devem coincidir'),
});

type UsuarioRouteProp = BottomTabScreenProps<RootTabParamList, 'Usuario'>;

export const Usuario = ({ route, navigation }: UsuarioRouteProp) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(schemaRegister) as any,
  });

  const [loading, setLoading] = useState(true);

  async function handlerRegister(data: FormDataProps) {
    data.id = uuid.v4().toString();

    try {
      const responseData = await AsyncStorage.getItem('@hookForm:cadastro');
      const dbData = responseData ? JSON.parse(responseData!) : [];
      const previewData = [...dbData, data];

      await AsyncStorage.setItem(
        '@hookForm:cadastro',
        JSON.stringify(previewData)
      );

      Toast.showSuccess('Cadastro efetuado com sucesso!');

      reset();

      handleList();
    } catch (e) {
      console.log(e);
    }
  }

  async function handlerSearcher(id: string) {
    try {
      setLoading(true);
      const responseData = await AsyncStorage.getItem('@hookForm:cadastro');

      const dbData: FormDataProps[] = responseData
        ? JSON.parse(responseData)
        : [];

      const itemEncontrado = dbData?.find((item) => item.id === id);

      if (itemEncontrado)
        Object.keys(itemEncontrado).forEach((key) =>
          setValue(
            key as keyof FormDataProps,
            itemEncontrado?.[key as keyof FormDataProps] as string
          )
        );

      setLoading(false);
      console.log('aqui 2');
    } catch (e) {
      setLoading(false);
    }
  }

  function handleList() {
    navigation.navigate('Home');
  }

  useEffect(() => {
    if (route?.params?.id) handlerSearcher(route?.params?.id);
    else {
      reset();
      setLoading(false);
    }

    return () => setLoading(true);
  }, [route]);

  if (loading) return <ActivityIndicator size='large' color='#0000ff' />;

  return (
    <KeyboardAwareScrollView>
      <VStack bgColor='gray.300' flex={1} px={5} pb={100}>
        <Center>
          <Heading my={20}>Cadastro de jogadores</Heading>
          <Controller
            control={control}
            name='nome'
            defaultValue=''
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Nome'
                onChangeText={onChange}
                errorMessage={errors.nome?.message}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name='email'
            defaultValue=''
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='E-mail'
                onChangeText={onChange}
                errorMessage={errors.email?.message}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name='senha'
            defaultValue=''
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Senha'
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.senha?.message}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name='confirmaSenha'
            defaultValue=''
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder='Confirma senha'
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.confirmaSenha?.message}
                value={value}
              />
            )}
          />

          <Button title='Cadastrar' onPress={handleSubmit(handlerRegister)} />
        </Center>
      </VStack>
    </KeyboardAwareScrollView>
  );
};
