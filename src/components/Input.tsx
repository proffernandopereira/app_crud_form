import { Input as NativeBaseInput, IInputProps, FormControl } from "native-base";

type InputProps = IInputProps &{
    errorMessage?: string | null
}
export function  Input({errorMessage = null, isInvalid,  ...res}: InputProps ){
    const invalid = !!errorMessage || isInvalid;
    return(
        <FormControl mb={4} isInvalid={invalid}>
            <NativeBaseInput
                bgColor={"gray.100"}
                fontSize="md"
                h={20}
                mb={4}
                placeholderTextColor={"gray.500"}
                isInvalid={invalid}
                _focus={{
                    bg: "gray.100",
                    borderWidth: "2px",
                    borderColor: "green.500"
                }}    
                _invalid={{
                    borderWidth: "2px",
                    borderColor:"pink.300"
                }}
                {...res}
            />
            <FormControl.ErrorMessage>
                {errorMessage}
            </FormControl.ErrorMessage>
            
        </FormControl>
    );
}