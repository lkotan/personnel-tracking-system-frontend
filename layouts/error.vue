<template>
  <section class="error_500">
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div
          class="content-wrapper d-flex align-items-center text-center error-page bg-info"
        >
          <div class="row flex-grow">
            <div class="col-lg-7 mx-auto text-white">
              <div class="row align-items-center d-flex flex-row">
                <div class="col-lg-6 text-lg-right pr-lg-4">
                  <h1 class="display-1 mb-0">{{ statusCode }}</h1>
                </div>
                <div class="col-lg-6 error-page-divider text-lg-left pl-lg-4">
                  <h2>OOPS!</h2>
                  <h3 class="font-weight-light">{{ message }}</h3>
                </div>
              </div>
              <div class="row mt-5">
                <div class="col-12 text-center mt-xl-2">
                  <router-link
                    class="text-white font-weight-medium"
                    to="/"
                    v-if="statusCode != 401"
                    >Pano Sayfası</router-link
                  >
                  <nuxt-link
                    class="text-white font-weight-medium"
                    to="/auth/login"
                    v-else
                    >Giriş Yap</nuxt-link
                  >
                </div>
              </div>
              <div class="row mt-5">
                <div class="col-12 mt-xl-2">
                  <p class="text-white font-weight-medium text-center">
                    Copyright © {{dateNow()}} Personel Takip Sistemi. Tüm hakları saklıdır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ["error"],
  layout: "error-pages",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500;
    },
    message() {
      switch (this.statusCode) {
        case 403:
          return "Bu İşlemi Yapma Yetkiniz Yok";
        case 400:
          return "Kötü İstek Algılandı";
        case 401:
          this.$router.push("/auth/login");
          return "Oturumunuz Sonlandı";
        default:
          return this.error.message;
      }
    },
  },
};
</script>