const inputValidation = {
  required: [
    v => !!v || 'Zorunlu alan.',
  ],
  email: [
    v => /.+@.+/.test(v) || 'E-Posta adresi doğru değil',
  ],
   phone: [
     v => (v != undefined ? v.replace(/\(/g, '').replace(/\-/g, '').replace(/\)/g, '').length == 11 : "") || 'Telefon alanı 11 haneden oluşmalıdır',
   ],
}
export {
  inputValidation,
};