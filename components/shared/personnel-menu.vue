<template>
  <v-row class="align-items-center mx-2" style="cursor:pointer;">
    <v-avatar size="40" @click="drawerToggle()" v-if="isAdmin()">
      <v-img src="/ben.jpg" alt="lKotan"></v-img>
    </v-avatar>
    <v-avatar v-else size="40" @click="drawerToggle()">
      <v-img :src="personnelPhoto($auth.user.profilPtoho)"></v-img>
    </v-avatar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
      right
      class="blue-grey darken-4"
      dark
    >
      <v-list-item>
        <v-list-item-avatar v-if="isAdmin()">
          <v-img src="/ben.jpg"></v-img>
        </v-list-item-avatar>

         <v-list-item-avatar v-else>
          <v-img :src="personnelPhoto($auth.user.profilPtoho)"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ personnelName() }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in personnelMenu"
          :key="item.route"
          :nuxt="true"
          :to="item.route"
          class="text-decoration-none"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="Logout" :loading="loading">Çıkış Yap</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      drawer: false,
      personnelMenu: [
        {
          text: 'Hesabım',
          route: '/profile',
          icon: 'mdi-account'
        },
        {
          text: 'Görevlerim',
          route: '/my-assigments',
          icon: 'mdi-vector-circle'
        },
        {
          text: 'Bildirimlerim',
          route: '/my-notifications',
          icon: 'mdi-bell'
        }
      ]
    }
  },
  methods: {
    drawerToggle() {
      this.drawer = !this.drawer
    },
    Logout: async function() {
      this.loading = true
      await this.$auth.logout('local')
      this.loading = false
    }
  }
}
</script>
