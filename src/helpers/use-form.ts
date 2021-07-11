import { ref, computed, Ref, ComputedRef } from 'vue'

export interface FieldValidationState {
  isFieldValid: boolean
  validationErrorType: string
  isFieldTouched: boolean
}
export interface FormFieldState {
  fieldValue: Ref<any>
  setFieldValue: (value: any) => void
  fieldValidationState: ComputedRef<FieldValidationState>
}

const defaultValidatorFn = (value: any) => ({
  isFieldValid: Boolean(value),
  validationErrorType: 'EmptyField'
})

export const useFormField = (initialValue: string|number|boolean, validatorFn: (value: any) => Omit<FieldValidationState, 'isFieldTouched'>): FormFieldState => {
  validatorFn = validatorFn || defaultValidatorFn
  const fieldValue = ref(initialValue)
  const setFieldValue = (value: any) => {
    isFieldTouched.value = true
    fieldValue.value = value
  }
  const isFieldTouched = ref(false)

  // instant validation on change, TODO: we will have validation on clicking the disabled next button instead?
  const fieldValidationState = computed(() => {
    // wait for the user to input a value before marking as invalid
    const { isFieldValid, validationErrorType } = validatorFn(fieldValue.value)

    return {
      isFieldValid,
      validationErrorType,
      isFieldTouched: isFieldTouched.value
    }
  })
  return {
    fieldValue,
    setFieldValue,
    fieldValidationState
  }
}
export interface InitialFormState {
  [key: string]: {
    initialValue: any
    validatorFn?: (value: any) => Omit<FieldValidationState, 'isFieldTouched'>
  }
}

export interface FormState {
  updateField: (path: string, value: any) => void
  isFormValid: ComputedRef<boolean>
  formState: {
    [key:string]: Ref<any>
  }
  validationState: {
    [key:string]: ComputedRef<FieldValidationState>
  },
}

export const useForm = (initialState: InitialFormState): FormState => {
  const formFields: {[key:string]: FormFieldState} = Object.keys(initialState)
    .map((fieldName: string): {[key:string]: FormFieldState} => {
      let { initialValue, validatorFn } = initialState[fieldName]
      validatorFn = validatorFn || defaultValidatorFn
      return { [fieldName]: useFormField(initialValue, validatorFn) }
    })
    .reduce((accum: any, fieldState) => {
      return { ...accum, ...fieldState }
    }, {})

  const updateField = (path: string, value:any) => {
    formFields[path].setFieldValue(value)
  }

  const isFormValid: ComputedRef<boolean> = computed(() => {
    return Object.values(formFields).reduce((accum, fieldState) => {
      return accum && fieldState.fieldValidationState.value.isFieldValid
    }, true as boolean)
  })

  const formState = Object.entries(formFields).reduce((accum, [fieldName, fieldState]) => {
    return {
      ...accum,
      formState: { ...accum.formState, [fieldName]: fieldState.fieldValue },
      validationState: { ...accum.validationState, [fieldName]: fieldState.fieldValidationState }
    }
  }, { isFormValid, updateField, formState: {}, validationState: {} })

  return formState
}
