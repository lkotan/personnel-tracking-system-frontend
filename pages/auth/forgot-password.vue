<template>
   <div class="d-flex justify-content-center my-auto">
    <div class="d-flex flex-column p-5 login" style="">
      <div>
        <h4 class="text-center" style="letter-spacing:1.3px;">Lütfen Sisteme Kayıtlı E-Mail Adresinizi Giriniz</h4>
      </div>
      <v-form ref="form" v-model="valid" lazy-validation>
        <div class="mb-3 mt-5">
          <v-text-field
            v-model="email"
            label="E-mail"
            placeholder="E-mail"
            :rules="inputValidation.email"
            outlined
            dense
          ></v-text-field>
        </div>

        <div class="d-flex mt-5">
        <v-btn
          color="primary"
          :loading="loading"
          @click="forgotPassowrd"
          class="text-capitalize"
        >
          E-Posta Gönder
        </v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import { inputValidation } from "@/helpers/vuetify";
import { confirmOption } from "@/helpers/plugin-options";
export default {
  layout: "login",
    data() {
    return {
      valid: true,
      email: "",
      inputValidation,
      loading: false
    };
  },
  methods:{
    async forgotPassowrd(){
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      const res=await this.$PersonnelService.ForgotPassword(this.email);
      if(!res.success){
        this.loading=false;
         return this.$confirm(confirmOption.info(res.message, "Hata"));
      }
      this.$confirm(confirmOption.info("İşlem başaralı, lütfen E-mail adresinizi kontrol ediniz...", "Bilgilendirme"))
      this.$router.push("/auth/login");
      this.loading = false;
    }
  }
}
</script>

<style>

</style>