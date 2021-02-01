<template>
  <v-app>
    <section class="main-view">
      <div class="container-scroller">
         <Header />
        <div class="container-fluid page-body-wrapper">
          <Sidebar />
          <div class="main-panel">
            <div
              class="content-wrapper d-flex flex-wrap w-100 align-items-strech"
            >
              <nuxt />
            </div>
            <Footer />
          </div>
        </div>
        <client-only>
          <VueConfirm />
        </client-only>
      </div>
    </section>
  </v-app>
</template>

<script>
import Sidebar from "@/components/partials/sidebar";
import Header from "@/components/partials/header";
import Footer from "@/components/partials/footer";

export default {
  components: {
    Sidebar,
    Header,
    Footer,
    VueConfirm: () => import("../components/shared/vue-confirm")
  },
   head() {
    return {
      bodyAttrs: {
        class: "sidebar-dark",
      },
    };
  },
};
</script>

<style></style>
