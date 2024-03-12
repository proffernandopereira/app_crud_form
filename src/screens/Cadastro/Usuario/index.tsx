import { Center, Heading, VStack } from 'native-base';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import uuid from 'react-native-uuid';
import AsyncStorage from "@react-native-async-storage/async-storage";
import  Toast  from "react-native-tiny-toast";
import { RouteProp, useNavigation } from '@react-navigation/native';

type FormDataProps = {
    id: any;
    nome: string;
    email: string;
    senha: string;
    confirmaSenha: string;
}

const schemaRegister = yup.object({
    nome: yup.string().required("Nome é obrigatório"),
    email: yup.string().required("Email é obrigatório").min(6, 'Informe  no minimo 6 digitos').email('E-mail informado é inválido'),
    senha: yup.string().required("Senha é obrigatório").min(6, 'Informe no minimo 6 digitos').max(12, 'e no máximo 12 digitos'),
    confirmaSenha: yup.string()
        .required("Confirma Senha é obrigatório")
        .oneOf([yup.ref('senha')], 'As senhas devem coincidir'),
})

type UsuarioRouteProp = RouteProp<{ Usuario: { id: string } }, 'Usuario'>;

type Props = {
    navigation: any
    route: UsuarioRouteProp;
};

export const Usuario =  ({navigation, route}: Props) => {
    const {control, handleSubmit, formState: {errors}} = useForm<FormDataProps>({
        resolver: yupResolver(schemaRegister) as any
    });

    async function handlerRegister(data:FormDataProps){
        data.id = uuid.v4();
        //console.log(data);
        
        try {
            //await AsyncStorage.removeItem('@hookForm:cadastro');
            const responseData = await AsyncStorage.getItem('@hookForm:cadastro');
            const dbData = responseData ? JSON.parse(responseData!) : [];
            const previewData = [...dbData, JSON.stringify(data)]
            
            await AsyncStorage.setItem('@hookForm:cadastro', JSON.stringify(previewData));
            Toast.showSuccess('Cadastro efetuado com sucesso!')
            handleList();
        } catch (e) {
            console.log(e);
        }
    };

    function handleList() {
        navigation.navigate('Home');
       }
    

    async function getData () {
        try {
          const jsonValue = await AsyncStorage.getItem('@hookForm:cadastro');
          const data = jsonValue ? JSON.parse(jsonValue) : [];
          console.log('Registro armazenado'+data);
          return jsonValue 
        } catch (e) {
          // error reading value
        }
      };
    return(
        <KeyboardAwareScrollView>
        <VStack bgColor="gray.300" flex={1} px={5} pb={100} >
            <Center>
                <Heading my={20}>
                Cadastro de jogadores
            </Heading>
            <Controller
                control={control}
                name="nome"
                /*rules={{
                    required:"Informe o nome",
                    minLength: {
                        value:3, 
                        message: "É necessário informar no mínimo 3 digitos"
                    }
                }}*/
                render={({field: {onChange}})=>(
                <Input 
                placeholder="Nome" 
                onChangeText={onChange}
                errorMessage= {errors.nome?.message}
                >
                </Input>
            )}/>

            <Controller
                control={control}
                name="email"
                /*rules={{
                    required:"Informe o email",
                    pattern:{
                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/,
                        message: "Email inválido"}
                }}*/
                render={({field: {onChange}})=>(
                <Input 
                placeholder="E-mail" 
                onChangeText={onChange}
                errorMessage= {errors.email?.message}
                >
                </Input>
            )}/>

            <Controller
                control={control}
                name="senha"
                render={({field: {onChange}})=>(
                <Input 
                placeholder="Senha" 
                onChangeText={onChange}
                secureTextEntry
                errorMessage= {errors.senha?.message}
                >
                </Input>
            )}/>

            <Controller
                control={control}
                name="confirmaSenha"
                render={({field: {onChange}})=>(
                <Input 
                placeholder="Confirma senha" 
                onChangeText={onChange}
                secureTextEntry
                errorMessage= {errors.confirmaSenha?.message}
                >
                </Input>
            )}/>         
            
            <Button title="Cadastrar" onPress={handleSubmit(handlerRegister)}></Button>
            </Center>
        </VStack>
        </KeyboardAwareScrollView>
    )
};

