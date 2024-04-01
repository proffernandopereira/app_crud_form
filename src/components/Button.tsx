import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

type Props = IButtonProps &  {
    title: string;
    color?: string
}
export function Button({title, color = "green.700", ...res}: Props){
    return(
        <ButtonNativeBase
            w="full"
            h={20}
            bg={color}
            _pressed={{
                bgColor:"green.900"
            }}
            {...res}
        >
        <Text color= "white" fontSize={26}>{title}</Text>

        </ButtonNativeBase>
    )
}