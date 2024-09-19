import { Input } from 'src/assets/shadcn/components/ui/input.jsx'
import STlabel from 'src/common/components/typography/STlabel.jsx'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from 'src/assets/shadcn/components/ui/form.jsx'
import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'lodash.debounce'

import { useForm, Controller } from 'react-hook-form'

import { z } from 'zod'
import { useCallback, useState } from 'react'

// 기본 validation 스키마 (필요한 경우 외부에서 전달 받은 스키마로 대체 가능)
const defaultValidationSchema = z.object({
    value: z.string().min(1, '이 필드는 필수입니다'),
})

const SSinput = ({
                     type = 'text',
                     label = '',
                     onChange = (value) => {},
                     value = '',
                     placeholder,
                     validationRules = defaultValidationSchema,
                     description = '',
                     disabled = false,
                     className,
                 }) => {
    const [inputValue, setInputValue] = useState(value)
    const [isFocused, setIsFocused] = useState(false)
    const [hover, setHover] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(validationRules),
        defaultValues: { value: inputValue },
    })

    const handleInputChange = debounce((newValue) => {
        onChange(newValue)
        setInputValue(newValue)
    }, 300)

    const onFocus = () => {
        setIsFocused(true)
    }

    const onBlur = () => {
        setIsFocused(false)
    }

    const handleHover = (hoverState) => {
        setHover(hoverState)
    }

    return (
        <div className={`w-full`}>
            {label && <STlabel>{label}</STlabel>}
            <Controller
                name="value"
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        value={field.value}
                        onChange={(e) => { field.onChange(e); handleInputChange(e.target.value) }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onMouseEnter={() => handleHover(true)}
                        onMouseLeave={() => handleHover(false)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`${
                            isFocused ? 'focus:border-blue-500' : ''
                        } ${hover ? 'hover:border-gray-500' : ''} ${className}`}
                    />
                )}
            />
            {errors.value ? (
                <FormMessage>{errors.value.message}</FormMessage>
            ) : (
                description && <FormDescription>{description}</FormDescription>
            )}
        </div>
    )
}

export default SSinput

// import React, { useCallback, useEffect, useState } from 'react';
// import { Input } from 'src/assets/shadcn/components/ui/input.jsx';
// import debounce from 'lodash.debounce';
// import { useForm, Controller } from 'react-hook-form'
//
// const SSinput = ({
//                      type = 'text',
//                      label = '',
//                      onChange = () => {},
//                      value = '',
//                      placeholder,
//                      error = false,
//                      disabled = false,
//                      success = false,
//                      validationRules,  // additional validation rules as a plain object
//                      name,    // name of the field
//                  }) => {
//     const [inputValue, setInputValue] = useState(value);
//     const [errors, setErrors] = useState(null);
//
//     // Define default patterns based on input type
//     const defaultPatterns = {
//         email: {
//             pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//             patternMessage: 'Invalid email address',
//         },
//         password: {
//             minLength: 8,
//             pattern: /[a-zA-Z0-9@#$%^&*]/,
//             patternMessage: 'Password must contain letters, numbers, and special characters',
//         },
//         id: {
//             pattern: /^[a-zA-Z0-9_-]{3,16}$/,
//             patternMessage: 'Invalid ID format',
//         },
//         // Add more types as needed
//     };
//
//     const combinedValidationRules = {
//         ...defaultPatterns[type],  // Use default pattern if type matches
//         ...validationRules,  // Override or add more rules if provided
//     };
//
//     const validateInput = useCallback(
//         debounce((value) => {
//             if (combinedValidationRules) {
//                 const fieldErrors = [];
//
//                 if (combinedValidationRules.required && !value) {
//                     fieldErrors.push('This field is required');
//                 }
//                 if (combinedValidationRules.minLength && value.length < combinedValidationRules.minLength) {
//                     fieldErrors.push(`Minimum length is ${combinedValidationRules.minLength}`);
//                 }
//                 if (combinedValidationRules.maxLength && value.length > combinedValidationRules.maxLength) {
//                     fieldErrors.push(`Maximum length is ${combinedValidationRules.maxLength}`);
//                 }
//                 if (combinedValidationRules.pattern && !combinedValidationRules.pattern.test(value)) {
//                     fieldErrors.push(combinedValidationRules.patternMessage || 'Invalid format');
//                 }
//                 if (combinedValidationRules.custom) {
//                     const customError = combinedValidationRules.custom(value);
//                     if (customError) {
//                         fieldErrors.push(customError);
//                     }
//                 }
//
//                 setErrors(fieldErrors.length > 0 ? fieldErrors.join(', ') : null);
//             }
//         }, 300),  // 300ms debounce
//         [combinedValidationRules]
//     );
//
//     const handleChange = (e) => {
//         const newValue = e.target.value;
//         setInputValue(newValue);
//         validateInput(newValue);
//         onChange(e);
//     };
//
//     useEffect(() => {
//         if (combinedValidationRules) {
//             validateInput(value);
//         }
//     }, [combinedValidationRules, value, validateInput]);
//
//     return (
//         <div>
//             {label && <label>{label}</label>}
//             <Input
//                 type={type}
//                 value={inputValue}
//                 onChange={handleChange}
//                 placeholder={placeholder}
//                 disabled={disabled}
//             />
//             {errors && <span>{errors}</span>}
//         </div>
//     );
// };
//
// // Usage example
// export default function App() {
//     return (
//         <>
//             <SSinput name="username" label="Username" type="id" />
//             <SSinput name="email" label="Email" type="email" validationRules={{ required: true }} />
//             <SSinput name="password" label="Password" type="password" />
//         </>
//     );
// }
//
// //
// //
// // import { Input } from 'src/assets/shadcn/components/ui/input.jsx'
// // import STlabel from 'src/common/components/typography/STlabel.jsx'
// // import {
// //     Form,
// //     FormControl,
// //     FormDescription,
// //     FormField,
// //     FormItem,
// //     FormLabel,
// //     FormMessage,
// // } from 'src/assets/shadcn/components/ui/form.jsx'
// // import { zodResolver } from '@hookform/resolvers/zod'
// // import { debounce } from 'lodash.debounce'
// //
// // import { useForm } from 'react-hook-form'
// //
// // import { z } from 'zod'
// //
// // const SSinput = ({
// //                      type = 'text',
// //                      label = '',
// //                      onChange = () => {},
// //                      value = '',
// //                      placeholder,
// //                      error = false,
// //                      disabled = false,
// //                      success = false,
// //                  }) => {
// //     //todo
// //
// //     // 포커스시 처리
// //     // 호버시 처리
// //     // 애러 핸들 함수
// //     // 애러 처리 과정
// //     // 디자인 맞게
// //     // 값입력받기
// //     // 값처리 방법
// //     // 디바운스 처리
// //
// //     const formSchema = z.object({
// //         username: z.string().min(2).max(50),
// //         email: z.string().email(),
// //         password: z
// //             .string()
// //             .min(8)
// //             .regex(
// //                 /[a-zA-Z0-9@#$%^&*]/,
// //                 'Password must contain letters, numbers, and special characters',
// //             ),
// //         age: z
// //             .number()
// //             .min(18, 'Age must be at least 18')
// //             .max(100, 'Age must be at most 100'),
// //         website: z.string().url().optional(),
// //         phoneNumber: z
// //             .string()
// //             .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
// //             .optional(),
// //         isActive: z.boolean(),
// //         createdAt: z
// //             .date()
// //             .max(new Date(), 'Created date cannot be in the future'),
// //     })
// //     //
// //     // const form = useForm({
// //     //     resolver: zodResolver(FormSchema),
// //     //     defaultValues: {
// //     //         username: "",
// //     //     },
// //     // })
// //     //
// //     const handleInputChange = useCallback(
// //         debounce((value) => {
// //             form.setValue('username', value)
// //         }, 300),  // 300ms 디바운스
// //         []
// //     );
// //
// //
// //     const handleChange = (e) => {
// //         handleInputChange(e.target.value);
// //         onChange(e);
// //     };
// //
// //     const form = useForm({
// //         resolver: zodResolver(formSchema),
// //     });
// //
// //
// //
// //     return (
// //         <Form {...form}>
// //             <form className="space-y-8">
// //                 <FormField
// //                     control={form.control}
// //                     name="username"
// //                     render={({ field }) => (
// //                         <FormItem>
// //                             <FormLabel>{label}</FormLabel>
// //                             <FormControl>
// //                                 <Input
// //
// //                                     value={value}
// //                                     onChange={handleChange}
// //                                     placeholder={placeholder}
// //                                     {...field} />
// //                             </FormControl>
// //                             <FormDescription>
// //                                 This is your public display name.
// //                             </FormDescription>
// //                             <FormMessage />
// //                         </FormItem>
// //                     )}
// //                 />
// //             </form>
// //         </Form>
// //     )
// // }
// //
// // export default SSinput
// //
// //
// //
// //
// // import { Input } from 'src/assets/shadcn/components/ui/input.jsx'
// // import STlabel from 'src/common/components/typography/STlabel.jsx'
// // import {
// //     Form,
// //     FormControl,
// //     FormDescription,
// //     FormField,
// //     FormItem,
// //     FormLabel,
// //     FormMessage,
// // } from 'src/assets/shadcn/components/ui/form.jsx'
// // import { zodResolver } from '@hookform/resolvers/zod'
// // import debounce  from 'lodash.debounce'
// //
// // import { useForm } from 'react-hook-form'
// //
// // import { z } from 'zod'
// // import { useCallback } from 'react'
// //
// // const SSinput = ({
// //                      type = 'text',
// //                      label = '',
// //                      onChange = () => {},
// //                      value = '',
// //                      placeholder,
// //                      error = false,
// //                      disabled = false,
// //                      success = false,
// //                  }) => {
// //     //todo
// //
// //     // 포커스시 처리
// //     // 호버시 처리
// //     // 애러 핸들 함수
// //     // 애러 처리 과정
// //     // 디자인 맞게
// //     // 값입력받기
// //     // 값처리 방법
// //     // 디바운스 처리
// //
// //     const formSchema = z.object({
// //         username: z.string().min(2).max(50),
// //         email: z.string().email(),
// //         password: z
// //             .string()
// //             .min(8)
// //             .regex(
// //                 /[a-zA-Z0-9@#$%^&*]/,
// //                 'Password must contain letters, numbers, and special characters',
// //             ),
// //         age: z
// //             .number()
// //             .min(18, 'Age must be at least 18')
// //             .max(100, 'Age must be at most 100'),
// //         website: z.string().url().optional(),
// //         phoneNumber: z
// //             .string()
// //             .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
// //             .optional(),
// //         isActive: z.boolean(),
// //         createdAt: z
// //             .date()
// //             .max(new Date(), 'Created date cannot be in the future'),
// //     })
// //     //
// //     // const form = useForm({
// //     //     resolver: zodResolver(FormSchema),
// //     //     defaultValues: {
// //     //         username: "",
// //     //     },
// //     // })
// //     //
// //     const handleInputChange = useCallback(
// //         debounce((value) => {
// //             form.setValue('username', value)
// //         }, 300),  // 300ms 디바운스
// //         []
// //     );
// //
// //
// //     const handleChange = (e) => {
// //         handleInputChange(e.target.value);
// //         onChange(e);
// //     };
// //
// //     const form = useForm({
// //         resolver: zodResolver(formSchema),
// //     });
// //
// //
// //
// //     return (
// //         <Form {...form}>
// //             <form className="space-y-8">
// //                 <FormField
// //                     control={form.control}
// //                     name="username"
// //                     render={({ field }) => (
// //                         <FormItem>
// //                             <FormLabel>{label}</FormLabel>
// //                             <FormControl>
// //                                 <Input
// //
// //                                     value={value}
// //                                     onChange={handleChange}
// //                                     placeholder={placeholder}
// //                                     {...field} />
// //                             </FormControl>
// //                             <FormDescription>
// //                                 This is your public display name.
// //                             </FormDescription>
// //                             <FormMessage />
// //                         </FormItem>
// //                     )}
// //                 />
// //             </form>
// //         </Form>
// //     )
// // }
// //
// // export default SSinput
// //
// //
// //
// // // import { Input } from 'src/assets/shadcn/components/ui/input.jsx'
// // // import STlabel from 'src/common/components/typography/STlabel.jsx'
// // // import {
// // //     FormControl,
// // //     FormDescription,
// // //     FormItem,
// // //     FormLabel,
// // //     FormMessage,
// // // } from 'src/assets/shadcn/components/ui/form.jsx'
// // // import { useCallback, useState } from 'react'
// // // import debounce from 'lodash.debounce'
// // // import { z } from 'zod'
// // // import { Form } from 'react-hook-form'
// // //
// // // const SSinput = ({
// // //                      type = 'text',
// // //                      label = '',
// // //                      onChange = () => {},
// // //                      value = '',
// // //                      placeholder,
// // //                      description='',
// // //                      error = false,
// // //                      disabled = false,
// // //                      success = false,
// // //                  }) => {
// // //     const [inputValue, setInputValue] = useState(value);
// // //     const [errorMessage, setErrorMessage] = useState('');
// // //
// // //     const formSchema = z.object({
// // //         username: z.string().min(2, "Username must be at least 2 characters").max(50, "Username must be at most 50 characters"),
// // //     });
// // //
// // //     const handleChange = useCallback(
// // //         debounce((e) => {
// // //             const { value } = e.target;
// // //             try {
// // //                 formSchema.parse({ username: value });
// // //                 setErrorMessage('');
// // //             } catch (e) {
// // //                 if (e instanceof z.ZodError) {
// // //                     setErrorMessage(e.errors[0].message);
// // //                 }
// // //             }
// // //             setInputValue(value);
// // //             onChange(value);
// // //         }, 300),  // 300ms 디바운스
// // //         [onChange]
// // //     );
// // //
// // //     return (
// // //         <Form>
// // //             <FormItem>
// // //                 <FormLabel>{label}</FormLabel>
// // //                 <FormControl>
// // //                     <Input
// // //                         type={type}
// // //                         placeholder={placeholder}
// // //                         value={inputValue}
// // //                         onChange={handleChange}
// // //                         disabled={disabled}
// // //                     />
// // //                 </FormControl>
// // //                 <FormDescription>{description}</FormDescription>
// // //                 {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
// // //             </FormItem></Form>
// // //     )
// // // }
// // //
// // // export default SSinput
// // //
