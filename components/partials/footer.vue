<template>
  <v-bottom-navigation
    color="teal"
    grow
    class="mt-5 mb-3 shadow-none"
  >
    <v-btn @click="goSite(1)">
      <span>Github Profile</span>
      <v-icon>mdi-github</v-icon>
    </v-btn>

    <v-btn @click="goSite(2)">
      <span>Linkedin</span>
     <v-icon>mdi-linkedin</v-icon>
    </v-btn>

    <v-btn @click="goSite(3)">
      <span>Facebook</span>
      <v-icon>mdi-facebook</v-icon>
    </v-btn>

    <p class="d-flex align-items-center ml-auto mr-5 m-0 p-0"> Copyright © {{dateNow()}} Personel Takip Sistemi. Tüm hakları saklıdır.</p>

  </v-bottom-navigation>
</template>

<script>
import moment from 'moment'
export default {
  name: "app-footer",
  methods:{
    goSite(site){
      if(site==1) window.open("https://github.com/lkotan?tab=repositories","_blank");
      else if(site==2) window.open("https://www.linkedin.com/in/l%C3%BCtfi-kotan-769004198/","_blank");
      else window.open("https://www.facebook.com/lutfi.kotan.54/","_blank");
    },
  }
};
</script>