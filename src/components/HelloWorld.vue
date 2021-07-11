<template>
  <div class="hello">
    <form>
      <div>
    First Name: <input type="text" name="firstName" :value="formState.firstName.value" @input="handleFieldChanged" />
    <p v-if="validationState.firstName.value.isFieldTouched && !validationState.firstName.value.isFieldValid">
      Error: {{validationState.firstName.value.validationErrorType}}
    </p>
    </div>
    <div>
    Last Name: <input type="text" name="lastName" :value="formState.lastName.value" @input="handleFieldChanged" />
    <p v-if="validationState.lastName.value.isFieldTouched && !validationState.lastName.value.isFieldValid">
      Error: {{validationState.lastName.value.validationErrorType}}
    </p>
    </div>
    <div>
    Email: <input type="email" name="email" inputmode="email" :value="formState.email.value" @input="handleFieldChanged" />
    <p v-if="validationState.email.value.isFieldTouched && !validationState.email.value.isFieldValid">
      Error: {{validationState.email.value.validationErrorType}}
    </p>
    </div>

    isFormValid? : {{isFormValid}}
    </form>

  </div>
</template>

<script lang="ts">
import { useForm } from '@/helpers/use-form'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup () {
    const { updateField, isFormValid, formState, validationState } = useForm({
      firstName: {
        initialValue: 'Derp'
      },
      lastName: {
        initialValue: ''
      },
      email: {
        initialValue: '',
        validatorFn: (value) => {
        // eslint-disable-next-line
        const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i

          return {
            isFieldValid: emailRegex.test(value),
            validationErrorType: 'InvalidEmail'
          }
        }
      }
    })
    const handleFieldChanged = (e: any) => {
      updateField(e.target.name, e.target.value)
    }
    return {
      isFormValid, formState, validationState, updateField, handleFieldChanged
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
