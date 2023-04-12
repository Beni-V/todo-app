import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';

function AuthenticationInputGroup({
  register,
  inputRightElementClassName,
  placeholder,
  registerName,
  inputRightElementChild,
  ...props
}) {
  return (
    <InputGroup maxWidth="75%" className="flex justify-center items-center">
      <Input
        placeholder={placeholder}
        className="border-black border w-full rounded p-3"
        {...register(registerName)}
        {...props}
      />
      <InputRightElement width="4em" className={inputRightElementClassName}>
        {inputRightElementChild}
      </InputRightElement>
    </InputGroup>
  );
}

export default AuthenticationInputGroup;
