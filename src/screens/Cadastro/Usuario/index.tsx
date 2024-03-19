import { Center, Heading, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
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
import { RootTabParamList } from '../../../router';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { ActivityIndicator } from 'react-native';

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

type UsuarioRouteProp = BottomTabScreenProps<RootTabParamList, 'Usuario'>;

type Props = {
    navigation: any
    route: UsuarioRouteProp;
};

export const Usuario = ({ route, navigation }: UsuarioRouteProp) => {
    const {control, handleSubmit, setValue, reset, formState: {errors}} = useForm<FormDataProps>({
        defaultValues: {
            nome: "",
            email: "",
            senha: "",
            confirmaSenha: ""
          },
        resolver: yupResolver(schemaRegister) as any
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (route.params && route.params.id && route.params.id.trim() !== '') {
            handlerSearcher(route.params.id);
        }else{
        
            setLoading(false);
        }
    }, [setLoading]);

    async function handlerRegister(data:FormDataProps){
        data.id = uuid.v4();
        //console.log(data);
        
        try {
            //await AsyncStorage.removeItem('@hookForm:cadastro');
            const responseData = await AsyncStorage.getItem('@hookForm:cadastro');
            const dbData = responseData ? JSON.parse(responseData!) : [];
            const previewData = [...dbData, data]
            
            await AsyncStorage.setItem('@hookForm:cadastro', JSON.stringify(previewData));
            Toast.showSuccess('Cadastro efetuado com sucesso!')
            reset({nome: '', email: '', senha:'', confirmaSenha:'',id: ''});
            handleList();
        } catch (e) {
            console.log(e);
        }
    };

    
    async function handlerSearcher(id: any) {
        try {
            const responseData = await AsyncStorage.getItem('@hookForm:cadastro');
            const dbData: FormDataProps[] = responseData ? JSON.parse(responseData) : [];
            const itemEncontrado = dbData.find(item => item.id === id);

            if (itemEncontrado) {
                console.log('itemEncontrado:', itemEncontrado); 
                
                setValue('nome', itemEncontrado.nome);
                setValue('email', itemEncontrado.email);
                setValue('senha', itemEncontrado.senha);
                setValue('confirmaSenha', itemEncontrado.confirmaSenha);
                
            } else {
                console.log('Item não encontrado.');
            }
        } catch (e) {
            console.log(e);
        }finally {
            setLoading(false); // Defina o estado de loading para false, indicando que a busca terminou
        }
    };

    function handleList() {
        navigation.navigate('Home');
    }

    if (loading) {
        return (
            <ActivityIndicator size="large" color="#0000ff" />
        );
    }
    return (
        
        <KeyboardAwareScrollView>
            <VStack bgColor="gray.300" flex={1} px={5} pb={100}>
                <Center>
                    <Heading my={20}>
                        Cadastro de jogadores
                    </Heading>
                    <Controller
                        control={control}
                        name="nome"
                        defaultValue=''
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder="Nome"
                                onChangeText={onChange}
                                errorMessage={errors.nome?.message}
                            />
                        )} />

                    <Controller
                        control={control}
                        name="email"
                        defaultValue=''
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder="E-mail"
                                onChangeText={onChange}
                                errorMessage={errors.email?.message}
                            />
                        )} />

                    <Controller
                        control={control}
                        name="senha"
                        defaultValue=''
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder="Senha"
                                onChangeText={onChange}
                                secureTextEntry
                                errorMessage={errors.senha?.message}
                            />
                        )} />

                    <Controller
                        control={control}
                        name="confirmaSenha"
                        defaultValue=''
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder="Confirma senha"
                                onChangeText={onChange}
                                secureTextEntry
                                errorMessage={errors.confirmaSenha?.message}
                            />
                        )} />

                    <Button title="Cadastrar" onPress={handleSubmit(handlerRegister)}  />
                </Center>
            </VStack>
        </KeyboardAwareScrollView>
    );
};